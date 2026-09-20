/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finpilot: {
          primary: '#6366F1', // Indigo
          primaryHover: '#4F46E5',
          secondary: '#8B5CF6', // Purple
          secondaryLight: '#EDE9FE',
          accent: '#A855F7',
          navy: {
            DEFAULT: '#0A1128',
            dark: '#070C1D',
            light: '#141D38',
            surface: '#1E294B',
          },
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderSubtle: '#F1F5F9',
          text: '#0F172A',
          muted: '#64748B',
          light: '#94A3B8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#0EA5E9',
        },
        cockpit: {
          bg: '#F8FAFC',
          panel: '#FFFFFF',
          elevated: '#FFFFFF',
          surface: '#F1F5F9',
          surfaceHover: '#E2E8F0',
          border: '#E2E8F0',
          borderSubtle: '#F1F5F9',
          primary: '#10B981',
          primaryDark: '#059669',
          secondary: '#6366F1',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#0F172A',
          muted: '#64748B',
          dimmed: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'card': '16px',
        'subtle': '12px',
        'badge': '8px',
      },
      boxShadow: {
        'finpilot-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'finpilot-hover': '0 10px 25px -5px rgba(99, 102, 241, 0.1), 0 8px 10px -6px rgba(99, 102, 241, 0.05)',
        'finpilot-glow': '0 0 25px -4px rgba(99, 102, 241, 0.35)',
        'cockpit-card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'cockpit-glow': '0 0 20px -4px rgba(99, 102, 241, 0.25)',
        'cockpit-glow-teal': '0 0 20px -4px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}

