import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export const AskFinPilotPromptCard: React.FC = () => {
  const { setActiveNav } = useFinance();
  const [query, setQuery] = useState('');

  const quickQuestions = [
    'Where did I spend the most?',
    'Which subscriptions am I paying for?',
    'What increased compared with last month?',
    'How much of my budget is committed?',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Store question in session so AI Assistant picks it up
    sessionStorage.setItem('finpilot_initial_query', query);
    setActiveNav('ai-assistant');
  };

  const handleChipClick = (q: string) => {
    sessionStorage.setItem('finpilot_initial_query', q);
    setActiveNav('ai-assistant');
  };

  return (
    <div className="bg-gradient-to-br from-fintech-navy-950 via-slate-900 to-fintech-navy-900 text-white rounded-2xl p-6 border border-slate-800 shadow-fintech-card relative overflow-hidden">
      {/* Background Decorative Neural Grid */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-fintech-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-400/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Ask FinPilot anything.
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                Agent Active
              </span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              Get answers based on your actual financial data and commitments.
            </p>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where did I spend the most this month?"
              className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-sm rounded-xl pl-4 pr-12 py-3.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 p-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold rounded-lg hover:brightness-110 transition-all shadow-md"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Question Chips */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Suggested prompts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleChipClick(q)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 hover:border-teal-500/50 transition-all duration-150 text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
