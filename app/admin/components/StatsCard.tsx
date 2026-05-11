'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  trend?: number;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorClasses = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-green-500/20 text-green-400',
  purple: 'bg-purple-500/20 text-purple-400',
  orange: 'bg-orange-500/20 text-orange-400',
  red: 'bg-red-500/20 text-red-400',
};

export function StatsCard({ title, value, trend, icon: Icon, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-[#1a1918]/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-[#e31e24]/50 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-[#e31e24]' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
