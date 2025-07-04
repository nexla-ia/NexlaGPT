import { Usage } from '../types';
import { format, subDays, startOfDay } from 'date-fns';

class UsageService {
  private baseUrl = '/api/usage';

  async getUserUsage(userId: string, days: number = 30): Promise<Usage[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate mock usage data for the last 30 days
      const usage: Usage[] = [];
      for (let i = 0; i < days; i++) {
        const date = startOfDay(subDays(new Date(), i));
        const messagesCount = Math.floor(Math.random() * 50) + 1;
        const tokensUsed = messagesCount * (Math.floor(Math.random() * 100) + 50);

        usage.push({
          userId,
          date: format(date, 'yyyy-MM-dd'),
          messagesCount,
          tokensUsed
        });
      }

      return usage.reverse(); // Most recent first
    } catch (error) {
      throw new Error('Erro ao buscar dados de uso');
    }
  }

  async incrementMessageCount(userId: string): Promise<boolean> {
    try {
      // Simulate API call to increment message count
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkQuotaLimit(userId: string): Promise<{ canSend: boolean; remaining: number }> {
    try {
      // Simulate quota check
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock quota check - in real implementation, this would check against database
      const messagesUsed = 150; // This would come from database
      const messagesLimit = 1000;
      const remaining = messagesLimit - messagesUsed;

      return {
        canSend: remaining > 0,
        remaining
      };
    } catch (error) {
      return { canSend: false, remaining: 0 };
    }
  }

  async getUsageStats(userId: string): Promise<{
    totalMessages: number;
    totalTokens: number;
    averageDaily: number;
    peakDay: { date: string; count: number };
  }> {
    try {
      const usage = await this.getUserUsage(userId, 30);
      
      const totalMessages = usage.reduce((sum, day) => sum + day.messagesCount, 0);
      const totalTokens = usage.reduce((sum, day) => sum + day.tokensUsed, 0);
      const averageDaily = totalMessages / usage.length;
      
      const peakDay = usage.reduce((peak, day) => 
        day.messagesCount > peak.count 
          ? { date: day.date, count: day.messagesCount }
          : peak
      , { date: '', count: 0 });

      return {
        totalMessages,
        totalTokens,
        averageDaily: Math.round(averageDaily * 10) / 10,
        peakDay
      };
    } catch (error) {
      throw new Error('Erro ao calcular estatísticas de uso');
    }
  }
}

export const usageService = new UsageService();