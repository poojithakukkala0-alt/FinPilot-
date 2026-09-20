import React from 'react';
import { TransactionType, TransactionCategory } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'teal' | 'navy' | 'blue' | 'purple' | 'amber' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gray',
  size = 'sm',
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    navy: 'bg-cockpit-surface text-slate-200 border-cockpit-border',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    red: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    gray: 'bg-cockpit-surface text-slate-300 border-cockpit-border',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${variantStyles[variant]} ${sizeStyles[size]} transition-colors`}
    >
      {children}
    </span>
  );
};

export const TypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  switch (type.toLowerCase()) {
    case 'income':
      return <Badge variant="emerald">Income</Badge>;
    case 'expense':
      return <Badge variant="red">Expense</Badge>;
    case 'subscription':
      return <Badge variant="purple">Subscription</Badge>;
    case 'bill':
      return <Badge variant="blue">Bill</Badge>;
    default:
      return <Badge variant="gray">{type}</Badge>;
  }
};

export const CategoryBadge: React.FC<{ category: TransactionCategory }> = ({ category }) => {
  const getCategoryColor = (cat: string): BadgeProps['variant'] => {
    switch (cat) {
      case 'Food':
        return 'emerald';
      case 'Shopping':
        return 'amber';
      case 'Transport':
        return 'blue';
      case 'Bills':
        return 'blue';
      case 'Subscriptions':
        return 'purple';
      case 'Entertainment':
        return 'purple';
      case 'Healthcare':
        return 'teal';
      case 'Education':
        return 'blue';
      case 'Salary':
        return 'emerald';
      case 'Rent':
        return 'red';
      default:
        return 'gray';
    }
  };

  return <Badge variant={getCategoryColor(category)}>{category}</Badge>;
};
