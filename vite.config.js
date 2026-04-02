import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // Split vendor chunks for better long-term caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React core in its own chunk — changes rarely
          'vendor-react': ['react', 'react-dom'],
          // Router in its own chunk
          'vendor-router': ['react-router-dom'],
          // Axios in its own chunk
          'vendor-axios': ['axios'],
        },
      },
    },
    // Smaller chunk size warnings threshold
    chunkSizeWarningLimit: 500,
  },
});
