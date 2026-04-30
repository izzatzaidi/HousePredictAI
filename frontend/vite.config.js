import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict':         { target: 'http://localhost:8000', changeOrigin: true },
      '/regional-trends': { target: 'http://localhost:8000', changeOrigin: true },
      '/market-overview': { target: 'http://localhost:8000', changeOrigin: true },
      '/predictions':     { target: 'http://localhost:8000', changeOrigin: true },
      '/health':          { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
