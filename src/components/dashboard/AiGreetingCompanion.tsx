import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { FinancialBotAvatar } from '../common/FinancialBotAvatar';

interface AiGreetingCompanionProps {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  topCategory: string;
  topCategoryAmount: number;
}

export const AiGreetingCompanion: React.FC<AiGreetingCompanionProps> = ({
  currentBalance,
  totalIncome,
  totalExpenses,
  topCategory,
  topCategoryAmount,
}) => {
  const { user } = useAuth();
  const { formatCurrency, setActiveNav, setChatPrompt } = useFinance();

  const displayName = user?.name && user.name !== 'Demo User' ? user.name : 'Poojitha';

  const handleAskAI = (prompt: string) => {
    if (setChatPrompt) {
      setChatPrompt(prompt);
    }
    setActiveNav('ai-command-center');
  };

  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-indigo-100/90 p-4 sm:p-6 shadow-sm">
      {/* Subtle ambient light gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 w-full">
        {/* Friendly 3D Robot Avatar with gentle float animation */}
        <div className="relative shrink-0 animate-ai-float">
          <FinancialBotAvatar size="md" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-400/30" />
        </div>

        {/* Written Conversation Message */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0 w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Financial Assistant</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Hi {displayName}! 👋
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal w-full max-w-4xl">
            I'm your financial assistant. Here's your financial snapshot for this month.
            I can help you understand spending, manage your budget, reach your goals, and simulate future purchases.
          </p>

          {/* Quick Action Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
            <button
              onClick={() => handleAskAI('Where did I spend the most this month?')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-indigo-50/80 text-slate-700 border border-slate-200/90 shadow-sm transition-all flex items-center gap-1.5 hover:border-indigo-300"
            >
              <span>Analyze Spending</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
            </button>

            <button
              onClick={() => handleAskAI('Check my budget ceilings and tell me if any category is over limit.')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white hover:bg-indigo-50/80 text-slate-700 border border-slate-200/90 shadow-sm transition-all flex items-center gap-1.5 hover:border-indigo-300"
            >
              <span>Budget Ceilings</span>
              <ArrowRight className="w-3 h-3 text-indigo-500" />
            </button>

            <button
              onClick={() => setActiveNav('ai-command-center')}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-amber-300" />
              <span>Ask AI Question</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
