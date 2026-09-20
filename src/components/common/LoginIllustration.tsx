import React from 'react';

export const LoginIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-md h-60 sm:h-72 lg:h-80 flex items-center justify-center select-none">
      {/* Luminous Glow Auras */}
      <div className="absolute top-1/3 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 w-72 h-36 bg-purple-600/25 rounded-full blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 360 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          {/* Gold Coin Gradient */}
          <linearGradient id="gold-front" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
          <linearGradient id="gold-edge" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>

          {/* Plant Leaves Gradients */}
          <linearGradient id="leaf-green" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <linearGradient id="leaf-light" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>

          {/* Pedestal Surface Gradient */}
          <linearGradient id="pedestal-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2E2856" />
            <stop offset="100%" stopColor="#171333" />
          </linearGradient>
          <linearGradient id="pedestal-rim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Ambient Pedestal Base */}
        <ellipse cx="180" cy="245" rx="130" ry="32" fill="#0A091A" opacity="0.8" />
        
        {/* Pedestal Cylinder Body */}
        <path
          d="M60 220 C60 240 300 240 300 220 L300 236 C300 256 60 256 60 236 Z"
          fill="#1E1B4B"
        />

        {/* Glowing Rim of Pedestal */}
        <ellipse cx="180" cy="220" rx="120" ry="24" fill="none" stroke="url(#pedestal-rim)" strokeWidth="3" opacity="0.9" />
        <ellipse cx="180" cy="220" rx="118" ry="23" fill="url(#pedestal-top)" />

        {/* Stack of Gold Coins (Right side of pedestal) */}
        {/* Coin 1 (Bottom) */}
        <g transform="translate(205, 195)">
          <path d="M0 6 C0 14 50 14 50 6 L50 14 C50 22 0 22 0 14 Z" fill="url(#gold-edge)" />
          <ellipse cx="25" cy="6" rx="25" ry="9" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
          <text x="25" y="9" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F" opacity="0.6">₹</text>
        </g>
        {/* Coin 2 */}
        <g transform="translate(205, 184)">
          <path d="M0 6 C0 14 50 14 50 6 L50 14 C50 22 0 22 0 14 Z" fill="url(#gold-edge)" />
          <ellipse cx="25" cy="6" rx="25" ry="9" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
          <text x="25" y="9" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F" opacity="0.6">₹</text>
        </g>
        {/* Coin 3 */}
        <g transform="translate(205, 173)">
          <path d="M0 6 C0 14 50 14 50 6 L50 14 C50 22 0 22 0 14 Z" fill="url(#gold-edge)" />
          <ellipse cx="25" cy="6" rx="25" ry="9" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
          <text x="25" y="9" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F" opacity="0.6">₹</text>
        </g>
        {/* Coin 4 */}
        <g transform="translate(205, 162)">
          <path d="M0 6 C0 14 50 14 50 6 L50 14 C50 22 0 22 0 14 Z" fill="url(#gold-edge)" />
          <ellipse cx="25" cy="6" rx="25" ry="9" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
          <text x="25" y="9" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350F" opacity="0.6">₹</text>
        </g>
        {/* Coin 5 (Top) */}
        <g transform="translate(205, 151)">
          <path d="M0 6 C0 14 50 14 50 6 L50 14 C50 22 0 22 0 14 Z" fill="url(#gold-edge)" />
          <ellipse cx="25" cy="6" rx="25" ry="9" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1.5" />
          <text x="25" y="10" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350F" opacity="0.8">₹</text>
        </g>

        {/* Smaller Coin Stack beside it */}
        <g transform="translate(182, 192)">
          <path d="M0 5 C0 12 36 12 36 5 L36 11 C36 18 0 18 0 11 Z" fill="url(#gold-edge)" />
          <ellipse cx="18" cy="5" rx="18" ry="7" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
        </g>
        <g transform="translate(182, 183)">
          <path d="M0 5 C0 12 36 12 36 5 L36 11 C36 18 0 18 0 11 Z" fill="url(#gold-edge)" />
          <ellipse cx="18" cy="5" rx="18" ry="7" fill="url(#gold-front)" stroke="#FEF08A" strokeWidth="1" />
        </g>

        {/* Flourishing Plant Stem & Rich Green Leaves (Left side) */}
        {/* Plant Stem */}
        <path
          d="M145 220 Q140 180 125 140 Q118 100 135 60"
          stroke="#059669"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Leaf 1: Bottom Right */}
        <path
          d="M135 185 C165 185 180 160 185 145 C155 145 138 170 135 185 Z"
          fill="url(#leaf-green)"
          stroke="#34D399"
          strokeWidth="1"
        />

        {/* Leaf 2: Middle Left */}
        <path
          d="M130 160 C90 155 80 130 82 110 C110 115 125 140 130 160 Z"
          fill="url(#leaf-green)"
          stroke="#34D399"
          strokeWidth="1"
        />

        {/* Leaf 3: Upper Right */}
        <path
          d="M126 125 C155 115 168 85 165 65 C138 75 128 105 126 125 Z"
          fill="url(#leaf-light)"
          stroke="#6EE7B7"
          strokeWidth="1"
        />

        {/* Leaf 4: Sprouting Top Leaf */}
        <path
          d="M132 75 C125 40 135 25 145 20 C155 40 142 65 132 75 Z"
          fill="url(#leaf-light)"
          stroke="#A7F3D0"
          strokeWidth="1"
        />

        {/* Floating Sparkles & Light Orbs */}
        <circle cx="120" cy="40" r="3" fill="#6EE7B7" opacity="0.8" />
        <circle cx="170" cy="120" r="2.5" fill="#FDE047" opacity="0.9" />
        <circle cx="270" cy="140" r="3.5" fill="#38BDF8" opacity="0.7" />
        <circle cx="85" cy="90" r="2" fill="#A78BFA" opacity="0.8" />
      </svg>
    </div>
  );
};
