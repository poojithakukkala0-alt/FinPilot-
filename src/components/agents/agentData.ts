export interface AgentInfo {
  id: string;
  name: string;
  shortName: string;
  role: string;
  responsibility: string;
  accentColor: string;
  glowColor: string;
  toolName: string;
  status: 'Active' | 'Watching' | 'Ready' | 'Analyzing';
  lastAction: string;
  nextAction: string;
}

export const FINPILOT_AGENTS: Record<string, AgentInfo> = {
  spending_analyst: {
    id: 'spending_analyst',
    name: 'Spending Analyst',
    shortName: 'Spending',
    role: 'Historical & Outflow Intelligence',
    responsibility: 'Analyzes where your money went and categorizes every rupee',
    accentColor: '#32D583', // Emerald Green
    glowColor: 'rgba(50, 213, 131, 0.25)',
    toolName: 'analyze_spending',
    status: 'Ready',
    lastAction: 'Parsed 328 September transactions',
    nextAction: 'Compare September category outflows',
  },
  budget_guardian: {
    id: 'budget_guardian',
    name: 'Budget Guardian',
    shortName: 'Budget',
    role: 'Ceiling & Headroom Sentinel',
    responsibility: 'Monitors category limits and alerts on utilization thresholds',
    accentColor: '#FBBF24', // Amber
    glowColor: 'rgba(251, 191, 36, 0.25)',
    toolName: 'check_budget_headroom',
    status: 'Watching',
    lastAction: 'Checked Shopping budget (₹7,318 / ₹7,000)',
    nextAction: 'Flag ₹318 overage in Shopping',
  },
  goal_planner: {
    id: 'goal_planner',
    name: 'Goal Planner',
    shortName: 'Goals',
    role: 'Milestone & Savings Strategist',
    responsibility: 'Evaluates progress toward emergency funds and long-term targets',
    accentColor: '#818CF8', // Indigo
    glowColor: 'rgba(129, 140, 248, 0.25)',
    toolName: 'get_goal_impact',
    status: 'Ready',
    lastAction: 'Calculated Emergency Fund buffer (₹40,000 / ₹100,000)',
    nextAction: 'Assess contribution capacity for October',
  },
  recurring_monitor: {
    id: 'recurring_monitor',
    name: 'Recurring Monitor',
    shortName: 'Recurring',
    role: 'Subscription & Commitment Tracker',
    responsibility: 'Tracks upcoming bills, subscriptions, and scheduled cash drains',
    accentColor: '#5EEAD4', // Cyber Teal
    glowColor: 'rgba(94, 234, 212, 0.25)',
    toolName: 'get_recurring_commitments',
    status: 'Watching',
    lastAction: 'Verified 4 active commitments totaling ₹13,449/mo',
    nextAction: 'Track upcoming Landlord Rent transfer',
  },
  anomaly_detective: {
    id: 'anomaly_detective',
    name: 'Anomaly Detective',
    shortName: 'Anomaly',
    role: 'Statistical Outlier Scanner',
    responsibility: 'Detects unusual spikes and transactions exceeding category baselines',
    accentColor: '#F97066', // Coral Red
    glowColor: 'rgba(249, 112, 102, 0.25)',
    toolName: 'detect_anomalies',
    status: 'Ready',
    lastAction: 'Identified 2 spending spikes in Shopping & Rent',
    nextAction: 'Scan incoming transactions for variance',
  },
  trend_analyst: {
    id: 'trend_analyst',
    name: 'Trend Analyst',
    shortName: 'Trends',
    role: 'Cross-Month Variance Engine',
    responsibility: 'Compares month-over-month trajectories in income and spending',
    accentColor: '#60A5FA', // Sky Blue
    glowColor: 'rgba(96, 165, 250, 0.25)',
    toolName: 'compare_monthly_trends',
    status: 'Ready',
    lastAction: 'Calculated August vs September (+13.2% spending)',
    nextAction: 'Project October runway & burn rate',
  },
  decision_simulator: {
    id: 'decision_simulator',
    name: 'Decision Simulator',
    shortName: 'Simulator',
    role: 'Hypothetical Purchase Arbiter',
    responsibility: 'Simulates purchase impact on cash buffer, commitments, and goals',
    accentColor: '#C084FC', // Purple
    glowColor: 'rgba(192, 132, 252, 0.25)',
    toolName: 'simulate_purchase_impact',
    status: 'Ready',
    lastAction: 'Tested hypothetical ₹5,000 purchase impact',
    nextAction: 'Ready to evaluate new purchase requests',
  },
};

export const AGENT_LIST: AgentInfo[] = Object.values(FINPILOT_AGENTS);

export const FINPILOT_CENTRAL = {
  name: 'FinPilot AI Core',
  role: 'Master Orchestrator',
  responsibility: 'Synthesizes insights across all 7 agents using Gemini 3.6 Flash and live MongoDB groundings',
  accentColor: '#5EEAD4',
  glowColor: 'rgba(94, 234, 212, 0.4)',
};
