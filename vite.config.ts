import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const apiKey = env.VITE_OPENAI_API_KEY

  if (apiKey) {
    console.log('\x1b[32m%s\x1b[0m', '✅ OpenAI API key loaded from .env')
    console.log('   Key length:', apiKey.length)
  } else {
    console.log('\x1b[31m%s\x1b[0m', '❌ VITE_OPENAI_API_KEY not found')
  }

  return {
    plugins: [react()],
    define: {
      __OPENAI_API_KEY__: JSON.stringify(apiKey),
    },
  }
})
