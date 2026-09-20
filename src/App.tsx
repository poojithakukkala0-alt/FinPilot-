import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { LoginPage } from './pages/LoginPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { UploadPage } from './pages/UploadPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { DecisionSimulatorPage } from './pages/DecisionSimulatorPage';

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeNav } = useFinance();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cockpit-bg flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-cockpit-panel flex items-center justify-center shadow-2xl border border-cockpit-border animate-pulse">
          <div className="w-6 h-6 rounded-full border-2 border-cockpit-secondary border-t-transparent animate-spin" />
        </div>
        <span className="text-xs font-black text-slate-400 mt-4 tracking-widest uppercase font-mono">
          Initializing FinPilot Cockpit...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
      case 'overview':
        return (
          <AppLayout
            pageTitle="Financial Overview"
            pageSubtitle="Live executive cockpit grounded in your verified MongoDB Atlas ledger."
          >
            <DashboardPage />
          </AppLayout>
        );
      case 'transactions':
        return (
          <AppLayout
            pageTitle="Transactions Ledger"
            pageSubtitle="Browse, filter, and inspect verified credit and debit records."
          >
            <TransactionsPage />
          </AppLayout>
        );
      case 'upload':
        return (
          <AppLayout
            pageTitle="Upload Financial Data"
            pageSubtitle="Upload statements, bills, and expense records and let FinPilot analyze them."
          >
            <UploadPage />
          </AppLayout>
        );
      case 'budgets':
        return (
          <AppLayout
            pageTitle="Budget Ceilings"
            pageSubtitle="Monitor category spending pacing and prevent over-budget runaway."
          >
            <BudgetsPage />
          </AppLayout>
        );
      case 'goals':
        return (
          <AppLayout
            pageTitle="Savings & Wealth Goals"
            pageSubtitle="Track capital accumulation milestones and monthly systematic allocations."
          >
            <GoalsPage />
          </AppLayout>
        );
      case 'ai-command-center':
      case 'ai-assistant':
      case 'agent-network':
      case 'insights':
        return (
          <AppLayout
            pageTitle="AI Command Center"
            pageSubtitle="7 specialized autonomous agents collaborating on financial decision-support."
          >
            <AIAssistantPage />
          </AppLayout>
        );
      case 'decision-simulator':
        return (
          <AppLayout
            pageTitle="Decision Simulator"
            pageSubtitle="Simulate the cash flow, budget, and goal impact of any purchase before you commit."
          >
            <DecisionSimulatorPage />
          </AppLayout>
        );
      case 'reports':
        return (
          <AppLayout
            pageTitle="Executive Reports"
            pageSubtitle="Comprehensive monthly financial dossiers and AI action items."
          >
            <ReportsPage />
          </AppLayout>
        );
      case 'settings':
        return (
          <AppLayout
            pageTitle="Settings & Identity"
            pageSubtitle="Account profile, regional currency preferences, and session telemetry."
          >
            <SettingsPage />
          </AppLayout>
        );
      default:
        return (
          <AppLayout
            pageTitle="Financial Overview"
            pageSubtitle="Live executive cockpit grounded in your verified MongoDB Atlas ledger."
          >
            <DashboardPage />
          </AppLayout>
        );
    }
  };

  return <>{renderActivePage()}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <MainApp />
      </FinanceProvider>
    </AuthProvider>
  );
}
