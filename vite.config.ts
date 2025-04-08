import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/client')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:10888',
        changeOrigin: true
      }
    }
  },
}); 