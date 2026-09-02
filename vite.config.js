import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    // F1 FIX: target ES2019 so react-snap's Chromium can execute the built JS.
    // Optional chaining (?.) and nullish coalescing (??) are compiled away,
    // preventing the "Unexpected token '?'" pageerror during pre-rendering.
    target: 'es2019',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand'],
          'vendor-http':  ['axios'],
        },
      },
    },
  },
});