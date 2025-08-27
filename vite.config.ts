import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite config - Environment variables loaded:', {
    DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NODE_ENV
  })
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    define: {
      'process.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }
  }
})
