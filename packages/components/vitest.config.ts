/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, '.'),
      '@yun-elp/theme-chalk': resolve(__dirname, '../theme-chalk/src')
    }
  },
  test: {
    // 测试名称
    name: 'components',

    // 测试环境 - 使用 node 环境，默认适合单元测试
    environment: 'happy-dom',

    // 全局变量支持
    globals: true,

    // 全局设置文件
    setupFiles: ['./vitest.setup.ts'],

    // 测试文件匹配模式
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],

    // 排除文件
    exclude: ['node_modules/**', 'dist/**', '**/*.d.ts', 'coverage/**'],

    // 测试超时设置
    testTimeout: 10000,
    hookTimeout: 10000,

    // 模拟和清理配置
    restoreMocks: true,
    clearMocks: true,

    // 确保测试顺序一致
    sequence: {
      shuffle: false
    },

    // 测试失败时不立即停止
    // bail: false,

    // 使用threads池而不是forks来避免进程管理问题
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true
      }
    },

    // 控制台日志过滤
    onConsoleLog(log: string) {
      if (log.includes('Unhandled error during execution of component event handler')) {
        return false;
      }
      return true;
    },
    reporters: process.env.CI ? ['html'] : ['default'],
    outputFile: process.env.CI ? '../../.reports/vitest.html' : undefined,

    // 覆盖率配置
    coverage: {
      // 是否开启覆盖率，默认false
      enabled: true,
      // @see https://cn.vitest.dev/config/#coverage-provider
      // provider: 'v8',
      // 报告类型: html-以html网页形式查看
      reporter: ['html'],
      // 生成报告的目录
      reportsDirectory: '../../.reports/coverage',
      // 在测试失败时生成报告，默认为false，如果有测试不通过，则不会生成报告
      reportOnFailure: true,
      // 覆盖率统计时包含的文件
      include: [
        'src/**/*.vue',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/__tests__/**'
      ],
      // 覆盖率统计时排除的文件，
      exclude: [
        'node_modules/**',
        '**/*.config.{ts,js}',
        '**/index.ts',
        '**/types.ts',
        // 下面的组件源码，不统计覆盖率
        'app-wrap/**',
        'locale/lang/**',
        'echarts/**'
      ],

      // 覆盖率阈值，一般用来在CI/CD中检查覆盖率是否达到要求，这里不需要设置
      thresholds: {
        statements: 90
      }
    }
  }
});
