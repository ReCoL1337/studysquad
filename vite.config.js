import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const FIREBASE_KEYS = [
  'FIREBASE_API_KEY',
  'FIREBASE_APP_ID',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
]

const firebaseDefines = Object.fromEntries(
  FIREBASE_KEYS.map((k) => [
    `import.meta.env.${k}`,
    JSON.stringify(process.env[k] ?? ''),
  ])
)

export default defineConfig({
  plugins: [react()],
  define: firebaseDefines,
  server: { port: 3000, host: true },
  build: { outDir: 'dist' },
})