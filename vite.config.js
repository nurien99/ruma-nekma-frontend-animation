import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'ruma-nekma-frontend.test',
    strictPort: true,
    hmr: {
      host: 'ruma-nekma-frontend.test',
      protocol: 'ws',
      port: 3000,
    },
    proxy: {
      '/api': {
        target: 'http://public.test',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
