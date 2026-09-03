/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#003B20',
          800: '#004D2A',
          700: '#006B38',
          600: '#15803D',
          500: '#16A34A',
          400: '#22C55E',
          300: '#4ADE80',
          200: '#86EFAC',
          100: '#DCFCE7',
          50: '#F1F8F3',
          25: '#F4FBF5',
        },
        neutral: {
          900: '#111827',
          600: '#667085',
          400: '#98A2B3',
          200: '#E4E7EC',
          100: '#F7F9F8',
          50: '#FFFFFF',
        },
        blue: {
          500: '#1683E8',
          50: '#EFF6FF',
          100: '#DBEAFE',
        },
        purple: {
          500: '#7C3AED',
          50: '#FAF5FF',
          100: '#EDE9FE',
        },
        orange: {
          500: '#F59E0B',
        },
        red: {
          500: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
        },
        success: {
          50: '#EAF7ED',
          600: '#15803D',
        },
        warning: {
          50: '#FFF7ED',
          600: '#F59E0B',
        },
        danger: {
          50: '#FEF2F2',
          600: '#EF4444',
        },
        info: {
          50: '#EFF6FF',
          600: '#1683E8',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #003B20 0%, #006B38 55%, #16A34A 100%)',
        'gradient-soft-green': 'linear-gradient(135deg, #F4FBF5 0%, #E4F6E8 100%)',
        'gradient-green-glow': 'radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0) 70%)',
        'gradient-blue': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'gradient-purple': 'linear-gradient(135deg, #FAF5FF 0%, #EDE9FE 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #003B20 0%, #004D2A 45%, #002D19 100%)',
        'gradient-active-nav': 'linear-gradient(90deg, #08783A, #0F9348)',
        'gradient-primary-btn': 'linear-gradient(135deg, #08783A, #16A34A)',
        'gradient-progress': 'linear-gradient(90deg, #16A34A, #4ADE80)',
        'gradient-skeleton': 'linear-gradient(90deg, #F1F3F2 25%, #E7ECE9 50%, #F1F3F2 75%)',
        'gradient-page': 'radial-gradient(circle at 80% 10%, rgba(22,163,74,0.035), transparent 30%)',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(16,24,40,0.04)',
        'card-hover': '0 8px 24px rgba(16,24,40,0.08)',
        'card-active': '0 4px 16px rgba(16,24,40,0.06)',
        'glow-green': '0 0 20px rgba(22,163,74,0.25)',
        'glow-green-sm': '0 0 8px rgba(22,163,74,0.15)',
        'drawer': '0 -4px 24px rgba(16,24,40,0.12)',
        'modal': '0 24px 48px rgba(16,24,40,0.16)',
      },
      borderRadius: {
        'card': '14px',
        'card-sm': '10px',
        'button': '10px',
        'input': '8px',
        'badge': '9999px',
        'avatar': '9999px',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '300ms',
        'slower': '400ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}