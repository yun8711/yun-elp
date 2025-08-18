import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { config } from '@vue/test-utils';

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

  // 全局注册 Element Plus 组件
  config.global.stubs = {
    'el-button': {
      template: '<button class="el-button" :class="[type, { disabled }]" :style="style" @click="$emit(\'click\')"><slot></slot></button>',
      props: ['type', 'class', 'icon', 'loading', 'disabled', 'style'],
      emits: ['click']
    },
    'el-button-group': {
      template: '<div class="el-button-group"><slot></slot></div>'
    }
  };
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
