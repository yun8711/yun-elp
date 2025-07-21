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
