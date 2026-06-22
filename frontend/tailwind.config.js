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
          blue: '#4F46E5', // Indigo-600 for a more modern tech feel
          indigo: '#4338CA',
          violet: '#7C3AED',
        },
        surface: {
          bg: '#FAFAFA', // Very light zinc for a slightly warmer, premium light mode
          secondary: '#F4F4F5',
          dark: '#09090B', // Zinc-950 for dark mode landing page
          darkSecondary: '#18181B',
        },
        border: {
          default: '#E4E4E7', // Zinc-200
          dark: '#27272A',
        },
        text: {
          primary: '#18181B', // Zinc-900
          secondary: '#71717A', // Zinc-500
          darkPrimary: '#FAFAFA',
          darkSecondary: '#A1A1AA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'glow': '0 0 20px rgba(79, 70, 229, 0.3)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        pulseGlow: 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
