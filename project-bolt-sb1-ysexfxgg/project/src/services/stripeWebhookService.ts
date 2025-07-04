interface StripeEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

interface SubscriptionEvent {
  userId: string;
  subscriptionId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  planId: string;
}

class StripeWebhookService {
  private webhookSecret: string;

  constructor() {
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  async handleWebhook(payload: string, signature: string): Promise<void> {
    try {
      const event = this.verifyWebhookSignature(payload, signature);
      
      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event);
          break;
          
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event);
          break;
          
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCanceled(event);
          break;
          
        case 'invoice.created':
          await this.handleInvoiceCreated(event);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  private verifyWebhookSignature(payload: string, signature: string): StripeEvent {
    // Em produção, usar stripe.webhooks.constructEvent
    // Por agora, simular verificação
    try {
      return JSON.parse(payload);
    } catch (error) {
      throw new Error('Invalid webhook payload');
    }
  }

  private async handlePaymentSucceeded(event: StripeEvent): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    
    try {
      // Buscar usuário pelo customer ID
      const user = await this.getUserByStripeCustomerId(customerId);
      
      if (invoice.billing_reason === 'subscription_cycle') {
        // Pagamento recorrente - resetar ciclo de cobrança
        await this.resetUserBillingCycle(user.id);
        await this.sendPaymentConfirmation(user.id, invoice.amount_paid / 100);
      } else {
        // Pagamento adicional - marcar cobrança como paga
        await this.markAdditionalChargeAsPaid(user.id, invoice.id);
      }
      
      // Atualizar status da assinatura
      await this.updateSubscriptionStatus(user.id, 'active');
      
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }

  private async handlePaymentFailed(event: StripeEvent): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    
    try {
      const user = await this.getUserByStripeCustomerId(customerId);
      
      // Notificar falha no pagamento
      await this.sendPaymentFailureNotification(user.id, invoice.amount_due / 100);
      
      // Se for o terceiro tentativa, suspender conta
      if (invoice.attempt_count >= 3) {
        await this.suspendUserAccount(user.id);
      }
      
    } catch (error) {
      console.error('Error handling payment failed:', error);
    }
  }

  private async handleSubscriptionUpdated(event: StripeEvent): Promise<void> {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    
    try {
      const user = await this.getUserByStripeCustomerId(customerId);
      
      const subscriptionData: SubscriptionEvent = {
        userId: user.id,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        planId: subscription.items.data[0].price.lookup_key || 'inicial'
      };
      
      await this.updateUserSubscription(subscriptionData);
      
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }

  private async handleSubscriptionCanceled(event: StripeEvent): Promise<void> {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    
    try {
      const user = await this.getUserByStripeCustomerId(customerId);
      
      await this.updateSubscriptionStatus(user.id, 'cancelled');
      await this.sendCancellationConfirmation(user.id);
      
    } catch (error) {
      console.error('Error handling subscription canceled:', error);
    }
  }

  private async handleInvoiceCreated(event: StripeEvent): Promise<void> {
    const invoice = event.data.object;
    const customerId = invoice.customer;
    
    try {
      const user = await this.getUserByStripeCustomerId(customerId);
      
      // Notificar sobre nova fatura
      await this.sendInvoiceNotification(user.id, {
        amount: invoice.amount_due / 100,
        dueDate: new Date(invoice.due_date * 1000),
        invoiceUrl: invoice.hosted_invoice_url
      });
      
    } catch (error) {
      console.error('Error handling invoice created:', error);
    }
  }

  private async getUserByStripeCustomerId(customerId: string): Promise<{ id: string; email: string }> {
    const response = await fetch(`/api/users/by-stripe-customer/${customerId}`);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return await response.json();
  }

  private async resetUserBillingCycle(userId: string): Promise<void> {
    await fetch('/api/billing/cycle/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        resetDate: new Date(),
      }),
    });
  }

  private async markAdditionalChargeAsPaid(userId: string, invoiceId: string): Promise<void> {
    await fetch('/api/billing/additional-charge/mark-paid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        stripeInvoiceId: invoiceId,
        paidAt: new Date(),
      }),
    });
  }

  private async updateSubscriptionStatus(userId: string, status: string): Promise<void> {
    await fetch(`/api/users/${userId}/subscription-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  }

  private async updateUserSubscription(data: SubscriptionEvent): Promise<void> {
    await fetch(`/api/users/${data.userId}/subscription`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  private async suspendUserAccount(userId: string): Promise<void> {
    await fetch(`/api/users/${userId}/suspend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'payment_failure',
        suspendedAt: new Date(),
      }),
    });
  }

  private async sendPaymentConfirmation(userId: string, amount: number): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: 'payment_success',
        title: 'Pagamento Confirmado',
        message: `Seu pagamento de R$ ${amount.toFixed(2)} foi processado com sucesso.`,
        severity: 'success',
      }),
    });
  }

  private async sendPaymentFailureNotification(userId: string, amount: number): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: 'payment_failed',
        title: 'Falha no Pagamento',
        message: `Não foi possível processar o pagamento de R$ ${amount.toFixed(2)}. Verifique seu método de pagamento.`,
        severity: 'error',
        actionUrl: '/billing',
      }),
    });
  }

  private async sendCancellationConfirmation(userId: string): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: 'subscription_cancelled',
        title: 'Assinatura Cancelada',
        message: 'Sua assinatura foi cancelada. Você continuará tendo acesso até o fim do período pago.',
        severity: 'info',
      }),
    });
  }

  private async sendInvoiceNotification(
    userId: string, 
    invoice: { amount: number; dueDate: Date; invoiceUrl: string }
  ): Promise<void> {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: 'invoice_created',
        title: 'Nova Fatura Disponível',
        message: `Nova fatura de R$ ${invoice.amount.toFixed(2)} com vencimento em ${invoice.dueDate.toLocaleDateString('pt-BR')}.`,
        severity: 'info',
        actionUrl: invoice.invoiceUrl,
      }),
    });
  }
}

export const stripeWebhookService = new StripeWebhookService();