/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Keep these aliases so existing code still compiles
        primary: {
          blue:   '#2563EB',
          indigo: '#1D4ED8',
          violet: '#2563EB', // map violet -> blue
        },
        surface: {
          bg:            '#FFFFFF',
          secondary:     '#F8FAFF',
          tertiary:      '#EFF6FF',
          dark:          '#FFFFFF',       // override dark -> white
          darkSecondary: '#F8FAFF',
        },
        border: {
          default: '#E0EAFF',
          blue:    '#BFDBFE',
          dark:    '#E0EAFF',
        },
        text: {
          primary:       '#0F172A',
          secondary:     '#475569',
          muted:         '#94A3B8',
          darkPrimary:   '#0F172A',   // override dark variants -> light
          darkSecondary: '#475569',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft':    '0 2px 12px -2px rgba(37, 99, 235, 0.10)',
        'card':    '0 4px 20px -4px rgba(37, 99, 235, 0.12)',
        'premium': '0 10px 40px -8px rgba(37, 99, 235, 0.20)',
        'glow':    '0 0 24px rgba(37, 99, 235, 0.28)',
        'blue':    '0 4px 14px rgba(37, 99, 235, 0.25)',
        'glass':   '0 4px 20px rgba(37, 99, 235, 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        fadeIn:    'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float:     'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
