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
    // CORSエラー回避のためのプロキシ設定（開発環境のみ）
    proxy: {
      '/api/asset-templates': {
        target: 'https://tsubasagit.github.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          // /api/asset-templates を /AppNavi-asset/api/templates.json に変換
          const rewritten = path.replace(/^\/api\/asset-templates/, '/AppNavi-asset/api/templates.json')
          console.log(`[Vite Proxy] Rewriting ${path} to ${rewritten}`)
          return rewritten
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy] Error:', err.message)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy] Proxying ${req.url} to ${proxyReq.path}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log(`[Vite Proxy] Response status: ${proxyRes.statusCode}`)
            // CORSヘッダーを追加
            proxyRes.headers['Access-Control-Allow-Origin'] = '*'
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type'
          })
        },
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})


