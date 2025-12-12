import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  return {
    base: './', // Ensures relative paths for assets (works for GitHub Pages and usually Render)
    plugins: [
      react()
    ],
    define: {
      // Injects the API key into the client-side code at build time
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
    }
  }
})