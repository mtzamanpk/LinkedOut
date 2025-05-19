import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        background: path.resolve(__dirname, 'background.js'),
        content: path.resolve(__dirname, 'content.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  },
  // Make sure files in public are copied directly
  publicDir: 'public',
});
