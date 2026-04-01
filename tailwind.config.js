/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
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
        slate: {
          950: '#020617',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.08)',
        glow: '0 20px 60px rgba(37, 99, 235, 0.16)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(15, 23, 42, 0.08), transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(241,245,249,0.96))',
      },
    },
  },
  plugins: [],
};
