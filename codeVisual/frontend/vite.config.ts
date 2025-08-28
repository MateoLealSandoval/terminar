/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'node:url'


import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import envCompatible from 'vite-plugin-env-compatible'
// https://vite.dev/config/
const serverUrl = process.env.VITE_SERVER || 'https://server.docvisual.co'
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    envCompatible()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    

    proxy: {
      '/api': {  
        target: serverUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  
      }
    }

  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})