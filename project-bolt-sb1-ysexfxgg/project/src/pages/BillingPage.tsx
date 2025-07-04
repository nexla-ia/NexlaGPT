import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar, CheckCircle, XCircle, Clock, Zap, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { planService } from '../services/planService';
import { tokenService } from '../services/tokenService';
import PlanComparison from '../components/billing/PlanComparison';
import { Payment, Plan } from '../types';

export default function BillingPage() {
  const { user, updateUser } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [projectedUsage, setProjectedUsage] = useState(0);
  const [autoUpgradeEnabled, setAutoUpgradeEnabled] = useState(false);

  useEffect(() => {
    const loadBillingData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const [paymentHistory, prediction] = await Promise.all([
          paymentService.getPaymentHistory(user.id),
          tokenService.predictTokenUsage(user.id)
        ]);

        setPayments(paymentHistory);
        setProjectedUsage(prediction.projectedUsage);
        setAutoUpgradeEnabled(user.autoUpgrade);
      } catch (error) {
        console.error('Error loading billing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBillingData();
  }, [user]);

  const handleToggleAutoUpgrade = async () => {
    if (!user) return;
    
    const newValue = !autoUpgradeEnabled;
    setAutoUpgradeEnabled(newValue);
    updateUser({ autoUpgrade: newValue });
    
    // In production, this would make an API call
    console.log('Auto-upgrade toggled:', newValue);
  };

  const handleSelectPlan = async (planId: string) => {
    if (!user || planId === user.plan) return;

    try {
      const result = await planService.simulateAutoUpgrade(user, planId);
      if (result.success && result.newPlan) {
        // In production, this would process the actual upgrade
        updateUser({ 
          plan: planId as any,
          tokensLimit: result.newPlan.tokensLimit,
          messagesLimit: result.newPlan.messagesLimit
        });
        setShowPlanComparison(false);
        alert(`Upgrade para ${result.newPlan.name} realizado com sucesso!`);
      }
    } catch (error) {
      console.error('Error upgrading plan:', error);
      alert('Erro ao fazer upgrade. Tente novamente.');
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 tablet:w-5 tablet:h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 tablet:w-5 tablet:h-5 text-orange-400" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 tablet:w-5 tablet:h-5 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 tablet:w-5 tablet:h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 tablet:w-10 tablet:h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (showPlanComparison) {
    return (
      <div className="space-y-4 tablet:space-y-6">
        <button
          onClick={() => setShowPlanComparison(false)}
          className="text-cyan-400 hover:text-cyan-300 font-medium text-sm tablet:text-base sm:text-base"
        >
          ← Voltar para Cobrança
        </button>
        <PlanComparison
          currentPlan={user.plan}
          onSelectPlan={handleSelectPlan}
          projectedUsage={projectedUsage}
        />
      </div>
    );
  }

  const currentPlan = planService.getPlanById(user.plan);
  const tokenPercentage = (user.tokensUsed / user.tokensLimit) * 100;
  const daysRemaining = Math.ceil((user.subscriptionEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-4 tablet:space-y-6 sm:space-y-6">
      {/* Header */}
      <div className="mb-6 tablet:mb-8">
        <h1 className="text-xl tablet:text-2xl sm:text-2xl font-bold text-white mb-2">Cobrança e Planos</h1>
        <p className="text-sm tablet:text-base sm:text-base text-gray-400">Gerencie sua assinatura e otimize seus custos</p>
      </div>

      {/* Current Plan - Tablet responsive */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 tablet:p-6 sm:p-6">
        <div className="flex flex-col tablet:flex-row sm:flex-row tablet:items-center sm:items-center tablet:justify-between sm:justify-between mb-4 tablet:mb-6 sm:mb-6 gap-3 tablet:gap-4">
          <div className="flex items-center gap-3 tablet:gap-4 sm:gap-4">
            <div className="p-2 tablet:p-3 sm:p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
              <Zap className="w-5 h-5 tablet:w-7 tablet:h-7 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg tablet:text-xl sm:text-xl font-semibold text-white">
                {currentPlan?.name || 'Plano Atual'}
              </h2>
              <p className="text-sm tablet:text-base sm:text-base text-gray-400">
                Alto desempenho com transparência total
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 tablet:px-4 tablet:py-2 sm:px-4 sm:py-2 rounded-full text-xs tablet:text-sm sm:text-sm font-medium ${
            user.subscriptionStatus === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {user.subscriptionStatus === 'active' ? 'Ativo' : 'Inativo'}
          </div>
        </div>

        <div className="grid grid-cols-2 tablet:grid-cols-4 lg:grid-cols-4 gap-3 tablet:gap-6 sm:gap-6 mb-4 tablet:mb-6 sm:mb-6">
          <div className="text-center">
            <h3 className="text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 mb-1 tablet:mb-2 sm:mb-2">Preço Mensal</h3>
            <p className="text-lg tablet:text-2xl sm:text-2xl font-bold text-cyan-400">
              R$ {currentPlan?.price || 49}
              <span className="text-xs tablet:text-sm sm:text-sm text-gray-400">/mês</span>
            </p>
            <p className="text-xs tablet:text-sm text-gray-500">40% mais barato</p>
          </div>

          <div className="text-center">
            <h3 className="text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 mb-1 tablet:mb-2 sm:mb-2">Tokens Usados</h3>
            <p className="text-lg tablet:text-2xl sm:text-2xl font-bold text-white">
              {tokenPercentage.toFixed(1)}%
            </p>
            <p className="text-xs tablet:text-sm text-gray-500">
              {user.tokensUsed.toLocaleString()} / {user.tokensLimit.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <h3 className="text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 mb-1 tablet:mb-2 sm:mb-2">Eficiência</h3>
            <p className="text-lg tablet:text-2xl sm:text-2xl font-bold text-green-400">92%</p>
            <p className="text-xs tablet:text-sm text-gray-500">otimização</p>
          </div>

          <div className="text-center">
            <h3 className="text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 mb-1 tablet:mb-2 sm:mb-2">Renovação</h3>
            <p className="text-lg tablet:text-2xl sm:text-2xl font-bold text-white">{daysRemaining}</p>
            <p className="text-xs tablet:text-sm text-gray-500">dias restantes</p>
          </div>
        </div>

        {/* Auto-Upgrade Toggle */}
        <div className="flex flex-col tablet:flex-row sm:flex-row tablet:items-center sm:items-center tablet:justify-between sm:justify-between p-3 tablet:p-4 sm:p-4 bg-gray-800/30 rounded-lg border border-gray-700/30 mb-4 tablet:mb-6 sm:mb-6 gap-3 tablet:gap-4">
          <div className="flex items-center gap-3 tablet:gap-4">
            <Settings className="w-4 h-4 tablet:w-5 tablet:h-5 sm:w-5 sm:h-5 text-purple-400" />
            <div>
              <p className="text-sm tablet:text-base sm:text-base text-white font-medium">Upgrade Automático</p>
              <p className="text-xs tablet:text-sm sm:text-sm text-gray-400">
                Nunca fique sem tokens - upgrade automático quando necessário
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleAutoUpgrade}
            className={`relative inline-flex h-5 w-9 tablet:h-6 tablet:w-11 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
              autoUpgradeEnabled ? 'bg-cyan-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 tablet:h-4 tablet:w-4 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                autoUpgradeEnabled ? 'translate-x-5 tablet:translate-x-6 sm:translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex flex-col tablet:flex-row sm:flex-row gap-2 tablet:gap-3 sm:gap-3">
          <button 
            onClick={() => setShowPlanComparison(true)}
            className="px-4 py-2 tablet:px-6 tablet:py-3 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 text-sm tablet:text-base sm:text-base"
          >
            Comparar Planos
          </button>
          <button className="px-4 py-2 tablet:px-6 tablet:py-3 sm:px-6 sm:py-3 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-200 text-sm tablet:text-base sm:text-base">
            Gerenciar Assinatura
          </button>
        </div>
      </div>

      {/* Token Usage Insights */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 tablet:p-6 sm:p-6">
        <h2 className="text-lg tablet:text-xl sm:text-xl font-semibold text-white mb-3 tablet:mb-4 sm:mb-4">Insights de Uso</h2>
        <div className="grid grid-cols-1 tablet:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 tablet:gap-6 sm:gap-6">
          <div className="text-center p-3 tablet:p-4 sm:p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg">
            <div className="text-lg tablet:text-2xl sm:text-2xl font-bold text-green-400 mb-1">R$ 19,60</div>
            <div className="text-xs tablet:text-sm sm:text-sm text-gray-400">Economia mensal</div>
            <div className="text-xs tablet:text-sm text-green-400 mt-1">vs concorrentes</div>
          </div>
          <div className="text-center p-3 tablet:p-4 sm:p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
            <div className="text-lg tablet:text-2xl sm:text-2xl font-bold text-blue-400 mb-1">185</div>
            <div className="text-xs tablet:text-sm sm:text-sm text-gray-400">Tokens/mensagem</div>
            <div className="text-xs tablet:text-sm text-blue-400 mt-1">média otimizada</div>
          </div>
          <div className="text-center p-3 tablet:p-4 sm:p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg tablet:col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="text-lg tablet:text-2xl sm:text-2xl font-bold text-purple-400 mb-1">{projectedUsage.toLocaleString()}</div>
            <div className="text-xs tablet:text-sm sm:text-sm text-gray-400">Projeção mensal</div>
            <div className="text-xs tablet:text-sm text-purple-400 mt-1">tokens estimados</div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 tablet:p-6 sm:p-6">
        <div className="flex flex-col tablet:flex-row sm:flex-row tablet:items-center sm:items-center tablet:justify-between sm:justify-between mb-4 tablet:mb-6 sm:mb-6 gap-3">
          <h2 className="text-lg tablet:text-xl sm:text-xl font-semibold text-white">Histórico de Pagamentos</h2>
          <button className="flex items-center gap-2 px-3 py-2 tablet:px-4 tablet:py-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200 text-sm tablet:text-base">
            <Download className="w-4 h-4 tablet:w-5 tablet:h-5" />
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] tablet:min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400">Data</th>
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400">Descrição</th>
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 hidden tablet:table-cell sm:table-cell">Método</th>
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400">Valor</th>
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-gray-400 hidden tablet:table-cell md:table-cell">Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm text-gray-300">
                    {payment.createdAt.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm text-white">
                    {currentPlan?.name} - Mensalidade
                  </td>
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm text-gray-300 hidden tablet:table-cell sm:table-cell">
                    {payment.paymentMethod}
                  </td>
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 text-xs tablet:text-sm sm:text-sm font-medium text-white">
                    R$ {payment.amount.toFixed(2)}
                  </td>
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4">
                    <div className="flex items-center gap-1 tablet:gap-2 sm:gap-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-xs tablet:text-sm sm:text-sm text-gray-300">
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 tablet:py-3 sm:py-3 px-2 tablet:px-4 sm:px-4 hidden tablet:table-cell md:table-cell">
                    <button className="text-cyan-400 hover:text-cyan-300 text-xs tablet:text-sm sm:text-sm font-medium">
                      Ver Fatura
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 tablet:p-6 sm:p-6">
        <h2 className="text-lg tablet:text-xl sm:text-xl font-semibold text-white mb-4 tablet:mb-6 sm:mb-6">Métodos de Pagamento</h2>
        
        <div className="space-y-3 tablet:space-y-4 sm:space-y-4">
          <div className="flex flex-col tablet:flex-row sm:flex-row tablet:items-center sm:items-center tablet:justify-between sm:justify-between p-3 tablet:p-4 sm:p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 gap-3">
            <div className="flex items-center gap-3 tablet:gap-4">
              <CreditCard className="w-4 h-4 tablet:w-5 tablet:h-5 sm:w-5 sm:h-5 text-cyan-400" />
              <div>
                <p className="text-sm tablet:text-base sm:text-base text-white font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs tablet:text-sm sm:text-sm text-gray-400">Visa terminado em 4242</p>
              </div>
            </div>
            <div className="flex items-center gap-2 tablet:gap-3">
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs tablet:text-sm font-medium rounded">
                Padrão
              </span>
              <button className="text-cyan-400 hover:text-cyan-300 text-xs tablet:text-sm sm:text-sm font-medium">
                Editar
              </button>
            </div>
          </div>

          <button className="w-full p-3 tablet:p-4 sm:p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-all duration-200 text-sm tablet:text-base sm:text-base">
            + Adicionar Método de Pagamento
          </button>
        </div>
      </div>
    </div>
  );
}