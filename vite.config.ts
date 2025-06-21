import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ✅ THIS FIXES BLANK SCREEN ISSUE ON NETLIFY
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
