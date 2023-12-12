import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import fs from 'node:fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue(), svgLoader()],
      server: {
    https: env.ENABLE_HTTPS === 'true' ? {
      cert: fs.readFileSync(env.SSL_CERT_PATH),
        key: fs.readFileSync(env.SSL_KEY_PATH),
    } : false,
  },
  }
})
