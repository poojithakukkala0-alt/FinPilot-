import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { CategorySpending } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface SpendingCategoryChartProps {
  data: CategorySpending[];
  totalSpending: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: '#F59E0B',
  Food: '#10B981',
  Transport: '#3B82F6',
  Bills: '#6366F1',
  Subscriptions: '#8B5CF6',
  Entertainment: '#EC4899',
  Healthcare: '#14B8A6',
  Education: '#0EA5E9',
  Other: '#94A3B8',
};

export const SpendingCategoryChart: React.FC<SpendingCategoryChartProps> = ({
  data,
  totalSpending,
}) => {
  const { formatCurrency, setActiveNav } = useFinance();

  const chartData = data.map((item) => ({
    ...item,
    color: CATEGORY_COLORS[item.category] || '#94A3B8',
  }));

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Expense Breakdown
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Category distribution for September 2026
          </p>
        </div>
        <button
          onClick={() => setActiveNav('transactions')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
        >
          <span>View details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Chart Body: Donut on left, List on right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-4 w-full">
        {/* Donut Chart Container */}
        <div className="sm:col-span-6 relative h-60 sm:h-72 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Spend']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '12px',
                  color: '#FFF',
                  border: 'none',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
                }}
                itemStyle={{ color: '#FFF' }}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {formatCurrency(totalSpending)}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
              Total Expenses
            </span>
          </div>
        </div>

        {/* Categories Breakdown List */}
        <div className="sm:col-span-6 space-y-2.5 w-full pr-1">
          {chartData.map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-slate-800 truncate">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-right shrink-0">
                <span className="font-semibold text-slate-500">
                  {item.percentage.toFixed(1)}%
                </span>
                <span className="font-bold text-fintech-navy-900 w-20">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
