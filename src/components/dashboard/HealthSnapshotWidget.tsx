import React from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { FinancialHealth } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface HealthSnapshotWidgetProps {
  health: FinancialHealth;
}

export const HealthSnapshotWidget: React.FC<HealthSnapshotWidgetProps> = ({ health }) => {
  const { formatCurrency } = useFinance();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fintech-navy-900 flex items-center gap-2">
              Financial Health Snapshot
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {health.status_label}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Habit-driven financial wellness indicators (not a credit score)
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Discipline Index: {health.discipline_score}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5">
        {/* Budget Utilization */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Budget Utilization
          </span>
          <div className="text-xl font-extrabold text-fintech-navy-900 mt-1">
            {health.budget_utilization}%
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full"
              style={{ width: `${Math.min(health.budget_utilization, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Target: &lt; 85%
          </span>
        </div>

        {/* Recurring Commitments */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Recurring Bills
          </span>
          <div className="text-xl font-extrabold text-fintech-navy-900 mt-1">
            {formatCurrency(health.recurring_commitments)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            27.1% of monthly income
          </div>
        </div>

        {/* Savings Rate */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Savings Rate
          </span>
          <div className="text-xl font-extrabold text-emerald-600 mt-1">
            {health.savings_rate}%
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(health.savings_rate * 2, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Target: &gt; 25%
          </span>
        </div>

        {/* Goal Progress */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Goal Progress
          </span>
          <div className="text-xl font-extrabold text-fintech-navy-900 mt-1">
            {health.goal_progress}%
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${health.goal_progress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Across 3 active goals
          </span>
        </div>

        {/* Spending Trend */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Spending Trend
          </span>
          <div className="flex items-center gap-1 text-xl font-extrabold text-amber-600 mt-1">
            <TrendingUp className="w-5 h-5" />
            <span>↑ {health.spending_trend}%</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block">
            MoM change vs August
          </span>
        </div>
      </div>
    </div>
  );
};
