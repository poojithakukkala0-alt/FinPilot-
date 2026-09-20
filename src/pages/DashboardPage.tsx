import React, { useState, useEffect } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Wallet,
  Sparkles,
  Plus,
  ArrowRight,
  Target,
  PieChart,
  ShieldCheck,
  Receipt,
  BotMessageSquare,
  Activity,
  Calendar,
  Clock,
} from 'lucide-react';
import { getDashboard, getTransactions } from '../services/api';
import { DashboardData, Transaction } from '../types';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { AiGreetingCompanion } from '../components/dashboard/AiGreetingCompanion';
import { SpendingCategoryChart } from '../components/dashboard/SpendingCategoryChart';
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { AGENT_LIST } from '../components/agents/agentData';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedMonth, formatCurrency, setActiveNav, setChatPrompt } = useFinance();
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, txRes] = await Promise.all([
        getDashboard(selectedMonth, user?.id || 'U001'),
        getTransactions({ limit: 5 }),
      ]);
      setData(dashRes);
      setRecentTransactions(txRes.transactions || []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, user]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
          <div className="h-28 bg-slate-200 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-80 bg-slate-200 rounded-2xl" />
          <div className="lg:col-span-4 h-80 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const currentBalance = data.remaining_balance;
  const totalIncome = data.total_income;
  const totalExpenses = data.total_expenses;
  const savingsRate = data.savings_rate;
  const topCategory = data.monthly_summary?.top_category || 'Shopping';
  const topCategoryAmount = data.monthly_summary?.top_category_amount || 7318;
  const expenseGrowthPct = data.expense_growth_pct || 13.2;

  const handleAskAgent = (agentPrompt: string) => {
    if (setChatPrompt) {
      setChatPrompt(agentPrompt);
    }
    setActiveNav('ai-command-center');
  };

  return (
    <div className="w-full space-y-5 sm:space-y-6 select-none">
      {/* =========================================================
          1. TOP ROW: AI GREETING CARD + MONTH INFO CARDS
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch w-full">
        {/* Left (8 cols on lg, full on mobile/tablet): AI Agent Greeting */}
        <div className="lg:col-span-8 flex w-full">
          <AiGreetingCompanion
            currentBalance={currentBalance}
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
            topCategory={topCategory}
            topCategoryAmount={topCategoryAmount}
          />
        </div>

        {/* Right (4 cols on lg, 2 cols on mobile/tablet): Month Information */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 w-full">
          {/* This Month Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center gap-3.5 hover:border-indigo-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                This Month
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                September 2026
              </div>
            </div>
          </div>

          {/* Last Month Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center gap-3.5 hover:border-indigo-200 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Last Month
              </div>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                August 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. TOP 4 METRIC CARDS (Clean White Fintech Cards)
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        {/* Card 1: Total Income */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Income</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalIncome)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                ↑ 12% vs last month
              </span>
              <span className="text-[11px] text-slate-400">Salary</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                ↑ 8% vs last month
              </span>
              <span className="text-[11px] text-slate-400">All categories</span>
            </div>
          </div>
        </div>

        {/* Card 3: Net Balance */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net Balance</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(currentBalance)}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Surplus
              </span>
              <span className="text-[11px] text-slate-400">{savingsRate}% saved</span>
            </div>
          </div>
        </div>

        {/* Card 4: Last Month Spend */}
        <div className="w-full min-w-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Last Month Spend</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              ₹41,208
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                Aug 2026
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Reduced by 8.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. EXPENSE BREAKDOWN & QUICK ACTIONS
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
        {/* Left 7 cols: Expense Breakdown Donut Chart */}
        <div className="lg:col-span-7 flex flex-col w-full min-w-0">
          <SpendingCategoryChart
            data={data.category_spending}
            totalSpending={totalExpenses}
          />
        </div>

        {/* Right 5 cols: Quick Actions Card */}
        <div className="lg:col-span-5 flex flex-col w-full min-w-0">
          <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
                <p className="text-xs text-slate-500 mt-0.5">Instant financial tools</p>
              </div>
            </div>

            <div className="space-y-3 my-auto pt-4">
              {/* Add Transaction */}
              <button
                type="button"
                onClick={() => setIsAddTxModalOpen(true)}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/60 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Add Transaction
                    </div>
                    <div className="text-[11px] text-slate-500">Record your expense or income</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Create Budget */}
              <button
                type="button"
                onClick={() => setActiveNav('budgets')}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/60 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Create Budget
                    </div>
                    <div className="text-[11px] text-slate-500">Set and manage your limits</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Set a Goal */}
              <button
                type="button"
                onClick={() => setActiveNav('goals')}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200/60 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      Set a Goal
                    </div>
                    <div className="text-[11px] text-slate-500">Save for your dreams</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* View Reports */}
              <button
                type="button"
                onClick={() => setActiveNav('reports')}
                className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/60 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      View Reports
                    </div>
                    <div className="text-[11px] text-slate-500">Track your financial progress</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. CASH FLOW TRENDS & RECENT TRANSACTIONS
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full">
        {/* Left 7 cols: Monthly Trend Bar Chart */}
        <div className="lg:col-span-7 w-full min-w-0">
          <MonthlyTrendChart data={data.monthly_trends} />
        </div>

        {/* Right 5 cols: Recent Transactions Table */}
        <div className="lg:col-span-5 w-full min-w-0 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest account activity</p>
            </div>
            <button
              onClick={() => setActiveNav('transactions')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransactions.map((tx) => (
              <div
                key={tx.transaction_id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.merchant ? tx.merchant.charAt(0).toUpperCase() : tx.description.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {tx.description}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {tx.date} • {tx.category}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-xs font-extrabold text-right shrink-0 ${
                    tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxModalOpen}
        onClose={() => setIsAddTxModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};
