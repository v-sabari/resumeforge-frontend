/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#172554',
        },
        slate: { 950: '#020617' },
      },
      boxShadow: {
        soft: '0 1px 3px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.06)',
        md:   '0 4px 16px rgba(15,23,42,0.10)',
        lg:   '0 12px 40px rgba(15,23,42,0.12)',
        glow: '0 0 0 1px rgba(37,99,235,0.12), 0 8px 32px rgba(37,99,235,0.18)',
        'inner-white': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'mesh-light': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.07), transparent)',
      },
    },
  },
  plugins: [],
};
