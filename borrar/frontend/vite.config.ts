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
      // Proxy específico para rutas API del backend
      '/api': {  
        target: serverUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      // Proxy para archivos subidos públicos
      '/uploads': {
        target: serverUrl,
        changeOrigin: true,
        secure: false
      },
      // Proxy para archivos privados
      '/files-privates': {
        target: serverUrl,
        changeOrigin: true,
        secure: false
      },
      // Proxy para archivos públicos
      '/files': {
        target: serverUrl,
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Configuración de build para manejo correcto de assets
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
})