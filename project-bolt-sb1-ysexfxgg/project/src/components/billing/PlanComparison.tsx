import React from 'react';
import { Check, Zap, Crown, Building } from 'lucide-react';
import { Plan } from '../../types';
import { planService } from '../../services/planService';

interface PlanComparisonProps {
  currentPlan: string;
  onSelectPlan: (planId: string) => void;
  projectedUsage?: number;
}

export default function PlanComparison({ currentPlan, onSelectPlan, projectedUsage }: PlanComparisonProps) {
  const plans = planService.getPlans();

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'inicial':
        return <Zap className="w-6 h-6" />;
      case 'profissional':
        return <Crown className="w-6 h-6" />;
      case 'empresarial':
        return <Building className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'inicial':
        return 'from-cyan-500 to-blue-500';
      case 'profissional':
        return 'from-purple-500 to-pink-500';
      case 'empresarial':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getEfficiency = (plan: Plan) => {
    if (!projectedUsage) return null;
    return planService.calculateCostEfficiency(plan, projectedUsage);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Escolha seu Plano</h2>
        <p className="text-gray-400">
          Planos flexíveis com IA de alto desempenho e preços acessíveis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = plan.id === currentPlan;
          const efficiency = getEfficiency(plan);
          const isRecommended = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative bg-gray-800/50 border rounded-2xl p-6 transition-all duration-300 hover:scale-105 ${
                isCurrentPlan 
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
                  : isRecommended
                  ? 'border-purple-500/50'
                  : 'border-gray-700/50 hover:border-gray-600'
              }`}
            >
              {/* Popular Badge */}
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <div className="bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Atual
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(plan.id)} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-white mb-1">
                  R$ {plan.price}
                  <span className="text-lg text-gray-400 font-normal">/mês</span>
                </div>
                <p className="text-sm text-gray-400">
                  {(plan.price / (plan.tokensLimit / 1000)).toFixed(3)} por 1K tokens
                </p>
              </div>

              {/* Efficiency Indicator */}
              {efficiency && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  efficiency.efficiency >= 70 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : efficiency.efficiency >= 40
                    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  <div className="text-sm font-medium mb-1">
                    Eficiência: {efficiency.efficiency.toFixed(0)}%
                  </div>
                  <div className="text-xs opacity-80">
                    {efficiency.recommendation}
                  </div>
                </div>
              )}

              {/* Plan Limits */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tokens mensais</span>
                  <span className="text-white font-medium">
                    {(plan.tokensLimit / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Mensagens</span>
                  <span className="text-white font-medium">
                    {plan.messagesLimit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Tempo resposta</span>
                  <span className="text-white font-medium">
                    até {plan.maxResponseTime}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Modelo IA</span>
                  <span className="text-cyan-400 font-medium">
                    {plan.aiModel}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isCurrentPlan
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : isRecommended
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105'
                }`}
              >
                {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          🚀 Por que escolher NexlaGPT?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>IA de alto desempenho (o4-mini)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Preços acessíveis sem bloqueios</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Upgrade automático disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Monitoramento proativo de uso</span>
          </div>
        </div>
      </div>
    </div>
  );
}