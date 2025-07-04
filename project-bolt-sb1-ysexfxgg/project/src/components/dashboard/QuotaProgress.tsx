import React from 'react';
import { MessageSquare, Clock, AlertTriangle } from 'lucide-react';

interface QuotaProgressProps {
  used: number;
  limit: number;
  planName: string;
  daysRemaining: number;
}

export default function QuotaProgress({ used, limit, planName, daysRemaining }: QuotaProgressProps) {
  const percentage = (used / limit) * 100;
  const remaining = limit - used;
  
  const getProgressColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-gradient-to-r from-cyan-500 to-blue-500';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-orange-400';
    return 'text-cyan-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Cota de Mensagens</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{daysRemaining} dias restantes</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Uso atual</span>
            <span className={`text-sm font-medium ${getTextColor()}`}>
              {used.toLocaleString()} / {limit.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">{percentage.toFixed(1)}% usado</span>
            <span className="text-xs text-gray-500">{remaining.toLocaleString()} restantes</span>
          </div>
        </div>

        {/* Plan Info */}
        <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700/30">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm font-medium text-white">{planName}</p>
              <p className="text-xs text-gray-400">R$ 49/mês</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200">
            Gerenciar
          </button>
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
                ? 'Cota quase esgotada! Considere fazer upgrade do seu plano.'
                : 'Você está usando mais de 75% da sua cota mensal.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}