import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/api';
import { Budget } from '../types';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { useFinance } from '../context/FinanceContext';

export const BudgetsPage: React.FC = () => {
  const { formatCurrency, addToast, setActiveNav, setChatPrompt, setSimulatorInput } = useFinance();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveBudget = async (data: Omit<Budget, 'id' | 'user_id'>) => {
    try {
      if (selectedBudget) {
        const updated = await updateBudget(selectedBudget.id, data);
        setBudgets((prev) => prev.map((b) => (b.id === selectedBudget.id ? updated : b)));
        addToast('Budget Updated', `Updated ceiling for ${data.category}.`, 'success');
      } else {
        const created = await createBudget(data);
        setBudgets((prev) => [created, ...prev]);
        addToast('Budget Created', `Added monthly limit for ${data.category}.`, 'success');
      }
    } catch {
      addToast('Error', 'Failed to save budget.', 'error');
    }
    setSelectedBudget(null);
  };

  const handleDeleteBudget = async (b: Budget) => {
    if (window.confirm(`Are you sure you want to delete the ${b.category} budget?`)) {
      try {
        await deleteBudget(b.id);
        setBudgets((prev) => prev.filter((item) => item.id !== b.id));
        addToast('Budget Deleted', `Removed ${b.category} budget ceiling.`, 'info');
      } catch {
        addToast('Error', 'Failed to delete budget.', 'error');
      }
    }
  };

  const handleAskAI = (b: Budget) => {
    if (setChatPrompt) {
      setChatPrompt(`Analyze my ${b.category} spending. Am I over budget and how can I optimize it?`);
    }
    setActiveNav('ai-command-center');
  };

  const handleSimulate = (b: Budget) => {
    if (setSimulatorInput) {
      setSimulatorInput({
        amount: 2000,
        category: b.category,
        description: `Proposed ${b.category} expense`,
      });
    }
    setActiveNav('ai-command-center');
  };

  // Metrics
  const totalBudgeted = budgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + (b.spent || 0), 0);
  const remainingHeadroom = Math.max(0, totalBudgeted - totalSpent);
  const overallPercentage = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpent / totalBudgeted) * 100)) : 0;
  const overBudgetCategories = budgets.filter((b) => (b.spent || 0) > b.limit);

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Monthly Budget Ceilings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Set and track spending boundaries across categories with autonomous pacing alerts
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedBudget(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Overview Progress Card (Reference Design Header Bar) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Monthly Budget Overview
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(totalSpent)} spent <span className="text-xs font-normal text-slate-400">of {formatCurrency(totalBudgeted)} total ceiling</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              overBudgetCategories.length > 0
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {overBudgetCategories.length > 0
                ? `🚨 ${overBudgetCategories.length} Category Over Budget`
                : 'All Budgets Within Limits'}
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                overallPercentage >= 100
                  ? 'bg-rose-500'
                  : overallPercentage >= 80
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{overallPercentage}% Utilized</span>
            <span>{formatCurrency(remainingHeadroom)} Unallocated Headroom</span>
          </div>
        </div>

        {/* 4 Mini Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400">Total Ceilings:</span>
            <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(totalBudgeted)}</div>
          </div>
          <div>
            <span className="text-slate-400">Total Spent:</span>
            <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(totalSpent)}</div>
          </div>
          <div>
            <span className="text-slate-400">Headroom Remaining:</span>
            <div className="font-bold text-emerald-600 mt-0.5">+{formatCurrency(remainingHeadroom)}</div>
          </div>
          <div>
            <span className="text-slate-400">Pacing Health:</span>
            <div className="font-bold text-indigo-600 mt-0.5">
              {overBudgetCategories.length > 0 ? '1 Alert' : 'Healthy'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {budgets.map((b) => {
          const spent = b.spent || 0;
          const pct = Math.round((spent / b.limit) * 100);
          const isOver = spent > b.limit;
          const isWarning = pct >= 80 && !isOver;

          return (
            <div
              key={b.id}
              className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md ${
                isOver
                  ? 'border-amber-200 ring-1 ring-amber-200/50'
                  : 'border-slate-200/80 hover:border-indigo-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isOver ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.category}</h4>
                      <p className="text-[11px] text-slate-400 capitalize">{b.period} limit</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOver
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : isWarning
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {isOver ? `Over by ${formatCurrency(spent - b.limit)}` : `${pct}% Used`}
                  </span>
                </div>

                {/* Amount Details */}
                <div className="my-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Spent:</span>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(spent)}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {formatCurrency(b.limit)}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>0%</span>
                    <span>
                      {isOver ? 'Exceeded Ceiling' : `${formatCurrency(b.limit - spent)} left`}
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleAskAI(b)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Audit in AI</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBudget(b);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Edit budget"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBudget(b)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete budget"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBudget(null);
        }}
        onSave={handleSaveBudget}
        initialData={selectedBudget}
      />
    </div>
  );
};
