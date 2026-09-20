import {
  User,
  Transaction,
  Budget,
  Goal,
  RecurringPayment,
  DashboardData,
  MonthlyReport,
  Insight
} from '../types';

export const DEMO_USER: User = {
  id: 'U001',
  email: 'poojitha@finpilot.com',
  name: 'Poojitha',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  currency: 'INR',
  currencySymbol: '₹',
  created_at: '2026-06-01',
};

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-001',
    user_id: 'U001',
    category: 'Food',
    limit: 5000,
    spent: 4200,
    period: 'monthly',
  },
  {
    id: 'b-002',
    user_id: 'U001',
    category: 'Shopping',
    limit: 7000,
    spent: 8500,
    period: 'monthly',
  },
  {
    id: 'b-003',
    user_id: 'U001',
    category: 'Transport',
    limit: 5000,
    spent: 4000,
    period: 'monthly',
  },
  {
    id: 'b-004',
    user_id: 'U001',
    category: 'Bills',
    limit: 5000,
    spent: 2800,
    period: 'monthly',
  },
  {
    id: 'b-005',
    user_id: 'U001',
    category: 'Entertainment',
    limit: 3000,
    spent: 2400,
    period: 'monthly',
  },
  {
    id: 'b-006',
    user_id: 'U001',
    category: 'Subscriptions',
    limit: 2500,
    spent: 1850,
    period: 'monthly',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-001',
    user_id: 'U001',
    name: 'Emergency Fund',
    target: 100000,
    current: 40000,
    monthly_contribution: 10000,
    target_date: '2027-03-31',
    category: 'Safety Net',
    icon: 'Shield',
  },
  {
    id: 'g-002',
    user_id: 'U001',
    name: 'New Laptop',
    target: 60000,
    current: 25000,
    monthly_contribution: 5000,
    target_date: '2027-04-30',
    category: 'Technology',
    icon: 'Laptop',
  },
  {
    id: 'g-003',
    user_id: 'U001',
    name: 'Annual Vacation',
    target: 50000,
    current: 18000,
    monthly_contribution: 4000,
    target_date: '2027-05-30',
    category: 'Travel',
    icon: 'Plane',
  },
];

export const INITIAL_RECURRING: RecurringPayment[] = [
  {
    id: 'r-001',
    user_id: 'U001',
    name: 'Apartment Rent',
    category: 'Rent',
    amount: 10000,
    frequency: 'monthly',
    next_due: '2026-10-01',
    status: 'active',
    payment_method: 'UPI Auto-debit',
  },
  {
    id: 'r-002',
    user_id: 'U001',
    name: 'Netflix Premium (4K)',
    category: 'Subscriptions',
    amount: 649,
    frequency: 'monthly',
    next_due: '2026-09-30',
    status: 'due_soon',
    payment_method: 'Credit Card',
  },
  {
    id: 'r-003',
    user_id: 'U001',
    name: 'Airtel Xstream Fiber',
    category: 'Bills',
    amount: 1200,
    frequency: 'monthly',
    next_due: '2026-10-05',
    status: 'active',
    payment_method: 'NetBanking',
  },
  {
    id: 'r-004',
    user_id: 'U001',
    name: 'Cult.Fit Gym Membership',
    category: 'Healthcare',
    amount: 1600,
    frequency: 'monthly',
    next_due: '2026-10-10',
    status: 'active',
    payment_method: 'Debit Card',
  },
  {
    id: 'r-005',
    user_id: 'U001',
    name: 'Spotify Family Premium',
    category: 'Subscriptions',
    amount: 119,
    frequency: 'monthly',
    next_due: '2026-10-15',
    status: 'active',
    payment_method: 'UPI',
  },
];

// Helper to generate rich realistic transactions for user U001
const rawCoreTransactions: Omit<Transaction, 'transaction_id' | 'user_id'>[] = [
  { date: '2026-09-28', description: 'SWIGGY GOURMET', amount: 450, type: 'expense', category: 'Food', merchant: 'Swiggy', payment_method: 'UPI' },
  { date: '2026-09-27', description: 'AMAZON ELECTRONICS', amount: 4500, type: 'expense', category: 'Shopping', merchant: 'Amazon India', payment_method: 'HDFC Credit Card' },
  { date: '2026-09-26', description: 'SALARY CREDIT - TECH CORP', amount: 50000, type: 'income', category: 'Salary', merchant: 'TechCorp Solutions', payment_method: 'NEFT' },
  { date: '2026-09-25', description: 'UBER PREMIER', amount: 620, type: 'expense', category: 'Transport', merchant: 'Uber India', payment_method: 'UPI' },
  { date: '2026-09-24', description: 'ZOMATO DINING', amount: 1280, type: 'expense', category: 'Food', merchant: 'Zomato', payment_method: 'Credit Card' },
  { date: '2026-09-23', description: 'MYNTRA FASHION SALE', amount: 2400, type: 'expense', category: 'Shopping', merchant: 'Myntra', payment_method: 'UPI' },
  { date: '2026-09-22', description: 'BLINKIT GROCERIES', amount: 840, type: 'expense', category: 'Food', merchant: 'Blinkit', payment_method: 'UPI' },
  { date: '2026-09-21', description: 'NETFLIX SUBSCRIPTION', amount: 649, type: 'expense', category: 'Subscriptions', merchant: 'Netflix', payment_method: 'Auto Debit' },
  { date: '2026-09-20', description: 'BESCOM ELECTRICITY BILL', amount: 1600, type: 'expense', category: 'Bills', merchant: 'BESCOM', payment_method: 'NetBanking' },
  { date: '2026-09-19', description: 'INDIAN OIL PETROL PUMP', amount: 2200, type: 'expense', category: 'Transport', merchant: 'Indian Oil', payment_method: 'Credit Card' },
  { date: '2026-09-18', description: 'APOLLO PHARMACY VMS', amount: 950, type: 'expense', category: 'Healthcare', merchant: 'Apollo Pharmacy', payment_method: 'UPI' },
  { date: '2026-09-17', description: 'PVR INOX CINEMAS', amount: 1100, type: 'expense', category: 'Entertainment', merchant: 'PVR Cinemas', payment_method: 'Credit Card' },
  { date: '2026-09-16', description: 'UDEMY PYTHON & AI COURSE', amount: 1299, type: 'expense', category: 'Education', merchant: 'Udemy', payment_method: 'Debit Card' },
  { date: '2026-09-15', description: 'STARBUCKS COFFEE', amount: 480, type: 'expense', category: 'Food', merchant: 'Starbucks', payment_method: 'UPI' },
  { date: '2026-09-14', description: 'DECATHLON SPORTS GEAR', amount: 1600, type: 'expense', category: 'Shopping', merchant: 'Decathlon', payment_method: 'Credit Card' },
  { date: '2026-09-12', description: 'AIRTEL BROADBAND BILL', amount: 1200, type: 'expense', category: 'Bills', merchant: 'Airtel', payment_method: 'UPI' },
  { date: '2026-09-11', description: 'SPOTIFY PREMIUM', amount: 119, type: 'expense', category: 'Subscriptions', merchant: 'Spotify', payment_method: 'UPI AutoPay' },
  { date: '2026-09-10', description: 'ZEPTO ESSENTIALS', amount: 560, type: 'expense', category: 'Food', merchant: 'Zepto', payment_method: 'UPI' },
  { date: '2026-09-08', description: 'RAPIDO BIKE TAXI', amount: 180, type: 'expense', category: 'Transport', merchant: 'Rapido', payment_method: 'UPI' },
  { date: '2026-09-06', description: 'CULT.FIT MONTHLY', amount: 1600, type: 'expense', category: 'Healthcare', merchant: 'Cult.Fit', payment_method: 'Auto Debit' },
  { date: '2026-09-05', description: 'BOOKMYSHOW CONCERT', amount: 1300, type: 'expense', category: 'Entertainment', merchant: 'BookMyShow', payment_method: 'Credit Card' },
  { date: '2026-09-03', description: 'AMAZON HOME UTILITIES', amount: 1600, type: 'expense', category: 'Other', merchant: 'Amazon India', payment_method: 'Credit Card' },
  { date: '2026-09-01', description: 'HOUSE RENT FOR SEPTEMBER', amount: 10000, type: 'expense', category: 'Rent', merchant: 'Landlord Transfer', payment_method: 'UPI' },

  // August 2026
  { date: '2026-08-26', description: 'SALARY CREDIT - TECH CORP', amount: 44640, type: 'income', category: 'Salary', merchant: 'TechCorp Solutions', payment_method: 'NEFT' },
  { date: '2026-08-24', description: 'AMAZON SALE - ELECTRONICS', amount: 3500, type: 'expense', category: 'Shopping', merchant: 'Amazon India', payment_method: 'Credit Card' },
  { date: '2026-08-22', description: 'SWIGGY INSTAMART', amount: 1150, type: 'expense', category: 'Food', merchant: 'Swiggy', payment_method: 'UPI' },
  { date: '2026-08-20', description: 'BESCOM ELECTRICITY BILL', amount: 1550, type: 'expense', category: 'Bills', merchant: 'BESCOM', payment_method: 'NetBanking' },
  { date: '2026-08-18', description: 'UBER RIDES WEEKLY', amount: 1800, type: 'expense', category: 'Transport', merchant: 'Uber India', payment_method: 'UPI' },
  { date: '2026-08-15', description: 'INDEPENDENCE DAY DINNER', amount: 2100, type: 'expense', category: 'Food', merchant: 'Barbeque Nation', payment_method: 'Credit Card' },
  { date: '2026-08-12', description: 'AIRTEL BROADBAND', amount: 1200, type: 'expense', category: 'Bills', merchant: 'Airtel', payment_method: 'UPI' },
  { date: '2026-08-10', description: 'ZARA APPAREL', amount: 2500, type: 'expense', category: 'Shopping', merchant: 'Zara', payment_method: 'Credit Card' },
  { date: '2026-08-05', description: 'BOOK PURCHASE - O REILLY', amount: 1800, type: 'expense', category: 'Education', merchant: 'Amazon Books', payment_method: 'Debit Card' },
  { date: '2026-08-01', description: 'HOUSE RENT FOR AUGUST', amount: 10000, type: 'expense', category: 'Rent', merchant: 'Landlord Transfer', payment_method: 'UPI' },

  // July 2026
  { date: '2026-07-26', description: 'SALARY CREDIT - TECH CORP', amount: 44000, type: 'income', category: 'Salary', merchant: 'TechCorp Solutions', payment_method: 'NEFT' },
  { date: '2026-07-24', description: 'AMAZON MONSOON SALE', amount: 3200, type: 'expense', category: 'Shopping', merchant: 'Amazon India', payment_method: 'Credit Card' },
  { date: '2026-07-20', description: 'ELECTRICITY BILL', amount: 1400, type: 'expense', category: 'Bills', merchant: 'BESCOM', payment_method: 'NetBanking' },
  { date: '2026-07-18', description: 'RESTAURANT WEEKEND', amount: 1800, type: 'expense', category: 'Food', merchant: 'Toscano', payment_method: 'Credit Card' },
  { date: '2026-07-15', description: 'METRO COMMUTE PASS', amount: 1500, type: 'expense', category: 'Transport', merchant: 'BMRCL', payment_method: 'UPI' },
  { date: '2026-07-12', description: 'BROADBAND INTERNET', amount: 1200, type: 'expense', category: 'Bills', merchant: 'Airtel', payment_method: 'UPI' },
  { date: '2026-07-08', description: 'MEDICAL CHECKUP', amount: 1200, type: 'expense', category: 'Healthcare', merchant: 'Manipal Hospital', payment_method: 'UPI' },
  { date: '2026-07-01', description: 'HOUSE RENT FOR JULY', amount: 10000, type: 'expense', category: 'Rent', merchant: 'Landlord Transfer', payment_method: 'UPI' },
];

// Generate an extended set of transactions to simulate ~1,000 transactions over 3 months
export const generateAllTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  let idCounter = 1;

  // Insert core transactions first
  rawCoreTransactions.forEach((tx) => {
    transactions.push({
      ...tx,
      transaction_id: `U001-T${String(idCounter++).padStart(5, '0')}`,
      user_id: 'U001',
      status: 'completed',
    });
  });

  // Synthesize realistic micro-transactions (daily chai, metro, auto, snacks, groceries)
  const months = [
    { year: 2026, month: 9, days: 28 },
    { year: 2026, month: 8, days: 31 },
    { year: 2026, month: 7, days: 31 },
  ];

  const microMerchants = [
    { desc: 'CHAI POINT SNACKS', cat: 'Food', amount: 120, type: 'expense' },
    { desc: 'METRO SMART CARD RECHARGE', cat: 'Transport', amount: 200, type: 'expense' },
    { desc: 'BLINKIT QUICK ORDER', cat: 'Food', amount: 340, type: 'expense' },
    { desc: 'AUTO FARE (NAMMA YATRI)', cat: 'Transport', amount: 150, type: 'expense' },
    { desc: 'ZEPTO DAILY VEGGIES', cat: 'Food', amount: 220, type: 'expense' },
    { desc: 'AMAZON PAPERBACK BOOK', cat: 'Education', amount: 450, type: 'expense' },
    { desc: 'MOBILE RECHARGE (AIRTEL)', cat: 'Bills', amount: 299, type: 'expense' },
    { desc: 'MEDPLUS MEDICINES', cat: 'Healthcare', amount: 380, type: 'expense' },
  ] as const;

  months.forEach(({ year, month, days }) => {
    for (let day = 1; day <= days; day++) {
      // Add 2-3 realistic micro daily expenses
      const count = (day % 3) + 1;
      for (let i = 0; i < count; i++) {
        const item = microMerchants[(day + i) % microMerchants.length];
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        transactions.push({
          transaction_id: `U001-T${String(idCounter++).padStart(5, '0')}`,
          user_id: 'U001',
          date: dateStr,
          description: item.desc,
          amount: item.amount + ((day * 7) % 50),
          type: item.type,
          category: item.cat as any,
          merchant: item.desc.split(' ')[0],
          status: 'completed',
          payment_method: 'UPI',
        });
      }
    }
  });

  // Sort descending by date
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_TRANSACTIONS: Transaction[] = generateAllTransactions();

export const INITIAL_INSIGHTS: Insight[] = [
  {
    id: 'ins-001',
    title: 'Shopping increased by 42%',
    description: 'Compared with last month, your shopping expenditure rose by ₹2,500, primarily on electronics and fashion sales.',
    severity: 'warning',
    category: 'Shopping',
    metric: '+42%',
    created_at: '2026-09-27',
  },
  {
    id: 'ins-002',
    title: 'Food delivery expenses increased by 28%',
    description: 'Swiggy and Zomato spending reached ₹4,200 across 16 orders, up from 11 orders in August.',
    severity: 'warning',
    category: 'Food',
    metric: '+28%',
    created_at: '2026-09-25',
  },
  {
    id: 'ins-003',
    title: 'Netflix subscription of ₹649 is due soon',
    description: 'Scheduled renewal on September 30, 2026 via Credit Card auto-pay.',
    severity: 'info',
    category: 'Subscriptions',
    metric: 'Due in 2 days',
    created_at: '2026-09-28',
  },
  {
    id: 'ins-004',
    title: 'You are at 121% of your Shopping budget',
    description: 'Current spending is ₹8,500 against your planned limit of ₹7,000. Rebalance non-essential expenses.',
    severity: 'danger',
    category: 'Budgets',
    metric: '121% Used',
    created_at: '2026-09-28',
  },
  {
    id: 'ins-005',
    title: 'Savings rate on track at 37%',
    description: 'You saved ₹18,750 this month, exceeding your 30% emergency savings milestone.',
    severity: 'success',
    category: 'Savings',
    metric: '37% Rate',
    created_at: '2026-09-26',
  },
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  month: 'September 2026',
  total_income: 50000,
  total_expenses: 31250,
  remaining_balance: 18750,
  savings_rate: 37,
  income_growth_pct: 12,
  expense_growth_pct: 8,
  balance_growth_pct: 15,
  savings_rate_growth_pct: 6,
  category_spending: [
    { category: 'Shopping', amount: 8500, percentage: 27.2, color: '#F59E0B' },
    { category: 'Food', amount: 6200, percentage: 19.8, color: '#10B981' },
    { category: 'Transport', amount: 4000, percentage: 12.8, color: '#3B82F6' },
    { category: 'Bills', amount: 2800, percentage: 9.0, color: '#6366F1' },
    { category: 'Subscriptions', amount: 1850, percentage: 5.9, color: '#8B5CF6' },
    { category: 'Entertainment', amount: 2400, percentage: 7.7, color: '#EC4899' },
    { category: 'Healthcare', amount: 1500, percentage: 4.8, color: '#14B8A6' },
    { category: 'Education', amount: 2000, percentage: 6.4, color: '#0EA5E9' },
    { category: 'Other', amount: 2000, percentage: 6.4, color: '#94A3B8' },
  ],
  monthly_trends: [
    { month: 'July', income: 44000, expenses: 26500, savings: 17500 },
    { month: 'August', income: 44640, expenses: 28900, savings: 15740 },
    { month: 'September', income: 50000, expenses: 31250, savings: 18750 },
  ],
  recent_insights: INITIAL_INSIGHTS.slice(0, 4),
  monthly_summary: {
    income: 50000,
    expenses: 31250,
    savings: 18750,
    top_category: 'Shopping',
    top_category_amount: 8500,
    largest_increase: 'Shopping (+42%)',
    largest_increase_pct: 42,
    recurring_commitments: 13568,
  },
  financial_health: {
    discipline_score: 82,
    budget_utilization: 72,
    recurring_commitments: 13568,
    savings_rate: 37,
    goal_progress: 41,
    spending_trend: 8,
    status_label: 'Good',
  },
};

export const MOCK_MONTHLY_REPORT: MonthlyReport = {
  month: 'September 2026',
  total_income: 50000,
  total_expenses: 31250,
  net_savings: 18750,
  savings_rate: 37,
  top_category: 'Shopping (₹8,500)',
  largest_increase_category: 'Shopping (+42% MoM)',
  recurring_total: 13568,
  category_breakdown: MOCK_DASHBOARD_DATA.category_spending,
  recurring_items: INITIAL_RECURRING,
  budget_performance: [
    { category: 'Food', limit: 5000, spent: 4200, utilization_pct: 84, status: 'Within' },
    { category: 'Shopping', limit: 7000, spent: 8500, utilization_pct: 121, status: 'Over Budget' },
    { category: 'Transport', limit: 5000, spent: 4000, utilization_pct: 80, status: 'Within' },
    { category: 'Bills', limit: 5000, spent: 2800, utilization_pct: 56, status: 'Within' },
    { category: 'Entertainment', limit: 3000, spent: 2400, utilization_pct: 80, status: 'Within' },
  ],
  goal_progress: [
    { name: 'Emergency Fund', target: 100000, current: 40000, percentage: 40, monthly_contribution: 10000, estimated_months_remaining: 6 },
    { name: 'New Laptop', target: 60000, current: 25000, percentage: 42, monthly_contribution: 5000, estimated_months_remaining: 7 },
    { name: 'Annual Vacation', target: 50000, current: 18000, percentage: 36, monthly_contribution: 4000, estimated_months_remaining: 8 },
  ],
  key_insights: INITIAL_INSIGHTS,
  action_items: [
    {
      id: 'act-1',
      title: 'Cap discretionary shopping for the remaining 5 days',
      impact: 'High',
      description: 'Shopping is currently ₹1,500 over the ₹7,000 threshold. Freezing non-essential orders protects your monthly surplus.',
    },
    {
      id: 'act-2',
      title: 'Review food delivery frequency',
      impact: 'Medium',
      description: '16 delivery orders generated ₹4,200 in spend. Shifting 3 orders to home cooking could save approx ₹1,200/month.',
    },
    {
      id: 'act-3',
      title: 'Transfer ₹10,000 planned Emergency Fund allocation',
      impact: 'High',
      description: 'Your cash balance of ₹18,750 comfortably supports your ₹10,000 goal allocation while leaving ₹8,750 buffer.',
    },
  ],
};
