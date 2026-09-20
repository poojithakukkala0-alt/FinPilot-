import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { Insight } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface RecentInsightsProps {
  insights: Insight[];
}

export const RecentInsights: React.FC<RecentInsightsProps> = ({ insights }) => {
  const { setActiveNav } = useFinance();

  const getIcon = (severity: Insight['severity']) => {
    switch (severity) {
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (severity: Insight['severity']) => {
    switch (severity) {
      case 'danger':
        return 'border-rose-200 bg-rose-50/30';
      case 'warning':
        return 'border-amber-200 bg-amber-50/30';
      case 'success':
        return 'border-emerald-200 bg-emerald-50/30';
      default:
        return 'border-blue-200 bg-blue-50/30';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-fintech-card flex flex-col justify-between">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-fintech-navy-900">
            Recent Insights
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            AI-detected anomalies and critical reminders
          </p>
        </div>
        <button
          onClick={() => setActiveNav('reports')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors group"
        >
          <span>All insights</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl border ${getBorderColor(
              insight.severity
            )} transition-all duration-200 hover:shadow-sm flex flex-col justify-between`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">{getIcon(insight.severity)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {insight.title}
                  </h4>
                  {insight.metric && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700 shrink-0">
                      {insight.metric}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
