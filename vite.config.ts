import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Use root path for development, /KuecheneinteilerWeb/ for production (GitHub Pages)
  base: process.env.NODE_ENV === 'production' ? '/KuecheneinteilerWeb/' : '/',
  plugins: [vue()],
})
