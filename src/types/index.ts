export type TransactionType = 'income' | 'expense' | 'subscription' | 'bill';

export type TransactionCategory =
  | 'Food'
  | 'Shopping'
  | 'Transport'
  | 'Bills'
  | 'Subscriptions'
  | 'Entertainment'
  | 'Healthcare'
  | 'Rent'
  | 'Education'
  | 'Salary'
  | 'Other';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currency: string;
  currencySymbol: string;
  created_at?: string;
}

export interface Transaction {
  transaction_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  merchant?: string;
  status?: 'completed' | 'pending' | 'flagged';
  payment_method?: string;
  notes?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: TransactionCategory;
  limit: number;
  spent?: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target: number;
  current: number;
  monthly_contribution: number;
  target_date?: string;
  category?: string;
  icon?: string;
}

export interface RecurringPayment {
  id: string;
  user_id: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'weekly';
  next_due: string;
  status: 'active' | 'paused' | 'due_soon';
  payment_method?: string;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  color?: string;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
  category: string;
  metric?: string;
  created_at?: string;
}

export interface FinancialHealth {
  discipline_score: number; // 0-100
  budget_utilization: number; // e.g. 72%
  recurring_commitments: number; // e.g. 13568
  savings_rate: number; // e.g. 37%
  goal_progress: number; // e.g. 41%
  spending_trend: number; // e.g. +8%
  status_label: 'Excellent' | 'Good' | 'Fair' | 'Needs Attention';
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  savings: number;
  top_category: string;
  top_category_amount: number;
  largest_increase: string;
  largest_increase_pct: number;
  recurring_commitments: number;
}

export interface DashboardData {
  month: string;
  total_income: number;
  total_expenses: number;
  remaining_balance: number;
  savings_rate: number;
  income_growth_pct: number;
  expense_growth_pct: number;
  balance_growth_pct: number;
  savings_rate_growth_pct: number;
  category_spending: CategorySpending[];
  monthly_trends: MonthlyTrendData[];
  recent_insights: Insight[];
  monthly_summary: MonthlySummary;
  financial_health: FinancialHealth;
}

export interface DecisionSimulationInput {
  amount: number;
  category: TransactionCategory;
  description: string;
}

export interface DecisionSimulationResult {
  purchase_amount: number;
  current_balance: number;
  remaining_balance_after: number;
  upcoming_obligations: number;
  safety_buffer: number;
  category_budget_limit: number;
  category_spent_current: number;
  category_spent_after: number;
  category_utilization_current_pct: number;
  category_utilization_after_pct: number;
  is_over_budget: boolean;
  emergency_fund_progress_pct: number;
  goal_impact_summary: string;
  decision_grade: 'Recommended' | 'Proceed with Caution' | 'Not Recommended';
  reasons: {
    type: 'positive' | 'warning' | 'critical';
    message: string;
  }[];
  verdict: string;
}

export interface AgentStep {
  agent: string;
  tool: string;
  action: string;
  status: 'completed' | 'running' | 'pending';
  order: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  tools_used?: string[];
  agent_steps?: AgentStep[];
  grounded?: boolean;
  decision_grade?: 'Recommended' | 'Proceed with Caution' | 'Not Recommended' | 'Caution';
  metaCard?: {
    type: 'breakdown' | 'simulation' | 'budget_alert' | 'subscription_list';
    data?: any;
  };
}

export interface MonthlyReport {
  month: string;
  total_income: number;
  total_expenses: number;
  net_savings: number;
  savings_rate: number;
  top_category: string;
  largest_increase_category: string;
  recurring_total: number;
  category_breakdown: CategorySpending[];
  recurring_items: RecurringPayment[];
  budget_performance: {
    category: string;
    limit: number;
    spent: number;
    utilization_pct: number;
    status: 'Within' | 'Near Limit' | 'Over Budget';
  }[];
  goal_progress: {
    name: string;
    target: number;
    current: number;
    percentage: number;
    monthly_contribution: number;
    estimated_months_remaining: number;
  }[];
  key_insights: Insight[];
  action_items: {
    id: string;
    title: string;
    impact: 'High' | 'Medium' | 'Low';
    description: string;
  }[];
}

export interface UploadResult {
  success: boolean;
  message: string;
  transactions_processed: number;
  categories_detected: number;
  recurring_payments_found: number;
  insights_generated: number;
  filename: string;
  timestamp: string;
}
