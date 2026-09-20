import React from 'react';
import { ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { MonthlySummary } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface MonthlySummaryCardProps {
  summary: MonthlySummary;
}

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({ summary }) => {
  const { formatCurrency, setActiveNav } = useFinance();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fintech-navy-900">
              Monthly Financial Summary
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consolidated snapshot & recurring commitments
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveNav('reports')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors group"
        >
          <span>View full report</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-teal-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Net Savings
          </span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {formatCurrency(summary.savings)}
          </div>
          <span className="text-[11px] text-slate-500">
            37% of gross earnings
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Top Category
          </span>
          <div className="text-lg font-bold text-fintech-navy-900 mt-1 truncate">
            {summary.top_category}
          </div>
          <span className="text-[11px] text-slate-500">
            {formatCurrency(summary.top_category_amount)} (27.2%)
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Largest Spike
          </span>
          <div className="text-lg font-bold text-amber-600 mt-1 truncate">
            {summary.largest_increase}
          </div>
          <span className="text-[11px] text-slate-500">
            vs. August baseline
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Recurring Commitments
          </span>
          <div className="text-lg font-bold text-fintech-navy-900 mt-1">
            {formatCurrency(summary.recurring_commitments)}
          </div>
          <span className="text-[11px] text-slate-500">
            Rent, utilities & subs
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Expense Total
          </span>
          <div className="text-lg font-bold text-slate-800 mt-1">
            {formatCurrency(summary.expenses)}
          </div>
          <span className="text-[11px] text-slate-500">
            Across 9 categories
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Plan Adherence
          </span>
          <div className="flex items-center gap-1.5 text-teal-700 font-bold text-base mt-1">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>On Track</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Emergency goal funded
          </span>
        </div>
      </div>
    </div>
  );
};
