import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        client: path.resolve(__dirname, 'src/client/main.tsx'),
      },
    },
  },
  ssr: {
    noExternal: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['fsevents'],
  },
  server: {
    middlewareMode: true,
  },
});