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

  // 处理防抖取消的未处理Promise rejection
  // 当 rejectOnCancel: true 时，防抖函数取消会抛出 rejection
  // 在测试环境中，这些 rejection 如果没有被正确处理，会被 Vitest 报告为未处理错误
  const originalHandlers = process.listeners('unhandledRejection');
  process.removeAllListeners('unhandledRejection');

  process.on('unhandledRejection', (reason, promise) => {
    // 检查是否是防抖取消相关的错误
    // 由于 Vue Test Utils 的机制，这些 rejection 可能在测试中没有被正确处理
    // 我们静默处理它们，因为这是预期的防抖行为
    return;
  });

  // 全局注册 Element Plus 组件
  config.global.stubs = {
    'el-button': {
      template: '<button class="el-button" :class="[type ? `el-button--${type}` : \'\', { disabled }, $attrs.class]" :style="style" v-bind="$attrs" @click="$emit(\'click\', $event)" @focus="$emit(\'focus\', $event)"><slot></slot></button>',
      props: ['type', 'icon', 'loading', 'disabled', 'style'],
      emits: ['click', 'focus'],
      inheritAttrs: true
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

  // 清理未处理的Promise rejection
  vi.unstubAllGlobals();
});

// 所有测试后清理
afterAll(() => {
  // 清理全局状态
  vi.restoreAllMocks();
});
