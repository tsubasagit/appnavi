import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 開発環境ではbaseパスなし、本番環境（GitHub Pages）では/appnavi/
  base: process.env.NODE_ENV === 'production' ? '/appnavi/' : '/',
  server: {
    host: '0.0.0.0', // IPv4とIPv6の両方でリッスン
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})


