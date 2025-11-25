import { fileURLToPath, URL } from 'node:url'

import { defineConfig, searchForWorkspaceRoot } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    fs: {
  allow: [
        // Dynamic workspace root (handles pnpm/yarn workspaces, git submodules)
        searchForWorkspaceRoot(process.cwd()),
        // Explicit paths as fallback
        process.cwd(),  // Project root
        `${process.cwd()}/node_modules`,  // Full node_modules path
        // If needed for Walrus WASM specifically:
        `${process.cwd()}/node_modules/@mysten/walrus-wasm`,  // Or @walrus-sites/client equivalent
      ],      
    }
  },
  optimizeDeps: {
    exclude: ["@mysten/walrus-wasm"],
  },
})
