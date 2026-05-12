import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression2';

export default defineConfig({
  plugins: [
    react(),

    compression({
      algorithms: ['gzip'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),

    compression({
      algorithms: ['brotliCompress'],
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  build: {
    target: 'es2015',

    minify: 'terser',

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react')) {
            return 'react-vendor';
          }
        },
      },
    },

    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },

  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});