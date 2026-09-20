import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyTrendData } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const { formatCurrency } = useFinance();

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-base font-bold text-fintech-navy-900">
            Income vs. Expenses Trend
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Q3 Performance comparison (July – September 2026)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-3 h-3 rounded-sm bg-slate-700" />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'income' ? 'Total Income' : 'Total Expenses',
              ]}
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
            <Bar
              dataKey="income"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
            <Bar
              dataKey="expenses"
              fill="#1E293B"
              radius={[6, 6, 0, 0]}
              maxBarSize={38}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
