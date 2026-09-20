import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DecisionSimulationInput } from '../types';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface FinanceContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  currencySymbol: string;
  currencyCode: string;
  setCurrency: (code: string) => void;
  formatCurrency: (amount: number) => string;
  activeNav: string;
  setActiveNav: (page: string) => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
  // Global Decision Simulator modal
  isSimulatorOpen: boolean;
  simulatorInput: DecisionSimulationInput | null;
  setSimulatorInput: (input: DecisionSimulationInput | null) => void;
  openSimulator: (initial?: Partial<DecisionSimulationInput>) => void;
  closeSimulator: () => void;
  // Shared chat prompt
  chatPrompt: string;
  setChatPrompt: (prompt: string) => void;
  // Toast notifications
  toasts: ToastItem[];
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');
  const [currencyCode, setCurrencyCode] = useState<string>('INR');
  const [currencySymbol, setCurrencySymbol] = useState<string>('₹');
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simulatorInput, setSimulatorInput] = useState<DecisionSimulationInput | null>(null);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const setCurrency = (code: string) => {
    setCurrencyCode(code);
    switch (code) {
      case 'USD':
        setCurrencySymbol('$');
        break;
      case 'EUR':
        setCurrencySymbol('€');
        break;
      case 'GBP':
        setCurrencySymbol('£');
        break;
      default:
        setCurrencySymbol('₹');
        break;
    }
  };

  const formatCurrency = (amount: number): string => {
    const formatted = Math.abs(amount).toLocaleString('en-IN');
    return `${currencySymbol}${formatted}`;
  };

  const openSimulator = (initial?: Partial<DecisionSimulationInput>) => {
    setSimulatorInput({
      amount: initial?.amount || 5000,
      category: initial?.category || 'Shopping',
      description: initial?.description || 'I want to spend ₹5,000 on shopping.',
    });
    setIsSimulatorOpen(true);
  };

  const closeSimulator = () => {
    setIsSimulatorOpen(false);
    setSimulatorInput(null);
  };

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        currencySymbol,
        currencyCode,
        setCurrency,
        formatCurrency,
        activeNav,
        setActiveNav,
        refreshTrigger,
        triggerRefresh,
        isSimulatorOpen,
        simulatorInput,
        setSimulatorInput,
        openSimulator,
        closeSimulator,
        chatPrompt,
        setChatPrompt,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
