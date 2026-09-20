import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import { Goal } from '../types';
import { GoalModal } from '../components/budgets/GoalModal';
import { useFinance } from '../context/FinanceContext';

export const GoalsPage: React.FC = () => {
  const { formatCurrency, addToast, setActiveNav, setChatPrompt, setSimulatorInput } = useFinance();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGoal = async (data: Omit<Goal, 'id' | 'user_id'>) => {
    try {
      if (selectedGoal) {
        const updated = await updateGoal(selectedGoal.id, data);
        setGoals((prev) => prev.map((g) => (g.id === selectedGoal.id ? updated : g)));
        addToast('Goal Updated', `Updated target for ${data.name}.`, 'success');
      } else {
        const created = await createGoal(data);
        setGoals((prev) => [created, ...prev]);
        addToast('Goal Created', `Created savings goal: ${data.name}.`, 'success');
      }
    } catch {
      addToast('Error', 'Failed to save goal.', 'error');
    }
    setSelectedGoal(null);
  };

  const handleDeleteGoal = async (g: Goal) => {
    if (window.confirm(`Are you sure you want to delete "${g.name}"?`)) {
      try {
        await deleteGoal(g.id);
        setGoals((prev) => prev.filter((item) => item.id !== g.id));
        addToast('Goal Deleted', `Removed ${g.name}.`, 'info');
      } catch {
        addToast('Error', 'Failed to delete goal.', 'error');
      }
    }
  };

  const handleAskAI = (g: Goal) => {
    if (setChatPrompt) {
      setChatPrompt(`How can I accelerate my savings for "${g.name}"? Currently at ₹${g.current.toLocaleString('en-IN')} of ₹${g.target.toLocaleString('en-IN')}.`);
    }
    setActiveNav('ai-command-center');
  };

  const handleSimulateImpact = (g: Goal) => {
    if (setSimulatorInput) {
      setSimulatorInput({
        amount: 5000,
        category: 'Shopping',
        description: `Impact on ${g.name}`,
      });
    }
    setActiveNav('ai-command-center');
  };

  // Aggregates
  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);
  const totalPct = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
  const totalMonthlyCommitments = goals.reduce((acc, g) => acc + (g.monthly_contribution || 0), 0);

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Savings & Wealth Goals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track capital accumulation milestones and monthly systematic allocations
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedGoal(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Overview Progress Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Total Wealth Capitalization
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {formatCurrency(totalSaved)} saved <span className="text-xs font-normal text-slate-400">of {formatCurrency(totalTarget)} target portfolio</span>
            </h3>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {totalPct}% Portfolio Funded
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{totalPct}% Accumulated</span>
            <span>{formatCurrency(totalTarget - totalSaved)} Remaining Gap</span>
          </div>
        </div>

        {/* 4 Mini Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400">Target Capital:</span>
            <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(totalTarget)}</div>
          </div>
          <div>
            <span className="text-slate-400">Total Saved:</span>
            <div className="font-bold text-slate-900 mt-0.5">{formatCurrency(totalSaved)}</div>
          </div>
          <div>
            <span className="text-slate-400">Monthly Contribution:</span>
            <div className="font-bold text-indigo-600 mt-0.5">{formatCurrency(totalMonthlyCommitments)}/mo</div>
          </div>
          <div>
            <span className="text-slate-400">Pacing Health:</span>
            <div className="font-bold text-emerald-600 mt-0.5">On Schedule</div>
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {goals.map((g) => {
          const pct = Math.round((g.current / g.target) * 100);
          const isComplete = pct >= 100;

          return (
            <div
              key={g.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-indigo-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{g.name}</h4>
                      <p className="text-[11px] text-slate-400">Target: {g.target_date || 'Dec 2026'}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isComplete
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {pct}% Funded
                  </span>
                </div>

                {/* Progress Details */}
                <div className="my-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500">Accumulated:</span>
                    <span className="text-base font-black text-slate-900">
                      {formatCurrency(g.current)}{' '}
                      <span className="text-xs font-normal text-slate-400">/ {formatCurrency(g.target)}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>{formatCurrency(g.monthly_contribution || 5000)}/mo contribution</span>
                    <span className="font-semibold text-slate-700">{formatCurrency(g.target - g.current)} to go</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleAskAI(g)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Advise in AI</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGoal(g);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    title="Edit goal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteGoal(g)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete goal"
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
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGoal(null);
        }}
        onSave={handleSaveGoal}
        initialData={selectedGoal}
      />
    </div>
  );
};
