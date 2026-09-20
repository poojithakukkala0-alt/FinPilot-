import React from 'react';

export type AgentId =
  | 'central'
  | 'spending_analyst'
  | 'budget_guardian'
  | 'goal_planner'
  | 'recurring_monitor'
  | 'anomaly_detective'
  | 'trend_analyst'
  | 'decision_simulator';

interface AgentAvatarProps {
  agentId: AgentId | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'Active' | 'Watching' | 'Ready' | 'Analyzing';
  className?: string;
  glow?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  agentId,
  size = 'md',
  showStatus = false,
  status = 'Ready',
  className = '',
  glow = true,
}) => {
  // Normalize agent ID
  const normalizedId = (agentId || '').toLowerCase().replace(/[\s-]/g, '_');

  const sizeDimensions = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const statusColors = {
    Active: 'bg-emerald-400 border-emerald-900',
    Watching: 'bg-amber-400 border-amber-900',
    Ready: 'bg-teal-400 border-teal-900',
    Analyzing: 'bg-purple-400 border-purple-900 animate-ping',
  };

  // Render dedicated SVG artwork for each agent persona
  const renderAgentArt = () => {
    switch (normalizedId) {
      case 'central':
      case 'finpilot_ai':
      case 'finpilot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="central_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
              <radialGradient id="central_glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#5EEAD4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#0B132B" stroke="#2DD4BF" strokeWidth="2" />
            <circle cx="50" cy="50" r="38" fill="url(#central_glow)" opacity="0.4" />
            <circle cx="50" cy="50" r="28" stroke="#5EEAD4" strokeWidth="1.5" strokeDasharray="4 3" className="animate-spin-slow" />
            {/* Core Nexus */}
            <polygon points="50,22 68,36 68,64 50,78 32,64 32,36" fill="url(#central_grad)" opacity="0.9" />
            <circle cx="50" cy="50" r="8" fill="#F8FAFC" />
            <path d="M50 32 L50 42 M50 58 L50 68 M35 50 L42 50 M58 50 L65 50" stroke="#060B18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'spending_analyst':
      case 'spending':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="spend_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#32D583" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#071E16" stroke="#32D583" strokeWidth="2" />
            {/* Histogram bars with connecting telemetry line */}
            <rect x="25" y="52" width="10" height="26" rx="2" fill="url(#spend_grad)" opacity="0.7" />
            <rect x="40" y="38" width="10" height="40" rx="2" fill="url(#spend_grad)" opacity="0.85" />
            <rect x="55" y="44" width="10" height="34" rx="2" fill="url(#spend_grad)" opacity="0.75" />
            <rect x="70" y="26" width="10" height="52" rx="2" fill="url(#spend_grad)" />
            {/* Connecting trend stroke */}
            <path d="M30 48 L45 34 L60 40 L75 22" stroke="#F8FAFC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="75" cy="22" r="3.5" fill="#32D583" stroke="#F8FAFC" strokeWidth="1.5" />
          </svg>
        );

      case 'budget_guardian':
      case 'budget':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="guard_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#1C1405" stroke="#FBBF24" strokeWidth="2" />
            {/* Hexagonal Shield */}
            <path d="M50 20 L76 32 V52 C76 68 50 82 50 82 C50 82 24 68 24 52 V32 L50 20 Z" fill="url(#guard_grad)" opacity="0.85" />
            {/* Inner Lock / Shield Eye */}
            <path d="M42 46 V42 C42 37.6 45.6 34 50 34 C54.4 34 58 37.6 58 42 V46" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <rect x="38" y="46" width="24" height="18" rx="4" fill="#0F172A" />
            <circle cx="50" cy="54" r="2.5" fill="#FBBF24" />
          </svg>
        );

      case 'goal_planner':
      case 'goal':
      case 'goals':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="goal_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#13132B" stroke="#818CF8" strokeWidth="2" />
            {/* Concentric Target */}
            <circle cx="50" cy="50" r="34" stroke="#818CF8" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="50" cy="50" r="22" stroke="#A5B4FC" strokeWidth="2" />
            <circle cx="50" cy="50" r="10" fill="url(#goal_grad)" />
            <circle cx="50" cy="50" r="3.5" fill="#F8FAFC" />
            {/* Crosshairs */}
            <path d="M50 14 L50 26 M50 74 L50 86 M14 50 L26 50 M74 50 L86 50" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        );

      case 'recurring_monitor':
      case 'recurring':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="rec_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5EEAD4" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#07191C" stroke="#5EEAD4" strokeWidth="2" />
            {/* Dual Orbital Cycles */}
            <ellipse cx="50" cy="50" rx="34" ry="18" transform="rotate(-30 50 50)" stroke="#5EEAD4" strokeWidth="2" strokeDasharray="7 3" />
            <ellipse cx="50" cy="50" rx="34" ry="18" transform="rotate(30 50 50)" stroke="#2DD4BF" strokeWidth="2" strokeDasharray="7 3" />
            {/* Central Clockwork Core */}
            <circle cx="50" cy="50" r="14" fill="url(#rec_grad)" />
            <path d="M50 42 V50 L56 53" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            {/* Orbiting Satellite Dots */}
            <circle cx="78" cy="34" r="4" fill="#5EEAD4" />
            <circle cx="22" cy="66" r="4" fill="#2DD4BF" />
          </svg>
        );

      case 'anomaly_detective':
      case 'anomaly':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="anom_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97066" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#240E0E" stroke="#F97066" strokeWidth="2" />
            {/* Radar Rings */}
            <circle cx="50" cy="50" r="36" stroke="#F97066" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="50" cy="50" r="22" stroke="#F97066" strokeWidth="1.5" opacity="0.8" />
            {/* Radar Sweep Wedge */}
            <path d="M50 50 L75 25 A 36 36 0 0 1 85 45 Z" fill="url(#anom_grad)" opacity="0.35" />
            <line x1="50" y1="50" x2="75" y2="25" stroke="#F97066" strokeWidth="2" />
            {/* Anomaly Ping (Alert indicator) */}
            <circle cx="70" cy="36" r="5" fill="#F8FAFC" className="animate-ping" />
            <circle cx="70" cy="36" r="4" fill="#F97066" />
            <circle cx="50" cy="50" r="4" fill="#F8FAFC" />
          </svg>
        );

      case 'trend_analyst':
      case 'trend':
      case 'trends':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="trend_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#0B1A2C" stroke="#60A5FA" strokeWidth="2" />
            {/* Telemetry wave grid */}
            <path d="M18 64 Q32 30 48 50 T82 28" stroke="url(#trend_grad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M18 72 Q32 50 48 64 T82 48" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
            {/* Peak Nodes */}
            <circle cx="48" cy="50" r="4" fill="#F8FAFC" />
            <circle cx="82" cy="28" r="5" fill="#60A5FA" stroke="#F8FAFC" strokeWidth="2" />
          </svg>
        );

      case 'decision_simulator':
      case 'simulator':
      case 'decision':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="dec_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#7E22CE" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="#1C0E28" stroke="#C084FC" strokeWidth="2" />
            {/* Bifurcated Decision Node Tree */}
            <path d="M50 78 V52 M50 52 L30 32 M50 52 L70 32" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Spark Nodes */}
            <circle cx="50" cy="78" r="4.5" fill="#F8FAFC" />
            <circle cx="30" cy="32" r="6" fill="#A855F7" stroke="#F8FAFC" strokeWidth="2" />
            <circle cx="70" cy="32" r="6" fill="url(#dec_grad)" stroke="#F8FAFC" strokeWidth="2" />
            {/* Neural Spark / Decision diamond */}
            <polygon points="50,44 56,52 50,60 44,52" fill="#F8FAFC" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeDimensions[size]} ${className}`}>
      <div className={`w-full h-full rounded-full overflow-hidden transition-transform duration-200 hover:scale-105 ${glow ? 'shadow-lg' : ''}`}>
        {renderAgentArt()}
      </div>

      {showStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${statusColors[status] || statusColors.Ready}`}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
