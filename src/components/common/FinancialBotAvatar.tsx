import React from 'react';

interface FinancialBotAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FinancialBotAvatar: React.FC<FinancialBotAvatarProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}>
      {/* Soft Cyan/Purple Aura */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-sky-400/25 to-purple-400/20 blur-xl animate-pulse" />

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transform hover:scale-105 transition-transform duration-300"
      >
        <defs>
          {/* Head Body Gradient */}
          <radialGradient id="bot-head" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>

          {/* Visor Screen Gradient */}
          <linearGradient id="bot-visor" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="50%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#0B132B" />
          </linearGradient>

          {/* Cyan Glow Eye Gradient */}
          <linearGradient id="eye-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          {/* Ear Headphone Gradient */}
          <linearGradient id="ear-pod" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Body Gradient */}
          <linearGradient id="bot-torso" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* Floating Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Torso / Shoulders */}
        <path
          d="M50 115 C50 102 110 102 110 115 L118 142 C118 146 42 146 42 142 Z"
          fill="url(#bot-torso)"
        />
        {/* Chest Accent Badge */}
        <rect x="70" y="118" width="20" height="12" rx="6" fill="#6366F1" />
        <circle cx="80" cy="124" r="2.5" fill="#FFFFFF" />

        {/* Left Waving Arm & Hand */}
        <path
          d="M48 118 C35 110 24 95 28 85 C32 75 40 82 46 95"
          stroke="#E2E8F0"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="28" cy="85" r="7" fill="#6366F1" />

        {/* Right Rest Arm */}
        <path
          d="M112 118 C122 122 130 130 128 138"
          stroke="#E2E8F0"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* Left Ear Phone / Audio Pod */}
        <rect x="22" y="52" width="12" height="32" rx="6" fill="url(#ear-pod)" />
        <circle cx="28" cy="68" r="3.5" fill="#38BDF8" />

        {/* Right Ear Phone / Audio Pod */}
        <rect x="126" y="52" width="12" height="32" rx="6" fill="url(#ear-pod)" />
        <circle cx="132" cy="68" r="3.5" fill="#38BDF8" />

        {/* Top Antenna */}
        <path d="M80 34 L80 18" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="80" cy="15" r="5.5" fill="#6366F1" />
        <circle cx="80" cy="15" r="2.5" fill="#38BDF8" />

        {/* Main Robot Head Sphere */}
        <rect
          x="30"
          y="30"
          width="100"
          height="76"
          rx="38"
          fill="url(#bot-head)"
          stroke="#F8FAFC"
          strokeWidth="2.5"
        />

        {/* Dark High-Tech Visor Screen */}
        <rect
          x="42"
          y="42"
          width="76"
          height="52"
          rx="26"
          fill="url(#bot-visor)"
        />

        {/* Cute Expressive Glowing Cyan Eyes */}
        {/* Left Eye: Happy Arc */}
        <path
          d="M56 68 C56 60 68 60 68 68"
          stroke="url(#eye-glow)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Eye: Happy Arc */}
        <path
          d="M92 68 C92 60 104 60 104 68"
          stroke="url(#eye-glow)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Little Friendly Rosy Cheeks */}
        <circle cx="50" cy="77" r="3" fill="#F43F5E" opacity="0.6" />
        <circle cx="110" cy="77" r="3" fill="#F43F5E" opacity="0.6" />

        {/* Subtle Visor Reflection Highlight */}
        <path
          d="M54 48 Q80 44 106 48"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};
