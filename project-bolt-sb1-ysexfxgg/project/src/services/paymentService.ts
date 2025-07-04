import { Payment, Plan } from '../types';

interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

class PaymentService {
  private baseUrl = '/api/payments';

  // Available plans
  getPlans(): Plan[] {
    return [
      {
        id: 'inicial',
        name: 'Plano Inicial',
        price: 49,
        messagesLimit: 1000,
        maxResponseTime: 15,
        features: [
          '1000 mensagens por mês',
          'Tempo de resposta até 15 segundos',
          'Suporte por email',
          'Histórico de conversas',
          'Interface responsiva'
        ],
        support: 'Email'
      }
    ];
  }

  async createPaymentIntent(planId: string, userId: string): Promise<PaymentIntent> {
    try {
      // Simulate payment intent creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const plan = this.getPlans().find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plano não encontrado');
      }

      return {
        id: `pi_${Date.now()}`,
        clientSecret: `pi_${Date.now()}_secret`,
        amount: plan.price * 100, // Convert to cents
        currency: 'brl'
      };
    } catch (error) {
      throw new Error('Erro ao criar intenção de pagamento');
    }
  }

  async processPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResult> {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful payment
      return {
        success: true,
        paymentId: `pay_${Date.now()}`
      };
    } catch (error) {
      return {
        success: false,
        error: 'Erro ao processar pagamento'
      };
    }
  }

  async getPaymentHistory(userId: string): Promise<Payment[]> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock payment history
      return [
        {
          id: '1',
          userId,
          amount: 49,
          status: 'completed',
          planId: 'inicial',
          paymentMethod: 'Cartão de Crédito',
          createdAt: new Date('2024-01-01'),
          paidAt: new Date('2024-01-01')
        },
        {
          id: '2',
          userId,
          amount: 49,
          status: 'completed',
          planId: 'inicial',
          paymentMethod: 'PIX',
          createdAt: new Date('2024-02-01'),
          paidAt: new Date('2024-02-01')
        }
      ];
    } catch (error) {
      throw new Error('Erro ao buscar histórico de pagamentos');
    }
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const paymentService = new PaymentService();