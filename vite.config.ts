import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import httpsProxyAgent from 'https-proxy-agent'

const { HttpsProxyAgent } = httpsProxyAgent

const proxyUrl = process.env.HTTPS_PROXY ?? process.env.https_proxy
const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/geocoding': {
        target: 'https://geocoding-api.open-meteo.com',
        changeOrigin: true,
        secure: false,
        agent: proxyAgent,
        rewrite: (path) => path.replace(/^\/api\/geocoding/, '/v1/search'),
      },
      '/api/forecast': {
        target: 'https://api.open-meteo.com',
        changeOrigin: true,
        secure: false,
        agent: proxyAgent,
        rewrite: (path) => path.replace(/^\/api\/forecast/, '/v1/forecast'),
      },
    },
  },
})
