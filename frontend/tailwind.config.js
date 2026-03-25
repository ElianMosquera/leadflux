/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        void: '#080B0F',
        surface: '#0D1117',
        panel: '#111820',
        border: '#1E2A38',
        muted: '#2A3A4A',
        subtle: '#4A6070',
        text: '#C8D8E8',
        bright: '#E8F4FF',
        accent: '#00D4FF',
        'accent-dim': '#0099BB',
        success: '#00E5A0',
        warning: '#FFB830',
        danger: '#FF4560',
        'danger-dim': '#CC2040'
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-dot': 'pulseDot 2s ease infinite'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' }
        }
      }
    }
  },
  plugins: []
}
