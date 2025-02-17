import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@homepage-assets': path.resolve(__dirname, 'src/pages/homepage/assets'),
      '@code-editor-assets': path.resolve(__dirname, 'src/pages/live-code/assets')
    },
  },
  optimizeDeps: {
    exclude: ["monaco-editor"], // Prevent Vite from pre-bundling Monaco
  },
  build: {
    rollupOptions: {
      external: ["monaco-editor"], // Prevent Rollup from bundling Monaco
    },
  },
});
