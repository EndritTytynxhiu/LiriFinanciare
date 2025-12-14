import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Clean the key (remove quotes or spaces if present)
  const rawKey = env.API_KEY || '';
  const cleanKey = rawKey.replace(/["']/g, '').trim();

  // Debugging: Log whether the API Key was found
  if (cleanKey) {
    console.log("\x1b[32m%s\x1b[0m", "✅ API_KEY found and injected successfully!");
    console.log("   Key length:", cleanKey.length);
  } else {
    console.log("\x1b[31m%s\x1b[0m", "⚠️  WARNING: API_KEY not found in .env file.");
  }
  
  return {
    plugins: [react()],
    define: {
      // Define a global constant string that gets replaced at build time
      // This is safer than relying on process.env in the browser
      '__OPENAI_API_KEY__': JSON.stringify(cleanKey),
    },
  }
})