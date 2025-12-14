import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`.
  const env = loadEnv(mode, '.', '');
  
  return {
    base: './', 
    plugins: [
      react()
    ],
    define: {
      // Robustly check for API key in various standard Vite/Node locations
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
    }
  }
})