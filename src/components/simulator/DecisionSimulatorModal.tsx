import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
  Info,
  RotateCcw,
  MessageSquare,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { simulateDecision } from '../../services/api';
import { DecisionSimulationResult, TransactionCategory } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface DecisionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionSimulatorModal: React.FC<DecisionSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { simulatorInput, formatCurrency, setActiveNav } = useFinance();

  const [amount, setAmount] = useState<number>(5000);
  const [category, setCategory] = useState<TransactionCategory>('Shopping');
  const [description, setDescription] = useState<string>('I want to spend ₹5,000 on shopping.');
  const [result, setResult] = useState<DecisionSimulationResult | null>(null);

  useEffect(() => {
    if (simulatorInput) {
      setAmount(simulatorInput.amount);
      setCategory(simulatorInput.category);
      setDescription(simulatorInput.description);
    }
  }, [simulatorInput]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      simulateDecision({ amount, category, description })
        .then((sim) => {
          if (isMounted) setResult(sim);
        })
        .catch((err) => {
          console.error('Simulation error:', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, amount, category, description]);

  const presets = [
    { label: 'Shopping: ₹5,000', amt: 5000, cat: 'Shopping' as TransactionCategory, desc: 'New fashion & gadgets shopping' },
    { label: 'Dinner: ₹3,500', amt: 3500, cat: 'Food' as TransactionCategory, desc: 'Weekend gourmet dinner with friends' },
    { label: 'Phone: ₹25,000', amt: 25000, cat: 'Shopping' as TransactionCategory, desc: 'Upgrading to new 5G smartphone' },
    { label: 'Trip: ₹12,000', amt: 12000, cat: 'Entertainment' as TransactionCategory, desc: 'Weekend road trip & stay' },
  ];

  const handlePreset = (preset: typeof presets[0]) => {
    setAmount(preset.amt);
    setCategory(preset.cat);
    setDescription(preset.desc);
  };

  const handleAskAI = () => {
    onClose();
    setActiveNav('ai-assistant');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Decision Simulator"
      subtitle="Analyze the realistic cash-flow, budget, and goal impact of an expense before you spend."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Preset Quick Fill */}
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Try Common Scenarios
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  amount === p.amt && category === p.cat
                    ? 'bg-teal-50 text-teal-700 border-teal-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Planned Purchase (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">
                ₹
              </span>
              <input
                type="number"
                min="100"
                step="500"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 text-sm font-semibold rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
              Purchase Note
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. New headphones"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Dynamic Analysis Display */}
        {result && (
          <div className="space-y-4">
            {/* Header Verdict Card */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                result.decision_grade === 'Recommended'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : result.decision_grade === 'Proceed with Caution'
                  ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {result.decision_grade === 'Recommended' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : result.decision_grade === 'Proceed with Caution' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {result.decision_grade}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/70 border border-current/20">
                    Decision Support Analysis
                  </span>
                </div>
                <p className="text-sm font-medium mt-1 leading-relaxed">
                  {result.verdict}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Current Balance
                </span>
                <div className="text-base font-bold text-slate-800 mt-1">
                  {formatCurrency(result.current_balance)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Before purchase</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Upcoming Obligations
                </span>
                <div className="text-base font-bold text-slate-800 mt-1">
                  {formatCurrency(result.upcoming_obligations)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rent, bills, subs</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Balance After Spend
                </span>
                <div
                  className={`text-base font-bold mt-1 ${
                    result.remaining_balance_after < 0 ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {formatCurrency(result.remaining_balance_after)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Safe buffer: {formatCurrency(result.safety_buffer)}
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  {category} Budget
                </span>
                <div
                  className={`text-base font-bold mt-1 ${
                    result.category_utilization_after_pct > 100
                      ? 'text-rose-600'
                      : 'text-slate-800'
                  }`}
                >
                  {result.category_utilization_after_pct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  was {result.category_utilization_current_pct}%
                </div>
              </div>
            </div>

            {/* Visual Budget Progress Impact */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700">
                  {category} Budget Impact: {formatCurrency(result.category_spent_after)} / {formatCurrency(result.category_budget_limit)}
                </span>
                <span
                  className={
                    result.is_over_budget ? 'text-rose-600 font-bold' : 'text-teal-700'
                  }
                >
                  {result.is_over_budget ? 'OVER BUDGET' : 'Within Budget'}
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(result.category_utilization_current_pct, 100)}%` }}
                  className="bg-teal-500 h-full transition-all"
                  title="Current spend"
                />
                <div
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(
                        result.category_utilization_after_pct - result.category_utilization_current_pct,
                        100 - result.category_utilization_current_pct
                      )
                    )}%`,
                  }}
                  className={`h-full transition-all ${
                    result.is_over_budget ? 'bg-rose-500' : 'bg-amber-400'
                  }`}
                  title="Additional planned purchase"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                <span>0%</span>
                <span className="font-semibold text-slate-600">
                  Limit: {formatCurrency(result.category_budget_limit)}
                </span>
                <span>{result.category_utilization_after_pct}% projected</span>
              </div>
            </div>

            {/* Decision Factors & Reasons */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Key Decision Drivers
              </h4>
              <div className="space-y-1.5">
                {result.reasons.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200"
                  >
                    {r.type === 'positive' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {r.type === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    {r.type === 'critical' && (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{r.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer & Policy Notice */}
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>FinPilot Decision Guard:</strong> Analysis is generated deterministically from your actual cash flows, active budget thresholds, and scheduled recurring bills. FinPilot does not provide investment or financial advice.
              </span>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <button
            onClick={() => handlePreset(presets[0])}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAskAI}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss with AI Agent</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-fintech-navy-900 text-white hover:bg-fintech-navy-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
