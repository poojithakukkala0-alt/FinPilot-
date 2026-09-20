import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Budget, TransactionCategory } from '../../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Budget, 'id' | 'user_id'>) => Promise<void>;
  initialData?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [category, setCategory] = useState<TransactionCategory>(
    initialData?.category || 'Food'
  );
  const [limit, setLimit] = useState<number>(initialData?.limit || 5000);
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>(
    initialData?.period || 'monthly'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: TransactionCategory[] = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Subscriptions',
    'Entertainment',
    'Healthcare',
    'Education',
    'Rent',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        category,
        limit,
        period,
        spent: initialData?.spent || 0,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Budget' : 'Add Monthly Budget'}
      subtitle="Establish a spending ceiling to receive proactive pacing notifications."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Spending Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monthly Limit (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">
              ₹
            </span>
            <input
              type="number"
              min="500"
              step="500"
              required
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full pl-8 pr-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Pacing Period
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['monthly', 'weekly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                  period === p
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Budget' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
