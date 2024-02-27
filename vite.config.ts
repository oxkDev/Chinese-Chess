import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? '/Chinese-Chess/'
    : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'mask-icon.svg'],
      manifest: {
        name: "Chinese Chess Minimalist",
        short_name: "Chinese Chess",
        description: "This is a test",
        theme_color: "#232527",
        background_color: "#232527",
        display: "standalone",
        icons: [
          {
            src: 'img/icons/favicon-jiang (dark)(32x32).png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'img/icons/appicon-jiang (dark)(152x152).png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'img/icons/appicon-jiang (dark)(192x192).png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'img/icons/appicon-jiang (dark)(512x512).png',
            sizes: '512x512',
            type: 'image/png'
          },
        ]
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
