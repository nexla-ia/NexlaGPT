interface O4MiniResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface TokenConsumption {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  timestamp: Date;
  userId: string;
  conversationId: string;
}

class O4MiniService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  private model = 'o1-mini';
  
  // Preços por token (em USD)
  private pricing = {
    prompt: 0.003 / 1000,      // $3.00 per 1M tokens
    completion: 0.012 / 1000   // $12.00 per 1M tokens
  };

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  async sendMessage(
    message: string, 
    conversationHistory: any[], 
    userId: string,
    conversationId: string
  ): Promise<{ response: string; tokenConsumption: TokenConsumption }> {
    try {
      const messages = this.formatMessages(message, conversationHistory);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: O4MiniResponse = await response.json();
      const usage = data.usage;
      
      // Calcular custo real baseado no uso
      const cost = this.calculateCost(usage.prompt_tokens, usage.completion_tokens);
      
      const tokenConsumption: TokenConsumption = {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        cost,
        timestamp: new Date(),
        userId,
        conversationId
      };

      // Registrar consumo no sistema de monitoramento
      await this.recordTokenUsage(tokenConsumption);

      return {
        response: data.choices[0].message.content,
        tokenConsumption
      };
    } catch (error) {
      console.error('O4Mini API Error:', error);
      throw error;
    }
  }

  private formatMessages(message: string, history: any[]): any[] {
    const messages = [
      {
        role: 'system',
        content: 'Você é o NexlaGPT, um assistente de IA premium focado em transparência e eficiência.'
      }
    ];

    // Adicionar histórico limitado (últimas 10 mensagens para controlar tokens)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Adicionar mensagem atual
    messages.push({
      role: 'user',
      content: message
    });

    return messages;
  }

  private calculateCost(promptTokens: number, completionTokens: number): number {
    const promptCost = promptTokens * this.pricing.prompt;
    const completionCost = completionTokens * this.pricing.completion;
    return promptCost + completionCost;
  }

  private async recordTokenUsage(consumption: TokenConsumption): Promise<void> {
    try {
      // Registrar no banco de dados
      await fetch('/api/tokens/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consumption),
      });

      // Verificar se precisa de cobrança adicional
      await this.checkBillingThreshold(consumption.userId, consumption.totalTokens);
    } catch (error) {
      console.error('Error recording token usage:', error);
    }
  }

  private async checkBillingThreshold(userId: string, tokensUsed: number): Promise<void> {
    try {
      const response = await fetch(`/api/users/${userId}/token-usage`);
      const userData = await response.json();
      
      const monthlyUsage = userData.currentMonthUsage + tokensUsed;
      const limit = userData.plan.tokenLimit;
      
      // Se excedeu o limite, gerar cobrança adicional
      if (monthlyUsage > limit) {
        const excessTokens = monthlyUsage - limit;
        await this.generateAdditionalBilling(userId, excessTokens);
      }
      
      // Alertas proativos
      const usagePercentage = (monthlyUsage / limit) * 100;
      if (usagePercentage >= 80) {
        await this.sendUsageAlert(userId, usagePercentage);
      }
    } catch (error) {
      console.error('Error checking billing threshold:', error);
    }
  }

  private async generateAdditionalBilling(userId: string, excessTokens: number): Promise<void> {
    const costPerToken = 0.002; // R$ 0,002 por token excedente
    const additionalCost = excessTokens * costPerToken;
    
    try {
      await fetch('/api/billing/additional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          excessTokens,
          amount: additionalCost,
          description: `Uso adicional de ${excessTokens.toLocaleString()} tokens`,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        }),
      });
    } catch (error) {
      console.error('Error generating additional billing:', error);
    }
  }

  private async sendUsageAlert(userId: string, percentage: number): Promise<void> {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type: 'token_warning',
          title: 'Alto Uso de Tokens',
          message: `Você utilizou ${percentage.toFixed(1)}% dos seus tokens mensais.`,
          severity: percentage >= 95 ? 'error' : 'warning',
        }),
      });
    } catch (error) {
      console.error('Error sending usage alert:', error);
    }
  }

  async getMonthlyUsage(userId: string): Promise<{
    currentUsage: number;
    limit: number;
    cost: number;
    projectedUsage: number;
    daysRemaining: number;
  }> {
    try {
      const response = await fetch(`/api/tokens/monthly-usage/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting monthly usage:', error);
      throw error;
    }
  }
}

export const o4MiniService = new O4MiniService();