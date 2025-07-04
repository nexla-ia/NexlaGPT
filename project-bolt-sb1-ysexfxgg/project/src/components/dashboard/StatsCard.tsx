import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'cyan' | 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  cyan: {
    bg: 'from-cyan-500/10 to-cyan-600/10',
    border: 'border-cyan-500/20',
    icon: 'text-cyan-400',
    text: 'text-cyan-400'
  },
  blue: {
    bg: 'from-blue-500/10 to-blue-600/10',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    text: 'text-blue-400'
  },
  green: {
    bg: 'from-green-500/10 to-green-600/10',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    text: 'text-green-400'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/10',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    text: 'text-purple-400'
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/10',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
    text: 'text-orange-400'
  },
  red: {
    bg: 'from-red-500/10 to-red-600/10',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    text: 'text-red-400'
  }
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-4 sm:p-6 hover:scale-105 transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-2 sm:p-3 bg-gray-800/50 rounded-lg ${colors.icon}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
        {trend && (
          <div className={`text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-gray-400 text-xs sm:text-sm font-medium">{title}</p>
        {subtitle && (
          <p className={`text-xs mt-1 ${colors.text}`}>{subtitle}</p>
        )}
      </div>
    </div>
  );
}