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
});
