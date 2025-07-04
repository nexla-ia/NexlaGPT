import { TokenUsage, Notification, User } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

interface TokenConsumption {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

interface TokenPrediction {
  projectedUsage: number;
  daysUntilLimit: number;
  recommendedAction: 'none' | 'monitor' | 'upgrade' | 'urgent_upgrade';
  suggestedPlan?: string;
}

class TokenService {
  private baseUrl = '/api/tokens';
  private tokenRates = {
    'o4-mini': {
      input: 0.00015,  // $0.15 per 1K tokens
      output: 0.0006   // $0.60 per 1K tokens
    }
  };

  async calculateTokenUsage(message: string, response: string, model: string = 'o4-mini'): Promise<TokenConsumption> {
    // Simulate token calculation - in production, use actual tokenizer
    const inputTokens = Math.ceil(message.length / 4); // Rough estimation
    const outputTokens = Math.ceil(response.length / 4);
    const totalTokens = inputTokens + outputTokens;
    
    const rates = this.tokenRates[model as keyof typeof this.tokenRates] || this.tokenRates['o4-mini'];
    const estimatedCost = (inputTokens * rates.input + outputTokens * rates.output) / 1000;

    return {
      inputTokens,
      outputTokens,
      totalTokens,
      estimatedCost
    };
  }

  async getUserTokenUsage(userId: string, days: number = 30): Promise<TokenUsage[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const usage: TokenUsage[] = [];
      for (let i = 0; i < days; i++) {
        const date = startOfDay(subDays(new Date(), i));
        const messagesCount = Math.floor(Math.random() * 25) + 5;
        const averageTokens = Math.floor(Math.random() * 200) + 100;
        const tokensUsed = messagesCount * averageTokens;
        const peakHour = Math.floor(Math.random() * 24);

        usage.push({
          userId,
          date: format(date, 'yyyy-MM-dd'),
          tokensUsed,
          messagesCount,
          averageTokensPerMessage: averageTokens,
          peakHour
        });
      }

      return usage.reverse();
    } catch (error) {
      throw new Error('Erro ao buscar uso de tokens');
    }
  }

  async predictTokenUsage(userId: string): Promise<TokenPrediction> {
    try {
      const usage = await this.getUserTokenUsage(userId, 7);
      const dailyAverage = usage.reduce((sum, day) => sum + day.tokensUsed, 0) / usage.length;
      const daysInMonth = 30;
      const projectedUsage = dailyAverage * daysInMonth;

      // Get user's current limit (mock)
      const currentLimit = 50000; // This would come from user data
      const currentUsage = 12500; // This would come from user data
      const remainingTokens = currentLimit - currentUsage;
      const daysUntilLimit = remainingTokens / dailyAverage;

      let recommendedAction: TokenPrediction['recommendedAction'] = 'none';
      let suggestedPlan: string | undefined;

      if (daysUntilLimit <= 3) {
        recommendedAction = 'urgent_upgrade';
        suggestedPlan = 'profissional';
      } else if (daysUntilLimit <= 7) {
        recommendedAction = 'upgrade';
        suggestedPlan = 'profissional';
      } else if (daysUntilLimit <= 14) {
        recommendedAction = 'monitor';
      }

      return {
        projectedUsage,
        daysUntilLimit: Math.max(0, Math.floor(daysUntilLimit)),
        recommendedAction,
        suggestedPlan
      };
    } catch (error) {
      throw new Error('Erro ao prever uso de tokens');
    }
  }

  async checkTokenLimit(userId: string, tokensToUse: number): Promise<{
    canProceed: boolean;
    remainingTokens: number;
    warningLevel: 'none' | 'low' | 'critical';
    message?: string;
  }> {
    try {
      // Mock current usage - in production, fetch from database
      const currentUsage = 12500;
      const tokenLimit = 50000;
      const remainingTokens = tokenLimit - currentUsage;
      const usagePercentage = (currentUsage / tokenLimit) * 100;

      const canProceed = remainingTokens >= tokensToUse;
      
      let warningLevel: 'none' | 'low' | 'critical' = 'none';
      let message: string | undefined;

      if (usagePercentage >= 95) {
        warningLevel = 'critical';
        message = 'Limite de tokens quase esgotado! Considere fazer upgrade imediatamente.';
      } else if (usagePercentage >= 80) {
        warningLevel = 'low';
        message = 'Você está usando mais de 80% dos seus tokens mensais.';
      }

      return {
        canProceed,
        remainingTokens,
        warningLevel,
        message
      };
    } catch (error) {
      return {
        canProceed: false,
        remainingTokens: 0,
        warningLevel: 'critical',
        message: 'Erro ao verificar limite de tokens'
      };
    }
  }

  async incrementTokenUsage(userId: string, tokens: number): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      // In production, update database with token usage
      return true;
    } catch (error) {
      return false;
    }
  }

  async getTokenStats(userId: string): Promise<{
    totalTokensUsed: number;
    totalCost: number;
    averagePerMessage: number;
    peakUsageDay: { date: string; tokens: number };
    efficiency: number;
  }> {
    try {
      const usage = await this.getUserTokenUsage(userId, 30);
      
      const totalTokensUsed = usage.reduce((sum, day) => sum + day.tokensUsed, 0);
      const totalMessages = usage.reduce((sum, day) => sum + day.messagesCount, 0);
      const averagePerMessage = totalMessages > 0 ? totalTokensUsed / totalMessages : 0;
      
      const peakUsageDay = usage.reduce((peak, day) => 
        day.tokensUsed > peak.tokens 
          ? { date: day.date, tokens: day.tokensUsed }
          : peak
      , { date: '', tokens: 0 });

      // Calculate estimated cost
      const totalCost = (totalTokensUsed * 0.0003) / 1000; // Rough estimation
      
      // Efficiency score (lower tokens per message = higher efficiency)
      const efficiency = Math.max(0, 100 - (averagePerMessage / 10));

      return {
        totalTokensUsed,
        totalCost,
        averagePerMessage: Math.round(averagePerMessage),
        peakUsageDay,
        efficiency: Math.round(efficiency)
      };
    } catch (error) {
      throw new Error('Erro ao calcular estatísticas de tokens');
    }
  }
}

export const tokenService = new TokenService();