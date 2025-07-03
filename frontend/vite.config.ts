import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// В dev-режиме Vite сам проксирует /api → localhost:5000.
export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/auth': 'http://localhost:5000',
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
