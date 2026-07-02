/** @type {import('tailwindcss').Config} */
// Separate, narrowly-scoped Tailwind build used ONLY to generate the CSS
// bundled into api/render-pdf.js's PDF output. Scoping content to just the
// template files (instead of the whole src/**) keeps this compiled CSS file
// small, since it doesn't need any of the app's dashboard/marketing classes.
export default {
  content: ['./src/components/resume/templates/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        surface: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1' },
        ink: {
          50: '#f8fafc', 100: '#e2e8f0', 300: '#94a3b8', 500: '#64748b',
          700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
        brand: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: { preflight: true },
};
