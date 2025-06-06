import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
	plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:5000`,
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: `http://localhost:5000`,
        changeOrigin: true,
        secure: false,
      },
      '/products': {
        target: `http://localhost:5000`,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})