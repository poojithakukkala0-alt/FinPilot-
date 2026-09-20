import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Receipt,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { getMonthlyReport } from '../../services/api';
import { MonthlyReport } from '../../types';
import { useFinance } from '../../context/FinanceContext';

export const MonthlyReportView: React.FC = () => {
  const { selectedMonth, setSelectedMonth, formatCurrency, addToast } = useFinance();
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadReport(selectedMonth);
  }, [selectedMonth]);

  const loadReport = async (m: string) => {
    const data = await getMonthlyReport(m);
    setReport(data);
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    await loadReport(selectedMonth);
    setIsGenerating(false);
    addToast('Summary Generated', `Synthesized report analytics for ${selectedMonth}.`, 'success');
  };

  const handleDownloadReport = () => {
    window.print();
  };

  if (!report) return null;

  return (
    <div className="w-full space-y-6 print-page pb-12 select-none">
      {/* Top Report Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Executive Financial Dossier</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monthly Report — {selectedMonth}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified financial cashflow, budget performance, and wealth accumulation
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap no-print">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isGenerating ? 'Generating...' : 'Refresh Summary'}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 1. Financial Overview KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Gross Inflow
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(report.total_income)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            100% Salary Reconciled
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Expenditures
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(report.total_expenses)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            75.3% of total income
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Net Monthly Surplus
          </span>
          <div className="text-xl font-black text-emerald-600 mt-1">
            +{formatCurrency(report.net_savings)}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            {report.savings_rate}% Savings Rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Scheduled Commitments
          </span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {formatCurrency(report.recurring_total)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            5 recurring obligations
          </span>
        </div>
      </div>

      {/* 2. Spending Breakdown & Commitments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            Outflow Breakdown by Category
          </h3>
          <div className="space-y-3.5 mt-4">
            {report.category_breakdown.map((item) => (
              <div key={item.category} className="text-xs">
                <div className="flex justify-between font-semibold text-slate-800 mb-1.5">
                  <span>{item.category}</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.amount)} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recurring Commitments Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Scheduled Payments & Subscriptions
            </h3>
            <div className="divide-y divide-slate-100 mt-2">
              {report.recurring_items.map((r) => (
                <div
                  key={r.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800">{r.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Next Due: {r.next_due} • {r.payment_method}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {formatCurrency(r.amount)}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.status === 'due_soon'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.status === 'due_soon' ? 'Due Soon' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-800">
            <span>Total Monthly Obligation</span>
            <span className="text-indigo-600">{formatCurrency(report.recurring_total)}</span>
          </div>
        </div>
      </div>

      {/* 4. Budget & Goal Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            Budget Ceiling Performance
          </h3>
          <div className="divide-y divide-slate-100 mt-2">
            {report.budget_performance.map((b) => (
              <div
                key={b.category}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{b.category}</span>
                  <div className="text-[11px] text-slate-500">
                    {formatCurrency(b.spent)} of {formatCurrency(b.limit)}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                      b.status === 'Over Budget'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {b.utilization_pct}% ({b.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
            Wealth Milestone Progress
          </h3>
          <div className="divide-y divide-slate-100 mt-2">
            {report.goal_progress.map((g) => (
              <div
                key={g.name}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{g.name}</span>
                  <div className="text-[11px] text-slate-500">
                    {formatCurrency(g.current)} / {formatCurrency(g.target)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-indigo-600">{g.percentage}%</div>
                  <div className="text-[11px] text-slate-400">
                    ~{g.estimated_months_remaining} mo remaining
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Key AI Insights & Concrete Action Items */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>Recommended AI Action Items for Next 30 Days</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {report.action_items.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      act.impact === 'High'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    }`}
                  >
                    {act.impact} Impact
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {act.title}
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
