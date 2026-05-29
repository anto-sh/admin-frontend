import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue(), vueDevTools()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@app': path.resolve(__dirname, 'src/app'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@widgets': path.resolve(__dirname, 'src/widgets'),
        '@features': path.resolve(__dirname, 'src/features'),
        '@entities': path.resolve(__dirname, 'src/entities'),
        '@shared': path.resolve(__dirname, 'src/shared'),
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
        @use "@/shared/css/_variables.scss" as *;
        @use "@/shared/css/_mixins.scss" as *;
      `,
        },
      },
    },
    build: {},

    /* ───────────────────────── DEV ONLY ───────────────────────── */
    server: {
      proxy: {
        [env.VITE_API_URL]: {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
        [env.VITE_IMG_URL]: {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
        [env.VITE_VIDEO_URL]: {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
