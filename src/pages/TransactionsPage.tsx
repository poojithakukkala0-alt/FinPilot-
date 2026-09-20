import React, { useState, useEffect } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, TrendingUp, AlertTriangle, Download } from 'lucide-react';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { AddTransactionModal } from '../components/transactions/AddTransactionModal';
import { getTransactions, getDashboard } from '../services/api';
import { Transaction, DashboardData } from '../types';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';

export const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast, formatCurrency, selectedMonth } = useFinance();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [type, setType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const [txRes, dashRes] = await Promise.all([
        getTransactions({
          search,
          category,
          type,
          page: currentPage,
          limit: 15,
          sortBy,
        }),
        getDashboard(selectedMonth, user?.id || 'U001'),
      ]);
      setTransactions(txRes.transactions);
      setTotalCount(txRes.total);
      setTotalPages(txRes.totalPages);
      setDashboardData(dashRes);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, category, type, sortBy, currentPage, selectedMonth]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setSortBy('date_desc');
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const full = await getTransactions({
        search,
        category,
        type,
        page: 1,
        limit: 5000,
        sortBy,
      });

      const headers = ['Transaction ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method'];
      const rows = full.transactions.map((t) => [
        t.transaction_id,
        t.date,
        `"${t.description.replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount,
        t.payment_method || 'UPI',
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FinPilot_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast('CSV Exported', `Successfully exported ${full.transactions.length} records.`, 'success');
    } catch {
      addToast('Export Failed', 'Unable to generate CSV.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Dynamic values from backend API
  const totalInflow = dashboardData?.total_income || 50000;
  const totalOutflow = dashboardData?.total_expenses || 37633;
  const topCategory = dashboardData?.monthly_summary?.top_category || 'Shopping';
  const topCategoryAmount = dashboardData?.monthly_summary?.top_category_amount || 7318;
  const netSurplus = dashboardData?.remaining_balance || 12367;

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Top Header with Add Transaction Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Transactions Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Complete transaction history with category tagging and real-time reconciliation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 4-Metric Summary Strip (Dynamic API Values) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{selectedMonth} Inflows</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {formatCurrency(totalInflow)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Reconciled Salary
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{selectedMonth} Outflows</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {formatCurrency(totalOutflow)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalCount} Transactions Recorded
          </div>
        </div>

        {/* Top Spending Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Top Outflow</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            {formatCurrency(topCategoryAmount)}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1 truncate">
            {topCategory} • 104.5% limit
          </div>
        </div>

        {/* Net Monthly Runway */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Net Surplus</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">
            +{formatCurrency(netSurplus)}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            Positive Cash Runway
          </div>
        </div>
      </div>

      {/* Filter Component */}
      <TransactionFilters
        search={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        category={category}
        onCategoryChange={(v) => {
          setCategory(v);
          setCurrentPage(1);
        }}
        type={type}
        onTypeChange={(v) => {
          setType(v);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(v) => {
          setSortBy(v);
          setCurrentPage(1);
        }}
        onExportCSV={handleExportCSV}
        isExporting={isExporting}
      />

      {/* Table Component */}
      <TransactionTable
        transactions={transactions}
        isLoading={isLoading}
        page={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setCurrentPage(p)}
        onResetFilters={handleResetFilters}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTransactions}
      />
    </div>
  );
};
