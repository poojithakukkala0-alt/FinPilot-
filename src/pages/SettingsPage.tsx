import React, { useState } from 'react';
import {
  User as UserIcon,
  Bell,
  DollarSign,
  Shield,
  Key,
  LogOut,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';

export const SettingsPage: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { currencyCode, setCurrency, addToast } = useFinance();

  const [name, setName] = useState(user?.name || 'Poojitha');
  const [email, setEmail] = useState(user?.email || 'poojitha@finpilot.com');
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateUserProfile) {
      updateUserProfile({ name, email });
    }
    addToast('Profile Updated', 'Your personal account profile has been saved.', 'success');
  };

  const handleCurrencyChange = (c: string) => {
    setCurrency(c);
    addToast('Currency Updated', `Default display currency set to ${c}.`, 'info');
  };

  return (
    <div className="w-full space-y-6 pb-12 select-none">
      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Settings & Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your account identity, regional currency, and notification preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personal Profile
            </h3>
            <p className="text-xs text-slate-500">
              Update your display name and login email address
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              {(name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                {name}
              </span>
              <span className="text-xs text-indigo-600 font-medium">
                Premium Plan Account
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Preferences: Currency & Regional */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Currency & Regional Formatting
            </h3>
            <p className="text-xs text-slate-500">
              Customize monetary symbols across dashboards, charts, and reports
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Default Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
              { code: 'USD', symbol: '$', name: 'US Dollar' },
              { code: 'EUR', symbol: '€', name: 'Euro' },
              { code: 'GBP', symbol: '£', name: 'British Pound' },
            ].map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCurrencyChange(c.code)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  currencyCode === c.code
                    ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-lg font-black">
                  {c.symbol} <span className="text-xs font-normal text-slate-500">({c.code})</span>
                </div>
                <div className="text-xs font-semibold mt-0.5">{c.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Smart Notification Rules
            </h3>
            <p className="text-xs text-slate-500">
              Configure real-time automated pacing and threshold triggers
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-slate-100">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Budget Ceiling Alerts
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Notify when category spending reaches 85% or exceeds 100% of limit.
              </p>
            </div>
            <input
              type="checkbox"
              checked={budgetAlerts}
              onChange={(e) => setBudgetAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Subscription & Renewal Reminders
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Alert 48 hours before recurring bills auto-debit.
              </p>
            </div>
            <input
              type="checkbox"
              checked={subscriptionAlerts}
              onChange={(e) => setSubscriptionAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Weekly Spending Digest
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive Sunday summary of weekly discretionary cashflows.
              </p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Security & Authentication */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Security & Privacy
            </h3>
            <p className="text-xs text-slate-500">
              Bank-grade 256-bit encryption and authentication state
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                Active Session Token
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Encrypted JWT • Verified Session
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active & Secure
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="font-bold text-slate-800 block">
                Two-Factor Authentication (2FA)
              </span>
              <span className="text-slate-400">
                Additional security for funds transfers and simulations
              </span>
            </div>
            <button
              type="button"
              onClick={() => addToast('2FA Security', '2FA is active on your account.', 'info')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Sign Out of FinPilot
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
            Safely disconnect your active session on this device. Your ledger, budgets, and goals remain synced.
          </p>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors shadow-sm self-start sm:self-auto shrink-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Session</span>
        </button>
      </div>
    </div>
  );
};
