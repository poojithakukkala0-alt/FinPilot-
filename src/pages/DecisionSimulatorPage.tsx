import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Info,
  Layers,
  Target,
  Loader2,
} from 'lucide-react';
import { simulateDecision } from '../services/api';
import { DecisionSimulationResult, TransactionCategory } from '../types';
import { useFinance } from '../context/FinanceContext';

export const DecisionSimulatorPage: React.FC = () => {
  const { formatCurrency, setActiveNav, setChatPrompt } = useFinance();

  const [amount, setAmount] = useState<number>(5000);
  const [category, setCategory] = useState<TransactionCategory>('Shopping');
  const [description, setDescription] = useState<string>('Festival shopping and gadgets');
  const [result, setResult] = useState<DecisionSimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const presets = [
    { label: 'Shopping: ₹5,000', amt: 5000, cat: 'Shopping' as TransactionCategory, desc: 'Festival shopping and clothes' },
    { label: 'Dinner & Outing: ₹3,500', amt: 3500, cat: 'Food' as TransactionCategory, desc: 'Weekend gourmet dinner with friends' },
    { label: 'Smartphone Upgrade: ₹25,000', amt: 25000, cat: 'Shopping' as TransactionCategory, desc: 'Upgrading to new 5G smartphone' },
    { label: 'Weekend Getaway: ₹12,000', amt: 12000, cat: 'Entertainment' as TransactionCategory, desc: 'Weekend road trip & resort stay' },
    { label: 'Smartwatch: ₹4,000', amt: 4000, cat: 'Shopping' as TransactionCategory, desc: 'Fitness smartwatch tracker' },
  ];

  const runSimulation = async (amt: number, cat: TransactionCategory, desc: string) => {
    setIsLoading(true);
    try {
      const res = await simulateDecision({
        amount: amt,
        category: cat,
        description: desc,
      });
      setResult(res);
    } catch (err) {
      console.error('Failed to run simulation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSimulation(amount, category, description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePreset = (p: typeof presets[0]) => {
    setAmount(p.amt);
    setCategory(p.cat);
    setDescription(p.desc);
    runSimulation(p.amt, p.cat, p.desc);
  };

  const handleAskAI = () => {
    if (setChatPrompt) {
      setChatPrompt(`Can I afford to spend ₹${amount.toLocaleString('en-IN')} on ${category.toLowerCase()} (${description}) this month?`);
    }
    setActiveNav('ai-command-center');
  };

  const isCritical = result?.decision_grade === 'Not Recommended';
  const isCaution = result?.decision_grade === 'Proceed with Caution';
  const isRecommended = result?.decision_grade === 'Recommended';

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5" />
              Decision Simulation Engine
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Impact & Affordability Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Simulate the realistic ripple effect of any upcoming expense on your cash surplus, category budgets, scheduled obligations, and savings milestones before you commit.
          </p>
        </div>

        <button
          onClick={handleAskAI}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all shrink-0 shadow-sm"
        >
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Consult AI Agent</span>
        </button>
      </div>

      {/* Preset Quick Actions */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 text-indigo-600">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Scenarios to Test
          </span>
          <span>Click any scenario to simulate instantly</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const isSelected = amount === p.amt && category === p.cat;
            return (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`text-xs px-3.5 py-2 rounded-xl border font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulator Inputs Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Simulation Parameters
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Planned Purchase Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Spending Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            >
              <option value="Shopping">Shopping</option>
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other Discretionary</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Purchase Description / Purpose
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Festival electronics sale"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Calculates net buffer after accounting for ₹13,449 in scheduled recurring commitments.</span>
          </div>
          <button
            onClick={() => runSimulation(amount, category, description)}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-4 h-4" />
                <span>Run Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Cash Flow Step-Through */}
      {result && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Cash Flow Progression
              </h3>
            </div>
            <span className="text-xs text-slate-500">Reconciled Cash Runway</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Step 1: Current Surplus */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                1. Current Surplus
              </div>
              <div className="text-lg font-black text-emerald-600 mt-1">
                {formatCurrency(result.current_balance)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                ₹50,000 Income − ₹37,633 Spent
              </div>
            </div>

            {/* Step 2: Proposed Outflow */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                2. Proposed Outflow
              </div>
              <div className="text-lg font-black text-rose-600 mt-1">
                −{formatCurrency(result.purchase_amount)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                {category} • {description}
              </div>
            </div>

            {/* Step 3: Projected Balance */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                3. Remaining Balance
              </div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {formatCurrency(result.remaining_balance_after)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Before upcoming bills
              </div>
            </div>

            {/* Step 4: Scheduled Obligations */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                4. Obligations
              </div>
              <div className="text-lg font-black text-slate-800 mt-1">
                −{formatCurrency(result.upcoming_obligations)}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Recurring Rent & Bills
              </div>
            </div>

            {/* Step 5: Net Safety Buffer */}
            <div
              className={`p-4 rounded-xl border ${
                result.safety_buffer < 0
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : result.safety_buffer < 5000
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider">
                5. Net Cash Buffer
              </div>
              <div className="text-lg font-black mt-1">
                {result.safety_buffer < 0 ? '−' : ''}
                {formatCurrency(Math.abs(result.safety_buffer))}
              </div>
              <div className="text-[10px] font-semibold mt-0.5">
                {result.safety_buffer < 0
                  ? '🚨 Deficit / Buffer Depleted'
                  : result.safety_buffer < 5000
                  ? '⚠️ Narrow Safety Margin'
                  : '✅ Healthy Cash Margin'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Result & AI Verdict */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Decision Verdict Card (2 Columns) */}
          <div
            className={`lg:col-span-2 p-6 rounded-2xl border flex flex-col justify-between ${
              isRecommended
                ? 'bg-emerald-50/60 border-emerald-200'
                : isCaution
                ? 'bg-amber-50/60 border-amber-200'
                : 'bg-rose-50/60 border-rose-200'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isRecommended
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCaution
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {isRecommended ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCaution ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <ShieldAlert className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isRecommended
                          ? 'bg-emerald-200 text-emerald-800'
                          : isCaution
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-rose-200 text-rose-800'
                      }`}
                    >
                      {result.decision_grade}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Financial Decision Support Verdict
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleAskAI}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ask AI for Alternative</span>
                </button>
              </div>

              {/* Main AI Verdict Statement */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {result.verdict}
                </p>
              </div>

              {/* Key Rationale List */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Decision Factors
                </div>
                <div className="space-y-2">
                  {result.reasons.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-start gap-2.5 shadow-sm"
                    >
                      <div className="shrink-0 mt-0.5">
                        {r.type === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        ) : r.type === 'warning' ? (
                          <Info className="w-4 h-4 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <span className="font-medium text-slate-700 leading-relaxed">{r.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Autonomous Financial Analysis</span>
              <button
                onClick={handleAskAI}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                Discuss with FinPilot AI <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Budget & Goal Impact Panel (1 Column) */}
          <div className="space-y-4">
            {/* Category Budget Impact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {category} Budget Impact
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    result.category_utilization_after_pct > 100
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {result.category_utilization_after_pct}% Utilized
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Projected Category Outflow:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(result.category_spent_after)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Category Ceiling:</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(result.category_budget_limit)}
                  </span>
                </div>
              </div>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.category_utilization_after_pct > 100 ? 'bg-rose-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${Math.min(100, result.category_utilization_after_pct)}%` }}
                />
              </div>
            </div>

            {/* Savings Goal Impact */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Wealth Goal Impact
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {result.emergency_fund_progress_pct}% Goal Status
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {result.goal_impact_summary}
              </p>

              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                  style={{ width: `${result.emergency_fund_progress_pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
