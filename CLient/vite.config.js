import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias:{
      "@": path.resolve(__dirname,"./src")
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL, // Use vite_api_url from .env
        changeOrigin: true,
        secure: false,
      },
    },
  },
});