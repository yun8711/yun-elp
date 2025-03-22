import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@kd-elp/components': resolve(__dirname, '../packages/components/src'),
      '@kd-elp/utils': resolve(__dirname, '../packages/utils/src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['vue', 'element-plus']
  }
})
