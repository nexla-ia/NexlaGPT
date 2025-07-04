interface BillingCycle {
  userId: string;
  startDate: Date;
  endDate: Date;
  tokensUsed: number;
  tokenLimit: number;
  baseCost: number;
  additionalCost: number;
  totalCost: number;
  status: 'active' | 'completed' | 'overdue';
}

interface AdditionalCharge {
  id: string;
  userId: string;
  amount: number;
  description: string;
  tokensUsed: number;
  createdAt: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  stripeInvoiceId?: string;
  paymentUrl?: string;
}

class BillingService {
  private baseUrl = '/api/billing';

  async getCurrentBillingCycle(userId: string): Promise<BillingCycle> {
    try {
      const response = await fetch(`${this.baseUrl}/cycle/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get billing cycle');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting billing cycle:', error);
      throw error;
    }
  }

  async updateTokenUsage(userId: string, tokensUsed: number, cost: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          tokensUsed,
          cost,
          timestamp: new Date(),
        }),
      });

      // Verificar se precisa resetar o ciclo
      await this.checkCycleReset(userId);
    } catch (error) {
      console.error('Error updating token usage:', error);
      throw error;
    }
  }

  private async checkCycleReset(userId: string): Promise<void> {
    try {
      const cycle = await this.getCurrentBillingCycle(userId);
      const now = new Date();
      
      // Se passou do fim do ciclo, resetar
      if (now > cycle.endDate) {
        await this.resetBillingCycle(userId);
      }
    } catch (error) {
      console.error('Error checking cycle reset:', error);
    }
  }

  private async resetBillingCycle(userId: string): Promise<void> {
    try {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      
      await fetch(`${this.baseUrl}/cycle/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          startDate: now,
          endDate: nextMonth,
        }),
      });
    } catch (error) {
      console.error('Error resetting billing cycle:', error);
    }
  }

  async createAdditionalCharge(
    userId: string, 
    excessTokens: number, 
    amount: number,
    description: string
  ): Promise<AdditionalCharge> {
    try {
      const response = await fetch(`${this.baseUrl}/additional-charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          excessTokens,
          amount,
          description,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create additional charge');
      }

      const charge = await response.json();
      
      // Gerar fatura no Stripe
      await this.generateStripeInvoice(charge);
      
      return charge;
    } catch (error) {
      console.error('Error creating additional charge:', error);
      throw error;
    }
  }

  private async generateStripeInvoice(charge: AdditionalCharge): Promise<void> {
    try {
      const response = await fetch('/api/stripe/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: charge.userId,
          amount: charge.amount,
          description: charge.description,
          chargeId: charge.id,
          dueDate: charge.dueDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Stripe invoice');
      }

      const invoice = await response.json();
      
      // Atualizar charge com dados do Stripe
      await this.updateChargeWithStripeData(charge.id, {
        stripeInvoiceId: invoice.id,
        paymentUrl: invoice.hosted_invoice_url,
      });
    } catch (error) {
      console.error('Error generating Stripe invoice:', error);
    }
  }

  private async updateChargeWithStripeData(
    chargeId: string, 
    stripeData: { stripeInvoiceId: string; paymentUrl: string }
  ): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/additional-charge/${chargeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stripeData),
      });
    } catch (error) {
      console.error('Error updating charge with Stripe data:', error);
    }
  }

  async getAdditionalCharges(userId: string): Promise<AdditionalCharge[]> {
    try {
      const response = await fetch(`${this.baseUrl}/additional-charges/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get additional charges');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting additional charges:', error);
      throw error;
    }
  }

  async getBillingHistory(userId: string, months: number = 12): Promise<BillingCycle[]> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${userId}?months=${months}`);
      if (!response.ok) {
        throw new Error('Failed to get billing history');
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting billing history:', error);
      throw error;
    }
  }

  async calculateProjectedCost(userId: string): Promise<{
    currentCost: number;
    projectedCost: number;
    projectedExcess: number;
    recommendedAction: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/projection/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to calculate projection');
      }
      return await response.json();
    } catch (error) {
      console.error('Error calculating projected cost:', error);
      throw error;
    }
  }
}

export const billingService = new BillingService();