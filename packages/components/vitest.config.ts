import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    // 使用happy-dom模拟DOM环境
    environment: 'happy-dom',
    // 支持所有测试文件格式
    include: ['./src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // 排除node_modules和dist目录
    exclude: ['**/node_modules/**', '**/dist/**'],
    // 全局测试设置
    globals: true,
    // 设置测试前的准备文件
    setupFiles: ['./src/test-setup.ts'],
    // 测试覆盖率配置
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/vite-env.d.ts']
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components')
    }
  }
})
