/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#e0efff',
          200: '#baddff',
          300: '#7dc2ff',
          400: '#38a0ff',
          500: '#0d7cf2',
          600: '#005dd4',
          700: '#004bab',
          800: '#00408d',
          900: '#003574',
          950: '#001f4d',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        ink: {
          950: '#0a0f1c',
          700: '#1e293b',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
        },
        success: { 50: '#f0fdf4', 600: '#16a34a' },
        warning: { 50: '#fffbeb', 600: '#d97706' },
        danger:  { 50: '#fff1f2', 600: '#e11d48' },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card:   '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        lift:   '0 4px 24px 0 rgb(13 124 242 / 0.10)',
        'lift-lg': '0 8px 40px 0 rgb(13 124 242 / 0.15)',
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease both',
        'fade-in':   'fadeIn 0.3s ease both',
        'slide-in':  'slideIn 0.3s ease both',
        'pulse-dot': 'pulseDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:   { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn:  { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        pulseDot: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
      },
    },
  },
  plugins: [],
};
