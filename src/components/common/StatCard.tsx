import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  growthPct: number;
  growthPeriod?: string;
  inverseColors?: boolean; // For expenses where an increase is warning
  icon: React.ReactNode;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  growthPct,
  growthPeriod = 'vs last month',
  inverseColors = false,
  icon,
  iconBg = 'bg-teal-50 text-teal-600',
}) => {
  const isPositive = growthPct >= 0;
  
  // For expenses, growth is negative sentiment (red), drop is positive sentiment (green)
  const isGood = inverseColors ? !isPositive : isPositive;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card hover:shadow-fintech-hover transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <h3 className="text-2xl lg:text-3xl font-bold tracking-tight text-fintech-navy-900 mt-2">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg} shadow-sm`}>
          {icon}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isGood
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
              : 'bg-rose-50 text-rose-700 border border-rose-200/70'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {isPositive ? `+${growthPct}%` : `${growthPct}%`}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {growthPeriod}
        </span>
      </div>
    </div>
  );
};
