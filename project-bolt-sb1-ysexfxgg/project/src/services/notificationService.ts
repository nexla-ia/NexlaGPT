import { Notification, User } from '../types';
import { tokenService } from './tokenService';

class NotificationService {
  private baseUrl = '/api/notifications';

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock notifications - in production, fetch from database
      return [
        {
          id: '1',
          userId,
          type: 'token_warning',
          title: 'Uso de Tokens Alto',
          message: 'Você já utilizou 85% dos seus tokens mensais. Considere fazer upgrade para evitar interrupções.',
          severity: 'warning',
          read: false,
          actionUrl: '/billing',
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          id: '2',
          userId,
          type: 'usage_report',
          title: 'Relatório Semanal',
          message: 'Seu uso semanal: 2.450 tokens em 45 mensagens. Eficiência: 92%',
          severity: 'info',
          read: false,
          createdAt: new Date(Date.now() - 86400000)
        },
        {
          id: '3',
          userId,
          type: 'plan_upgrade',
          title: 'Upgrade Recomendado',
          message: 'Com base no seu padrão de uso, o Plano Profissional seria mais econômico.',
          severity: 'info',
          read: true,
          actionUrl: '/billing',
          createdAt: new Date(Date.now() - 172800000)
        }
      ];
    } catch (error) {
      throw new Error('Erro ao buscar notificações');
    }
  }

  async createTokenWarningNotification(userId: string, tokensUsed: number, tokensLimit: number): Promise<Notification> {
    const percentage = (tokensUsed / tokensLimit) * 100;
    let severity: Notification['severity'] = 'info';
    let title = '';
    let message = '';

    if (percentage >= 95) {
      severity = 'error';
      title = 'Limite de Tokens Crítico';
      message = `Você utilizou ${percentage.toFixed(1)}% dos seus tokens. Upgrade urgente recomendado!`;
    } else if (percentage >= 80) {
      severity = 'warning';
      title = 'Alto Uso de Tokens';
      message = `Você já utilizou ${percentage.toFixed(1)}% dos seus tokens mensais.`;
    } else if (percentage >= 60) {
      severity = 'info';
      title = 'Monitoramento de Uso';
      message = `Uso atual: ${percentage.toFixed(1)}% dos tokens mensais.`;
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      type: 'token_warning',
      title,
      message,
      severity,
      read: false,
      actionUrl: '/billing',
      createdAt: new Date()
    };

    // In production, save to database
    return notification;
  }

  async checkAndCreateProactiveNotifications(user: User): Promise<Notification[]> {
    const notifications: Notification[] = [];

    try {
      // Check token usage prediction
      const prediction = await tokenService.predictTokenUsage(user.id);
      
      if (prediction.recommendedAction === 'urgent_upgrade') {
        notifications.push({
          id: `urgent_${Date.now()}`,
          userId: user.id,
          type: 'token_limit',
          title: 'Ação Urgente Necessária',
          message: `Seus tokens acabarão em ${prediction.daysUntilLimit} dias. Upgrade imediato recomendado!`,
          severity: 'error',
          read: false,
          actionUrl: '/billing',
          createdAt: new Date()
        });
      } else if (prediction.recommendedAction === 'upgrade') {
        notifications.push({
          id: `upgrade_${Date.now()}`,
          userId: user.id,
          type: 'plan_upgrade',
          title: 'Upgrade Recomendado',
          message: `Com base no seu uso, recomendamos upgrade para o ${prediction.suggestedPlan} em ${prediction.daysUntilLimit} dias.`,
          severity: 'warning',
          read: false,
          actionUrl: '/billing',
          createdAt: new Date()
        });
      }

      // Check if auto-upgrade is enabled and should be triggered
      if (user.autoUpgrade && prediction.daysUntilLimit <= 3) {
        notifications.push({
          id: `auto_upgrade_${Date.now()}`,
          userId: user.id,
          type: 'plan_upgrade',
          title: 'Auto-Upgrade Ativado',
          message: 'Seu plano será automaticamente atualizado em 24h para evitar interrupções.',
          severity: 'info',
          read: false,
          createdAt: new Date()
        });
      }

      return notifications;
    } catch (error) {
      console.error('Error creating proactive notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      // In production, update database
      return true;
    } catch (error) {
      return false;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      return 0;
    }
  }
}

export const notificationService = new NotificationService();