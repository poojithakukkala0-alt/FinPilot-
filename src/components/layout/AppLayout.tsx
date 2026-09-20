import React, { useState } from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  BotMessageSquare,
  Menu,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ToastContainer } from '../common/ToastContainer';
import { DecisionSimulatorModal } from '../simulator/DecisionSimulatorModal';
import { useFinance } from '../../context/FinanceContext';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  pageTitle,
  pageSubtitle,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isSimulatorOpen, closeSimulator, activeNav, setActiveNav } = useFinance();

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'ai-command-center', label: 'Agents', icon: BotMessageSquare },
  ];

  return (
    <div className="w-full min-h-screen flex bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-600 overflow-x-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area: Consumes ALL remaining horizontal space */}
      <div className="flex-1 min-w-0 w-full flex flex-col min-h-screen">
        {/* Sticky Top Header */}
        <TopHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          title={pageTitle}
          subtitle={pageSubtitle}
        />

        {/* Dynamic Page Body: Full width without narrow max-w constraints */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 pb-24 md:pb-8 animate-in fade-in duration-150">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeNav === item.id ||
            (item.id === 'dashboard' && activeNav === 'overview') ||
            (item.id === 'ai-command-center' &&
              (activeNav === 'ai-assistant' ||
                activeNav === 'agent-network' ||
                activeNav === 'insights' ||
                activeNav === 'decision-simulator'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px] min-h-[44px] ${
                isActive
                  ? 'text-indigo-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                )}
              </div>
              <span className="text-[11px] mt-0.5">{item.label}</span>
            </button>
          );
        })}

        {/* More / Menu Button to open Drawer */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-all min-w-[56px] min-h-[44px]"
          aria-label="Open full menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Global Decision Simulator Modal */}
      <DecisionSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={closeSimulator}
      />

      {/* Dynamic Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
