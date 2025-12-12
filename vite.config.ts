import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`.
  // The third parameter '' means load ALL env vars, not just VITE_ prefixed ones.
  // This is crucial for Render which sets API_KEY as a system variable.
  const env = loadEnv(mode, '.', '');
  
  return {
    base: './', 
    plugins: [
      react()
    ],
    define: {
      // Prioritize the loaded env, but fallback to the raw process.env if available (Node context)
      // This ensures that even if loadEnv misses the system var, we grab it directly.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
    }
  }
})