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
        target: 'https://temphost-backend.onrender.com', // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});