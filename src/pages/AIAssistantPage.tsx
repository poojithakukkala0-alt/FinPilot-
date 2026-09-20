import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RefreshCw,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Target,
  Calendar,
  Zap,
} from 'lucide-react';
import { AGENT_LIST } from '../components/agents/agentData';
import { askFinPilot, getDashboard } from '../services/api';
import { ChatMessage, DashboardData, AgentStep } from '../types';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { FinancialBotAvatar } from '../components/common/FinancialBotAvatar';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { selectedMonth, formatCurrency, openSimulator, chatPrompt, setChatPrompt, setActiveNav } = useFinance();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello **${user?.name || 'Poojitha'}**! 👋 I am **FinPilot AI**, your Personal Finance Decision Support Agent.\n\nI have reconciled your **September 2026** transactions, budget limits, and scheduled commitments. Ask me anything about where your money went, how your budgets are performing, or simulate a planned purchase before you spend.`,
      timestamp: '10:38 AM',
      tools_used: ['analyze_spending'],
      agent_steps: [
        {
          agent: 'Spending Analyst',
          tool: 'analyze_spending',
          action: 'Reconciled 328 September transactions',
          status: 'completed',
          order: 1,
        },
      ],
      suggestions: [
        'Where did my money go?',
        'Am I over budget on shopping?',
        'Can I afford to spend ₹5,000 this week?',
        'How did September compare with August?',
        'Find unusual spending',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgentFilter, setActiveAgentFilter] = useState<string | null>(null);
  const [expandedCalculation, setExpandedCalculation] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTelemetry = async () => {
      try {
        const d = await getDashboard(selectedMonth, user?.id || 'U001');
        setDashboardData(d);
      } catch (e) {
        console.error('Failed to load telemetry', e);
      }
    };
    loadTelemetry();
  }, [selectedMonth, user]);

  useEffect(() => {
    if (chatPrompt) {
      setInput(chatPrompt);
      setChatPrompt('');
    }
  }, [chatPrompt, setChatPrompt]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const quickActions = [
    'Where did my money go?',
    'Am I over budget on shopping?',
    'Can I afford to spend ₹5,000 this week?',
    'What changed this month?',
    'Find unusual spending',
    'How much can I safely save?',
  ];

  const handleSend = async (messageText?: string) => {
    const query = (messageText || input).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askFinPilot(query, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: response.suggestions,
        tools_used: response.tools_used,
        agent_steps: response.agent_steps,
        grounded: response.grounded ?? true,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'FinPilot AI experienced a temporary connection delay. Please retry your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const getDecisionBadge = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('not recommended') || lower.includes('depletes your balance')) {
      return { label: 'NOT RECOMMENDED', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (lower.includes('proceed with caution') || lower.includes('caution') || lower.includes('over budget')) {
      return { label: 'PROCEED WITH CAUTION', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (lower.includes('recommended') || lower.includes('healthy') || lower.includes('fits comfortably')) {
      return { label: 'RECOMMENDED', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    return null;
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] w-full">
        <div className="flex items-center gap-4">
          <FinancialBotAvatar size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                AI Command Center
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                7 Agents Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ask FinPilot anything about your spending, budget ceilings, and purchase simulations
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveNav('decision-simulator')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all shrink-0 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Simulate Purchase</span>
        </button>
      </div>

      {/* 3-Column Master Layout with Responsive Ordering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        {/* Column 1: Agent Fleet Panel (Left on Desktop: 3 cols, below chat on Mobile) */}
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-3 w-full">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Agent Fleet
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                All Online
              </span>
            </div>

            {/* 7 Agents List */}
            <div className="space-y-1.5">
              {AGENT_LIST.map((ag) => {
                const isSelected = activeAgentFilter === ag.id;
                return (
                  <button
                    key={ag.id}
                    onClick={() => {
                      setActiveAgentFilter(isSelected ? null : ag.id);
                      handleSend(`Consult ${ag.name} on my current spending and budgets`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between group border ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/70 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate group-hover:text-indigo-600">
                        {ag.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {ag.role}
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md shrink-0">
                      ● Active
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Conversational Chat Interface (Center on Desktop: 6 cols, First on Mobile) */}
        <div className="order-1 lg:order-2 lg:col-span-6 space-y-3">
          {/* Quick Action Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(action)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-medium transition-all shrink-0 shadow-sm active:scale-95"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Chat Window Container */}
          <div className="h-[480px] sm:h-[580px] rounded-2xl bg-white border border-slate-200/80 flex flex-col overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            {/* Messages Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const decision = !isUser ? getDecisionBadge(msg.text) : null;
                const isCalcExpanded = expandedCalculation[msg.id] || false;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-start gap-2.5 max-w-[92%]">
                      {!isUser && (
                        <div className="mt-1 shrink-0">
                          <FinancialBotAvatar size="sm" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                          isUser
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-none shadow-sm'
                            : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none shadow-sm'
                        }`}
                      >
                        {/* Header for AI response */}
                        {!isUser && (
                          <div className="space-y-2 pb-2 border-b border-slate-200/60">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">FinPilot AI</span>
                                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                  Autonomous Copilot
                                </span>
                              </div>

                              {decision && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${decision.color}`}>
                                  ● {decision.label}
                                </span>
                              )}
                            </div>

                            {/* Tool Execution Steps */}
                            {msg.agent_steps && msg.agent_steps.length > 0 && (
                              <div className="p-2 rounded-xl bg-white border border-slate-200/60 space-y-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Agent Execution Sequence:
                                </div>
                                {msg.agent_steps.map((st: AgentStep, idx: number) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <strong className="text-slate-800">{st.agent}</strong>
                                    <span className="text-slate-400">→</span>
                                    <span className="truncate">{st.action}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Text */}
                        <div className="whitespace-pre-wrap font-normal text-xs sm:text-[13px] leading-relaxed">
                          {msg.text}
                        </div>

                        {/* Calculation Breakdown Accordion */}
                        {!isUser && msg.tools_used && msg.tools_used.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-slate-400 font-medium">Tools:</span>
                              {msg.tools_used.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-slate-200 font-mono text-[10px]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() =>
                                setExpandedCalculation((prev) => ({
                                  ...prev,
                                  [msg.id]: !prev[msg.id],
                                }))
                              }
                              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                            >
                              <span>{isCalcExpanded ? 'Hide calculation' : 'Show calculation'}</span>
                              {isCalcExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        )}

                        {/* Expanded Calculation Content */}
                        {!isUser && isCalcExpanded && (
                          <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-mono space-y-1.5 text-slate-700 animate-in fade-in">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                              Ledger Calculation Breakdown
                            </div>
                            <div className="flex justify-between">
                              <span>Total Monthly Income:</span>
                              <span className="text-slate-900 font-bold">₹50,000</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Recorded Spending:</span>
                              <span className="text-rose-600 font-bold">−₹37,633</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-1 font-bold">
                              <span>Net Liquid Balance:</span>
                              <span className="text-emerald-600">₹12,367</span>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Scheduled Commitments:</span>
                              <span>−₹13,449</span>
                            </div>
                          </div>
                        )}

                        {/* Suggested Follow-ups */}
                        {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                          <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                            {msg.suggestions.map((sug, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSend(sug)}
                                className="px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium transition-all text-left shadow-sm"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-1 shadow-sm">
                          {user?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Typing State */}
              {isTyping && (
                <div className="flex items-start gap-2.5">
                  <FinancialBotAvatar size="sm" />
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                      <span className="font-bold text-slate-900">FinPilot AI is analyzing...</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span>Synthesizing agent advice</span>
                      <span className="animate-pulse">● ● ●</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3.5 border-t border-slate-100 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask FinPilot anything about your finances..."
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Column 3: Live Financial Snapshot (Right on Desktop: 3 cols, Last on Mobile) */}
        <div className="order-3 lg:order-3 lg:col-span-3 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Live Context
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {selectedMonth}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Income:</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(dashboardData?.total_income || 50000)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Spent:</span>
                <span className="font-bold text-rose-600">
                  {formatCurrency(dashboardData?.total_expenses || 37633)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <span className="text-emerald-800 font-medium">Net Runway:</span>
                <span className="font-extrabold text-emerald-700">
                  +{formatCurrency(dashboardData?.remaining_balance || 12367)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                <span className="text-amber-800 font-medium">Shopping Budget:</span>
                <span className="font-extrabold text-amber-700">
                  104.5% Used
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveNav('decision-simulator')}
              className="w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Purchase</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
