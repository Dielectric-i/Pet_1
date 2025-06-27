import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// В dev-режиме Vite сам проксирует /api → localhost:5000.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    // define: {
    //   // пробрасываем базовый URL API в рантайм (для fetch'ей и т.д.)
    //   __API__: JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:5000')
    // },
    server: {
      port: 5173,
      proxy: {
        '/auth': 'http://localhost:5000',
        '/check': 'http://localhost:5000',
      }
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true
    }
  };
});
