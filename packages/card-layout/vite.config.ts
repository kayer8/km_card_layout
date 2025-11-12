import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "CardLayout",
      fileName: (format) => `card-layout.${format}.js`
    },
    sourcemap: true,
    rollupOptions: {
      external: ["vue", "km-card-schema"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
})
