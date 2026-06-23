/// <reference types="vitest" />
import type { UserConfig } from 'vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

const baseConfig = viteConfig as UserConfig;

export default defineConfig(
  mergeConfig(baseConfig, {
    test: {
      name: 'components',
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      include: [
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        '**/__tests__/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts', 'coverage/**'],
      testTimeout: 10_000,
      hookTimeout: 10_000,
      mockReset: false,
      clearMocks: true,
      sequence: {
        shuffle: false
      },
      expect: {
        requireAssertions: false
      },
      restoreMocks: false,
      typecheck: {
        enabled: false
      },
      pool: 'threads',
      singleThread: true,
      // Element Plus 2.14+ 会引入 CSS 及子路径模块，需内联预构建
      server: {
        deps: {
          inline: ['element-plus', '@element-plus/icons-vue', '@vueuse/core', '@vueuse/shared']
        }
      },
      css: true,
      onConsoleLog(log: string) {
        if (log.includes('Unhandled error during execution of component event handler')) {
          return false;
        }
        return true;
      },
      coverage: {
        // 日常 test:run 不收集覆盖率；test:coverage 通过 --coverage 开启
        enabled: false,
        provider: 'v8',
        reporter: ['html'],
        reportsDirectory: '../../.coverage',
        reportOnFailure: true,
        include: [
          'src/**/*.vue',
          '!src/**/*.d.ts',
          '!src/**/*.test.{ts,tsx}',
          '!src/**/__tests__/**'
        ],
        exclude: [
          'node_modules/**',
          '**/*.config.{ts,js}',
          '**/index.ts',
          '**/types.ts',
          'src/**/*.ts',
          'locale/lang/**',
          'hooks/**',
          'utils/**',
          'cron-picker/src/components/**'
        ],
        // TODO: 逐步提升覆盖率至 90%
        thresholds: {
          statements: 50
        }
      }
    }
  })
);
