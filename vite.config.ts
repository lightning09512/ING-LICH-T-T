import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules/react') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          if (id.includes('toeicSwAuthenticBank') || id.includes('toeicSpeakingData') || id.includes('toeicWritingData')) {
            return 'data-toeic-sw';
          }
          if (id.includes('toeicRevisionData')) {
            return 'data-toeic-revision';
          }
          if (id.includes('grammarData') || id.includes('grammarBank') || id.includes('toeicPart5Bank')) {
            return 'data-grammar-bank';
          }
          if (id.includes('initialData') || id.includes('vocabChapter2')) {
            return 'data-vocab-lr';
          }
        },
      },
    },
  },
});
