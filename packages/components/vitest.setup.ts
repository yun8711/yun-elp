import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// 全局测试设置
beforeAll(() => {
  // 设置测试环境变量
  process.env.NODE_ENV = 'test';

  // 确保 DOM 环境正确初始化
  if (typeof window === 'undefined') {
    global.window = {} as any;
  }

  // 设置全局测试超时
  vi.setConfig({ testTimeout: 10000 });
});

// 每个测试后清理
afterEach(() => {
  // 清理 DOM
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  }

  // 清理所有模拟
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// 所有测试后清理
afterAll(() => {
  // 清理全局状态
  vi.restoreAllMocks();
});
