import { o4MiniService } from './o4MiniService';
import { tokenMonitoringService } from './tokenMonitoringService';
import { billingService } from './billingService';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  tokens: number;
  responseTime: number;
  model: string;
  cost: number;
  suggestions?: string[];
  n8nTrigger?: {
    workflowId: string;
    data: any;
  };
}

class ChatService {
  private apiEndpoint: string;
  private n8nWebhookUrl?: string;

  constructor() {
    this.apiEndpoint = '/api/chat';
    this.n8nWebhookUrl = undefined;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[], userId: string): Promise<ChatResponse> {
    try {
      const startTime = Date.now();
      
      // Verificar limite de tokens antes de enviar
      const canProceed = await this.checkTokenLimit(userId);
      if (!canProceed.allowed) {
        throw new Error(canProceed.message);
      }

      // Enviar mensagem para o4-mini
      const conversationId = this.generateConversationId(conversationHistory);
      const result = await o4MiniService.sendMessage(
        message, 
        conversationHistory, 
        userId, 
        conversationId
      );

      const responseTime = (Date.now() - startTime) / 1000;

      // Atualizar uso no sistema de cobrança
      await billingService.updateTokenUsage(
        userId, 
        result.tokenConsumption.totalTokens, 
        result.tokenConsumption.cost
      );

      const chatResponse: ChatResponse = {
        message: result.response,
        tokens: result.tokenConsumption.totalTokens,
        responseTime,
        model: 'o1-mini',
        cost: result.tokenConsumption.cost,
        suggestions: this.generateSuggestions(result.response)
      };

      // Se N8N integration é detectada na mensagem, preparar webhook data
      if (this.shouldTriggerN8N(message)) {
        chatResponse.n8nTrigger = {
          workflowId: 'chat-handler',
          data: {
            userMessage: message,
            response: result.response,
            tokens: result.tokenConsumption.totalTokens,
            cost: result.tokenConsumption.cost,
            timestamp: new Date().toISOString(),
            conversationId
          }
        };
      }

      return chatResponse;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  private async checkTokenLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
    try {
      const cycle = await billingService.getCurrentBillingCycle(userId);
      const usagePercentage = (cycle.tokensUsed / cycle.tokenLimit) * 100;
      
      if (usagePercentage >= 100) {
        return {
          allowed: false,
          message: 'Limite de tokens atingido. Faça upgrade do seu plano ou aguarde a renovação.'
        };
      }
      
      if (usagePercentage >= 95) {
        return {
          allowed: true,
          message: 'Você está próximo do limite de tokens. Considere fazer upgrade.'
        };
      }
      
      return { allowed: true };
    } catch (error) {
      console.error('Error checking token limit:', error);
      return { allowed: true }; // Permitir em caso de erro
    }
  }

  private generateSuggestions(response: string): string[] {
    // Gerar sugestões baseadas na resposta
    const suggestions = [
      'Pode explicar melhor?',
      'Tem algum exemplo prático?',
      'Como implementar isso?',
      'Quais são as alternativas?'
    ];
    
    // Em produção, usar IA para gerar sugestões contextuais
    return suggestions.slice(0, 2);
  }

  private shouldTriggerN8N(message: string): boolean {
    const triggers = ['n8n', 'automação', 'workflow', 'integrar', 'webhook', 'api'];
    return triggers.some(trigger => message.toLowerCase().includes(trigger));
  }

  private generateConversationId(history: ChatMessage[]): string {
    return `conv_${Date.now()}_${history.length}`;
  }

  async triggerN8NWorkflow(workflowId: string, data: any): Promise<any> {
    if (!this.n8nWebhookUrl) {
      throw new Error('N8N webhook URL not configured');
    }

    try {
      const response = await fetch(`${this.n8nWebhookUrl}/${workflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`N8N workflow trigger failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('N8N workflow trigger error:', error);
      throw error;
    }
  }

  async getConversationCost(conversationId: string): Promise<{
    totalTokens: number;
    totalCost: number;
    messageCount: number;
    averageCostPerMessage: number;
  }> {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/cost`);
      if (!response.ok) {
        throw new Error('Failed to get conversation cost');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting conversation cost:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();