import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    // 添加更稳定的测试配置
    setupFiles: ['./vitest.setup.ts'],
    isolate: true,
    restoreMocks: true,
    clearMocks: true,
    // 确保测试顺序一致
    sequence: {
      shuffle: false
    },
    // 添加超时设置
    testTimeout: 10000,
    hookTimeout: 10000,
    // 处理未处理的Promise rejection
    bail: false,
    onConsoleLog(log, type) {
      // 过滤掉防抖相关的警告
      if (log.includes('Unhandled error during execution of component event handler')) {
        return false;
      }
      return true;
    },
    coverage: {
      provider: 'v8',
      reporter: ['html'],
      include: [
        'src/**/*.{tsx,vue}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/__tests__/**'
      ],
      exclude: ['node_modules/**', 'dist/**'],
      reportsDirectory: './coverage'
    }
  }
});
