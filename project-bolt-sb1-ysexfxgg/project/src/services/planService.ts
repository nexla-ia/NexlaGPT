import { Plan, User } from '../types';

class PlanService {
  private plans: Plan[] = [
    {
      id: 'inicial',
      name: 'Plano Inicial',
      price: 49,
      tokensLimit: 50000,
      messagesLimit: 1000,
      maxResponseTime: 15,
      aiModel: 'o4-mini',
      priority: 'standard',
      features: [
        'Tempo de resposta até 15s',
        'Suporte por email',
        'Histórico de conversas',
        'Dashboard básico'
      ],
      support: 'Email'
    },
    {
      id: 'profissional',
      name: 'Plano Profissional',
      price: 149,
      tokensLimit: 200000,
      messagesLimit: 5000,
      maxResponseTime: 8,
      aiModel: 'o4-mini',
      priority: 'high',
      popular: true,
      features: [
        'Tempo de resposta até 8s',
        'Suporte prioritário',
        'API de integração',
        'Relatórios avançados',
        'Backup automático',
        'Integração N8N premium'
      ],
      support: 'Chat + Email'
    },
    {
      id: 'empresarial',
      name: 'Plano Empresarial',
      price: 399,
      tokensLimit: 1000000,
      messagesLimit: 25000,
      maxResponseTime: 3,
      aiModel: 'o4-mini',
      priority: 'premium',
      features: [
        'Tempo de resposta até 3s',
        'Suporte 24/7',
        'API ilimitada',
        'Analytics avançados',
        'Múltiplos usuários',
        'SLA garantido',
        'Integração personalizada',
        'Gerente de conta dedicado'
      ],
      support: 'Telefone + Chat + Email'
    }
  ];

  getPlans(): Plan[] {
    return this.plans;
  }

  getPlanById(planId: string): Plan | undefined {
    return this.plans.find(plan => plan.id === planId);
  }

  getRecommendedUpgrade(currentPlan: string, tokensUsed: number, projectedUsage: number): Plan | null {
    const current = this.getPlanById(currentPlan);
    if (!current) return null;

    // If projected usage exceeds current limit by 20%, recommend upgrade
    if (projectedUsage > current.tokensLimit * 1.2) {
      const nextPlan = this.plans.find(plan => 
        plan.tokensLimit > projectedUsage && 
        plan.price > current.price
      );
      return nextPlan || null;
    }

    return null;
  }

  calculateCostEfficiency(plan: Plan, expectedUsage: number): {
    costPerToken: number;
    efficiency: number;
    recommendation: string;
  } {
    const costPerToken = plan.price / plan.tokensLimit;
    const utilizationRate = expectedUsage / plan.tokensLimit;
    const efficiency = Math.min(100, utilizationRate * 100);

    let recommendation = '';
    if (efficiency < 30) {
      recommendation = 'Considere um plano menor para melhor custo-benefício';
    } else if (efficiency > 90) {
      recommendation = 'Considere upgrade para evitar limitações';
    } else {
      recommendation = 'Plano adequado para seu uso atual';
    }

    return {
      costPerToken,
      efficiency,
      recommendation
    };
  }

  async simulateAutoUpgrade(user: User, targetPlan: string): Promise<{
    success: boolean;
    newPlan?: Plan;
    prorationAmount?: number;
    effectiveDate?: Date;
    error?: string;
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPlan = this.getPlanById(targetPlan);
      if (!newPlan) {
        return { success: false, error: 'Plano não encontrado' };
      }

      const currentPlan = this.getPlanById(user.plan);
      if (!currentPlan) {
        return { success: false, error: 'Plano atual inválido' };
      }

      // Calculate proration (simplified)
      const daysRemaining = Math.ceil((user.subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const prorationAmount = ((newPlan.price - currentPlan.price) / 30) * daysRemaining;

      return {
        success: true,
        newPlan,
        prorationAmount: Math.max(0, prorationAmount),
        effectiveDate: new Date()
      };
    } catch (error) {
      return { success: false, error: 'Erro interno no upgrade' };
    }
  }
}

export const planService = new PlanService();