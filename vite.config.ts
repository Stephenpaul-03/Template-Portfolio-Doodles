import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  // Relative URLs work for both user Pages sites and repository Pages sites.
  base: "./",
  resolve: { alias: { "@": resolve(__dirname, ".") } },
})
