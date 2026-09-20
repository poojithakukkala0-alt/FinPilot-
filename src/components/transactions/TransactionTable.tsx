import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  SearchX,
  X,
  CreditCard,
  Receipt,
  Sparkles,
  ArrowRight,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Shopping: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Food: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Rent: { bg: 'bg-rose-50', text: 'text-rose-700' },
  Transport: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Bills: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  Subscriptions: { bg: 'bg-purple-50', text: 'text-purple-700' },
  Entertainment: { bg: 'bg-pink-50', text: 'text-pink-700' },
  Healthcare: { bg: 'bg-teal-50', text: 'text-teal-700' },
  Education: { bg: 'bg-sky-50', text: 'text-sky-700' },
  Salary: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  Investment: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  Other: { bg: 'bg-slate-100', text: 'text-slate-700' },
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  isLoading,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onResetFilters,
}) => {
  const { formatCurrency, setActiveNav, setSimulatorInput, setChatPrompt } = useFinance();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[monthIndex]} ${day}, ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleSimulate = (tx: Transaction) => {
    if (setSimulatorInput) {
      setSimulatorInput({
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
      });
    }
    setActiveNav('ai-command-center');
  };

  const handleAskAI = (tx: Transaction) => {
    if (setChatPrompt) {
      setChatPrompt(`Tell me more about my transaction at ${tx.merchant || tx.description} for ₹${tx.amount.toLocaleString('en-IN')}`);
    }
    setActiveNav('ai-command-center');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No transactions match your criteria</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Try clearing your search query or selecting a different category filter.
        </p>
        <button
          onClick={onResetFilters}
          className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Table Header Strip */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Ledger Records</h3>
          <p className="text-xs text-slate-500 mt-0.5">Showing verified financial debits and credits</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          {totalCount.toLocaleString('en-IN')} Total Records
        </span>
      </div>

      {/* Table Element */}
      {/* Mobile Card List (< sm) */}
      <div className="block sm:hidden divide-y divide-slate-100">
        {transactions.map((tx) => {
          const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
          const isIncome = tx.type === 'income';

          return (
            <div
              key={tx.transaction_id}
              onClick={() => setSelectedTx(tx)}
              className="p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {tx.merchant ? tx.merchant.charAt(0).toUpperCase() : tx.description.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate text-xs">
                    {tx.description}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${color.bg} ${color.text}`}>
                      {tx.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(tx.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`font-black text-xs ${
                    isIncome ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {tx.payment_method || 'UPI'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table (sm:block) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5">Transaction</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Method</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => {
              const color = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Other;
              const isIncome = tx.type === 'income';

              return (
                <tr
                  key={tx.transaction_id}
                  onClick={() => setSelectedTx(tx)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  {/* Merchant & Description */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        {tx.merchant ? tx.merchant.charAt(0).toUpperCase() : tx.description.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate max-w-xs group-hover:text-indigo-600 transition-colors">
                          {tx.description}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {tx.transaction_id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category Pill */}
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${color.bg} ${color.text}`}>
                      {tx.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {formatDate(tx.date)}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 text-slate-500">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                      {tx.payment_method || 'UPI'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right">
                    <div
                      className={`font-black text-sm ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleAskAI(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Analyze in AI Assistant"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulate(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Simulate this purchase"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800">{Math.min(1 + (page - 1) * 15, totalCount)}</span> to{' '}
          <span className="font-semibold text-slate-800">{Math.min(page * 15, totalCount)}</span> of{' '}
          <span className="font-semibold text-slate-800">{totalCount.toLocaleString('en-IN')}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-2 text-slate-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transaction Inspection Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Transaction Details</h4>
                  <p className="text-[11px] text-slate-500">{selectedTx.transaction_id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 font-medium">Amount</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {selectedTx.type === 'income' ? '+' : '-'}
                    {formatCurrency(selectedTx.amount)}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedTx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {selectedTx.type.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400">Description</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTx.description}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400">Category</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTx.category}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400">Date</div>
                  <div className="font-bold text-slate-800 mt-0.5">{formatDate(selectedTx.date)}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <div className="text-slate-400">Payment Method</div>
                  <div className="font-bold text-slate-800 mt-0.5">{selectedTx.payment_method || 'UPI'}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleAskAI(selectedTx);
                  setSelectedTx(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
