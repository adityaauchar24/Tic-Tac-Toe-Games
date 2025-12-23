import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple configuration without test settings
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    open: true,
    port: 5173
  }
})