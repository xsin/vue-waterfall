import vue from '@vitejs/plugin-vue'
import { library } from '@xsin/vite-plugin-lib'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), library()],
})
