import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@km/card-schema': fileURLToPath(new URL('../../packages/card-schema', import.meta.url))
    }
  },
  server: {
    port: 4173,
    fs: {
      allow: [
        fileURLToPath(new URL('./', import.meta.url)),
        fileURLToPath(new URL('../../packages', import.meta.url))
      ]
    }
  }
})
