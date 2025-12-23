import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
    },
    server: {
      open: true,
      port: parseInt(env.VITE_PORT || '5173'),
    },
    preview: {
      port: parseInt(env.VITE_PREVIEW_PORT || '4173'),
    },
    test: {
      globals: true,
      environment: 'jsdom',
    }
  };
});