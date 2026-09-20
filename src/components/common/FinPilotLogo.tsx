import React from 'react';

interface FinPilotLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export const FinPilotLogo: React.FC<FinPilotLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  lightMode = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Reference Image Stylized Purple/Indigo 3-Petal Leaf Icon */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} shrink-0`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform hover:scale-105 transition-transform drop-shadow-sm"
        >
          <defs>
            <linearGradient id="petal-left" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
            <linearGradient id="petal-center" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
            <linearGradient id="petal-right" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Left Petal / Leaf */}
          <path
            d="M20 28 C12 28 8 20 12 12 C16 16 20 22 20 28 Z"
            fill="url(#petal-left)"
            opacity="0.9"
          />
          {/* Right Petal / Leaf */}
          <path
            d="M20 28 C28 28 32 20 28 12 C24 16 20 22 20 28 Z"
            fill="url(#petal-right)"
            opacity="0.85"
          />
          {/* Center Elevated Petal / Leaf */}
          <path
            d="M20 28 C17 19 14 10 20 4 C26 10 23 19 20 28 Z"
            fill="url(#petal-center)"
          />
          {/* Subtle Core Dot */}
          <circle cx="20" cy="27" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-tight ${textSizes[size]} ${lightMode ? 'text-slate-900' : 'text-white'}`}>
          FinPilot
        </span>
        {showSubtitle && (
          <span className={`text-[11px] font-medium tracking-tight -mt-0.5 ${lightMode ? 'text-slate-500' : 'text-indigo-200/80'}`}>
            Your Financial Companion
          </span>
        )}
      </div>
    </div>
  );
};

