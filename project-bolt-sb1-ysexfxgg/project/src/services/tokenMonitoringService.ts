import { o4MiniService } from './o4MiniService';
import { billingService } from './billingService';
import { notificationService } from './notificationService';

interface TokenUsageMetrics {
  dailyUsage: number[];
  weeklyAverage: number;
  monthlyProjection: number;
  efficiency: number;
  costPerMessage: number;
  peakUsageHours: number[];
}

interface MonitoringAlert {
  type: 'usage_warning' | 'limit_exceeded' | 'cost_alert' | 'efficiency_drop';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  actionRequired: boolean;
  suggestedAction?: string;
}

class TokenMonitoringService {
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertThresholds = {
    usage: {
      warning: 0.8,    // 80%
      critical: 0.95   // 95%
    },
    efficiency: {
      minimum: 0.7     // 70%
    },
    cost: {
      dailyLimit: 10   // R$ 10 por dia
    }
  };

  async startMonitoring(userId: string): Promise<void> {
    // Monitoramento em tempo real a cada 5 minutos
    this.monitoringInterval = setInterval(async () => {
      await this.performMonitoringCheck(userId);
    }, 5 * 60 * 1000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  private async performMonitoringCheck(userId: string): Promise<void> {
    try {
      const metrics = await this.calculateUsageMetrics(userId);
      const alerts = await this.checkAlertConditions(userId, metrics);
      
      // Processar alertas
      for (const alert of alerts) {
        await this.processAlert(userId, alert);
      }
      
      // Atualizar métricas no dashboard
      await this.updateDashboardMetrics(userId, metrics);
      
    } catch (error) {
      console.error('Monitoring check error:', error);
    }
  }

  async calculateUsageMetrics(userId: string): Promise<TokenUsageMetrics> {
    try {
      const response = await fetch(`/api/tokens/metrics/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get usage metrics');
      }
      
      const data = await response.json();
      
      // Calcular métricas avançadas
      const weeklyAverage = data.dailyUsage.slice(-7).reduce((a: number, b: number) => a + b, 0) / 7;
      const monthlyProjection = weeklyAverage * 4.33; // Média de semanas por mês
      
      // Calcular eficiência baseada em tokens por mensagem
      const efficiency = this.calculateEfficiency(data.totalTokens, data.totalMessages);
      
      // Custo por mensagem
      const costPerMessage = data.totalCost / data.totalMessages;
      
      return {
        dailyUsage: data.dailyUsage,
        weeklyAverage,
        monthlyProjection,
        efficiency,
        costPerMessage,
        peakUsageHours: data.peakUsageHours
      };
    } catch (error) {
      console.error('Error calculating usage metrics:', error);
      throw error;
    }
  }

  private calculateEfficiency(totalTokens: number, totalMessages: number): number {
    if (totalMessages === 0) return 1;
    
    const averageTokensPerMessage = totalTokens / totalMessages;
    const optimalTokensPerMessage = 200; // Baseline otimizado
    
    // Eficiência inversa - menos tokens por mensagem = maior eficiência
    return Math.max(0, Math.min(1, optimalTokensPerMessage / averageTokensPerMessage));
  }

  private async checkAlertConditions(userId: string, metrics: TokenUsageMetrics): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = [];
    
    try {
      const billingCycle = await billingService.getCurrentBillingCycle(userId);
      const usagePercentage = billingCycle.tokensUsed / billingCycle.tokenLimit;
      
      // Alerta de uso
      if (usagePercentage >= this.alertThresholds.usage.critical) {
        alerts.push({
          type: 'limit_exceeded',
          severity: 'critical',
          message: `Uso crítico: ${(usagePercentage * 100).toFixed(1)}% dos tokens utilizados`,
          actionRequired: true,
          suggestedAction: 'upgrade_plan'
        });
      } else if (usagePercentage >= this.alertThresholds.usage.warning) {
        alerts.push({
          type: 'usage_warning',
          severity: 'high',
          message: `Alto uso: ${(usagePercentage * 100).toFixed(1)}% dos tokens utilizados`,
          actionRequired: false,
          suggestedAction: 'monitor_usage'
        });
      }
      
      // Alerta de eficiência
      if (metrics.efficiency < this.alertThresholds.efficiency.minimum) {
        alerts.push({
          type: 'efficiency_drop',
          severity: 'medium',
          message: `Eficiência baixa: ${(metrics.efficiency * 100).toFixed(1)}%`,
          actionRequired: false,
          suggestedAction: 'optimize_prompts'
        });
      }
      
      // Alerta de custo diário
      const dailyCost = metrics.dailyUsage[metrics.dailyUsage.length - 1] * 0.002; // Custo estimado
      if (dailyCost > this.alertThresholds.cost.dailyLimit) {
        alerts.push({
          type: 'cost_alert',
          severity: 'high',
          message: `Custo diário alto: R$ ${dailyCost.toFixed(2)}`,
          actionRequired: true,
          suggestedAction: 'review_usage'
        });
      }
      
    } catch (error) {
      console.error('Error checking alert conditions:', error);
    }
    
    return alerts;
  }

  private async processAlert(userId: string, alert: MonitoringAlert): Promise<void> {
    try {
      // Criar notificação
      await notificationService.createNotification({
        userId,
        type: alert.type,
        title: this.getAlertTitle(alert.type),
        message: alert.message,
        severity: alert.severity,
        actionRequired: alert.actionRequired,
        suggestedAction: alert.suggestedAction
      });
      
      // Se for crítico, executar ações automáticas
      if (alert.severity === 'critical' && alert.actionRequired) {
        await this.executeAutomaticAction(userId, alert);
      }
      
    } catch (error) {
      console.error('Error processing alert:', error);
    }
  }

  private getAlertTitle(type: string): string {
    const titles = {
      'usage_warning': 'Alerta de Uso',
      'limit_exceeded': 'Limite Excedido',
      'cost_alert': 'Alerta de Custo',
      'efficiency_drop': 'Eficiência Baixa'
    };
    return titles[type as keyof typeof titles] || 'Alerta do Sistema';
  }

  private async executeAutomaticAction(userId: string, alert: MonitoringAlert): Promise<void> {
    try {
      switch (alert.suggestedAction) {
        case 'upgrade_plan':
          await this.suggestPlanUpgrade(userId);
          break;
          
        case 'review_usage':
          await this.triggerUsageReview(userId);
          break;
          
        default:
          console.log(`No automatic action for: ${alert.suggestedAction}`);
      }
    } catch (error) {
      console.error('Error executing automatic action:', error);
    }
  }

  private async suggestPlanUpgrade(userId: string): Promise<void> {
    // Analisar padrão de uso e sugerir melhor plano
    const metrics = await this.calculateUsageMetrics(userId);
    const recommendedPlan = this.getRecommendedPlan(metrics.monthlyProjection);
    
    await notificationService.createNotification({
      userId,
      type: 'plan_upgrade',
      title: 'Upgrade Recomendado',
      message: `Com base no seu uso, recomendamos o ${recommendedPlan} para melhor custo-benefício.`,
      severity: 'info',
      actionUrl: '/billing'
    });
  }

  private getRecommendedPlan(projectedUsage: number): string {
    if (projectedUsage > 200000) return 'Plano Empresarial';
    if (projectedUsage > 50000) return 'Plano Profissional';
    return 'Plano Inicial';
  }

  private async triggerUsageReview(userId: string): Promise<void> {
    await notificationService.createNotification({
      userId,
      type: 'usage_report',
      title: 'Revisão de Uso Necessária',
      message: 'Detectamos uso acima do normal. Revise seu padrão de uso para otimizar custos.',
      severity: 'warning',
      actionUrl: '/dashboard'
    });
  }

  private async updateDashboardMetrics(userId: string, metrics: TokenUsageMetrics): Promise<void> {
    try {
      await fetch('/api/dashboard/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          metrics,
          timestamp: new Date()
        }),
      });
    } catch (error) {
      console.error('Error updating dashboard metrics:', error);
    }
  }

  async generateUsageReport(userId: string, period: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    try {
      const response = await fetch(`/api/tokens/report/${userId}?period=${period}`);
      if (!response.ok) {
        throw new Error('Failed to generate usage report');
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating usage report:', error);
      throw error;
    }
  }
}

export const tokenMonitoringService = new TokenMonitoringService();