import React from 'react';
import { Zap, TrendingUp, AlertTriangle, Target } from 'lucide-react';

interface TokenProgressCardProps {
  tokensUsed: number;
  tokensLimit: number;
  projectedUsage: number;
  daysRemaining: number;
  efficiency: number;
}

export default function TokenProgressCard({ 
  tokensUsed, 
  tokensLimit, 
  projectedUsage, 
  daysRemaining,
  efficiency 
}: TokenProgressCardProps) {
  const percentage = (tokensUsed / tokensLimit) * 100;
  const projectedPercentage = (projectedUsage / tokensLimit) * 100;
  const remaining = tokensLimit - tokensUsed;
  
  const getProgressColor = () => {
    if (percentage >= 90) return 'from-red-500 to-red-600';
    if (percentage >= 75) return 'from-orange-500 to-orange-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-cyan-500 to-blue-500';
  };

  const getStatusColor = () => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-orange-400';
    return 'text-cyan-400';
  };

  const getEfficiencyColor = () => {
    if (efficiency >= 80) return 'text-green-400';
    if (efficiency >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Uso de Tokens</h3>
            <p className="text-sm text-gray-400">{daysRemaining} dias restantes</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getStatusColor()}`}>
            {percentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">utilizado</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Uso atual</span>
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {tokensUsed.toLocaleString()} / {tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="relative w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
            {/* Projection indicator */}
            {projectedPercentage > percentage && (
              <div 
                className="absolute top-0 h-3 bg-orange-400/30 rounded-full transition-all duration-500"
                style={{ 
                  left: `${percentage}%`,
                  width: `${Math.min(projectedPercentage - percentage, 100 - percentage)}%`
                }}
              />
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">
              {remaining.toLocaleString()} restantes
            </span>
            {projectedPercentage > percentage && (
              <span className="text-xs text-orange-400">
                Projeção: {projectedPercentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">Projeção</span>
            </div>
            <div className="text-lg font-bold text-blue-400">
              {projectedUsage.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">tokens/mês</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">Eficiência</span>
            </div>
            <div className={`text-lg font-bold ${getEfficiencyColor()}`}>
              {efficiency}%
            </div>
            <div className="text-xs text-gray-400">otimização</div>
          </div>
        </div>

        {/* Warning */}
        {percentage >= 75 && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            percentage >= 90 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
              : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
          }`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">
              {percentage >= 90 
                ? 'Limite crítico! Upgrade urgente recomendado para evitar interrupções.'
                : 'Alto uso detectado. Considere fazer upgrade do seu plano.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}