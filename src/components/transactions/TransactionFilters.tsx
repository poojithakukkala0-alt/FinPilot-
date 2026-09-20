import React from 'react';
import { Search, Download, ArrowUpDown, Filter } from 'lucide-react';
import { TransactionCategory } from '../../types';

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  type: string;
  onTypeChange: (v: string) => void;
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';
  onSortByChange: (v: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc') => void;
  onExportCSV: () => void;
  isExporting?: boolean;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  sortBy,
  onSortByChange,
  onExportCSV,
  isExporting = false,
}) => {
  const categories: (string | TransactionCategory)[] = [
    'All',
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Subscriptions',
    'Entertainment',
    'Healthcare',
    'Education',
    'Salary',
    'Rent',
    'Other',
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by merchant, description, or keyword..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/60 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Filter Selects & Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Type Segmented Controls */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {['All', 'Income', 'Expense'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onTypeChange(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                type.toLowerCase() === t.toLowerCase() || (type === 'All' && t === 'All')
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="amount_desc">Highest Amount</option>
            <option value="amount_asc">Lowest Amount</option>
          </select>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={onExportCSV}
          disabled={isExporting}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-sm disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>
    </div>
  );
};
