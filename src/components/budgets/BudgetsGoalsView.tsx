import React, { useState, useEffect } from 'react';
import {
  Plus,
  Target,
  PieChart,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../../services/api';
import { Budget, Goal } from '../../types';
import { BudgetModal } from './BudgetModal';
import { GoalModal } from './GoalModal';
import { useFinance } from '../../context/FinanceContext';
import { CategoryBadge } from '../common/Badge';

export const BudgetsGoalsView: React.FC = () => {
  const { formatCurrency, addToast } = useFinance();
  const [activeTab, setActiveTab] = useState<'budgets' | 'goals'>('budgets');

  // Budgets state
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Goals state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bData, gData] = await Promise.all([getBudgets(), getGoals()]);
      setBudgets(bData);
      setGoals(gData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Budget Handlers
  const handleSaveBudget = async (data: Omit<Budget, 'id' | 'user_id'>) => {
    if (selectedBudget) {
      const updated = await updateBudget(selectedBudget.id, data);
      setBudgets((prev) => prev.map((b) => (b.id === selectedBudget.id ? updated : b)));
      addToast('Budget Updated', `Updated limit for ${data.category}.`, 'success');
    } else {
      const created = await createBudget(data);
      setBudgets((prev) => [created, ...prev]);
      addToast('Budget Created', `Added monthly limit for ${data.category}.`, 'success');
    }
    setSelectedBudget(null);
  };

  const handleDeleteBudget = async (budget: Budget) => {
    if (window.confirm(`Are you sure you want to delete the ${budget.category} budget?`)) {
      await deleteBudget(budget.id);
      setBudgets((prev) => prev.filter((b) => b.id !== budget.id));
      addToast('Budget Deleted', `Removed ${budget.category} budget ceiling.`, 'info');
    }
  };

  // Goal Handlers
  const handleSaveGoal = async (data: Omit<Goal, 'id' | 'user_id'>) => {
    if (selectedGoal) {
      const updated = await updateGoal(selectedGoal.id, data);
      setGoals((prev) => prev.map((g) => (g.id === selectedGoal.id ? updated : g)));
      addToast('Goal Updated', `Updated target for ${data.name}.`, 'success');
    } else {
      const created = await createGoal(data);
      setGoals((prev) => [created, ...prev]);
      addToast('Goal Created', `Created savings goal: ${data.name}.`, 'success');
    }
    setSelectedGoal(null);
  };

  const handleDeleteGoal = async (goal: Goal) => {
    if (window.confirm(`Are you sure you want to delete the goal "${goal.name}"?`)) {
      await deleteGoal(goal.id);
      setGoals((prev) => prev.filter((g) => g.id !== goal.id));
      addToast('Goal Deleted', `Deleted ${goal.name}.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'budgets'
                ? 'bg-white text-fintech-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-4 h-4 text-teal-600" />
            <span>Monthly Budgets</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {budgets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'goals'
                ? 'bg-white text-fintech-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4 text-teal-600" />
            <span>Financial Goals</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {goals.length}
            </span>
          </button>
        </div>

        {/* Primary Action Button */}
        <div>
          {activeTab === 'budgets' ? (
            <button
              onClick={() => {
                setSelectedBudget(null);
                setIsBudgetModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Budget</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSelectedGoal(null);
                setIsGoalModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Goal</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          BUDGETS TAB CONTENT
          ======================================================== */}
      {activeTab === 'budgets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {budgets.map((budget) => {
              const spent = budget.spent || 0;
              const pct = Math.round((spent / budget.limit) * 100);
              const isOver = pct > 100;
              const isNear = pct >= 80 && pct <= 100;

              return (
                <div
                  key={budget.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-fintech-card hover:shadow-fintech-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Category & Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <CategoryBadge category={budget.category} />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedBudget(budget);
                            setIsBudgetModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit budget"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(budget)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Spend vs Limit */}
                    <div className="flex items-baseline justify-between mt-2">
                      <div className="text-xl font-extrabold text-fintech-navy-900">
                        {formatCurrency(spent)}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        Limit: {formatCurrency(budget.limit)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver
                            ? 'bg-rose-500'
                            : isNear
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-100">
                      <span className="font-semibold text-slate-600">{pct}% spent</span>
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          OVER BUDGET
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          {formatCurrency(budget.limit - spent)} remaining
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          GOALS TAB CONTENT
          ======================================================== */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {goals.map((goal) => {
              const pct = Math.round((goal.current / goal.target) * 100);
              const remaining = goal.target - goal.current;
              const monthsLeft =
                goal.monthly_contribution > 0
                  ? Math.ceil(remaining / goal.monthly_contribution)
                  : 0;

              return (
                <div
                  key={goal.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-fintech-card hover:shadow-fintech-hover transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-fintech-navy-900">
                            {goal.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {goal.category || 'Target Fund'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedGoal(goal);
                            setIsGoalModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Numbers */}
                    <div className="flex items-baseline justify-between mt-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Current Saved
                        </span>
                        <div className="text-lg font-extrabold text-teal-700">
                          {formatCurrency(goal.current)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Target
                        </span>
                        <div className="text-sm font-bold text-slate-700">
                          {formatCurrency(goal.target)}
                        </div>
                      </div>
                    </div>

                    {/* Goal Progress Bar */}
                    <div className="w-full bg-slate-100 h-2.5 rounded-full mt-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>

                    {/* Metrics Footer */}
                    <div className="space-y-1.5 mt-4 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Progress:</span>
                        <span className="font-bold text-slate-900">{pct}%</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Monthly contribution:</span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(goal.monthly_contribution)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Estimated completion:</span>
                        <span className="font-semibold text-teal-700">
                          ~{monthsLeft} months remaining
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSave={handleSaveBudget}
        initialData={selectedBudget}
      />

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
        initialData={selectedGoal}
      />
    </div>
  );
};
