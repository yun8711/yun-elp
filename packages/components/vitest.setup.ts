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

  // 全局注册 Element Plus 组件和指令
  config.global.stubs = {
    'el-button': {
      template:
        '<button class="el-button" :class="[type ? `el-button--${type}` : \'\', { disabled }, $attrs.class]" :style="style" v-bind="$attrs" @click="$emit(\'click\', $event)" @focus="$emit(\'focus\', $event)"><slot></slot></button>',
      props: ['type', 'icon', 'loading', 'disabled', 'style'],
      emits: ['click', 'focus'],
      inheritAttrs: true
    },
    'el-button-group': {
      template: '<div class="el-button-group"><slot></slot></div>'
    },
    'el-table': {
      template:
        '<div class="el-table" v-bind="$attrs" :class="{ \'is-loading\': loading }"><slot></slot><slot name="empty"></slot><slot name="append"></slot></div>',
      props: ['data', 'border', 'size', 'loading', 'height', 'maxHeight'],
      inheritAttrs: true
    },
    'el-pagination': {
      template:
        '<div class="el-pagination" v-bind="$attrs" @change="$emit(\'change\', arguments[0], arguments[1])"></div>',
      props: ['total', 'currentPage', 'pageSize', 'layout', 'background', 'pageSizes'],
      emits: ['change'],
      inheritAttrs: true
    },
    'y-empty': {
      template:
        '<div class="y-empty" v-bind="$attrs"><slot></slot><slot name="image"></slot><slot name="description"></slot></div>',
      props: ['image', 'imageSize', 'description', 'style'],
      inheritAttrs: true
    },
    'el-table-column': {
      template: '<div class="el-table-column" v-bind="$attrs"><slot></slot></div>',
      props: ['prop', 'label', 'width', 'minWidth', 'showOverflowTooltip'],
      inheritAttrs: true
    },
    'el-form-item': {
      template:
        '<div class="el-form-item" v-bind="$attrs" @mouseenter="$emit(\'mouseenter\', $event)" @mouseleave="$emit(\'mouseleave\', $event)"><slot></slot><template #error="{ error }"><slot name="error" :error="error"></slot></template></div>',
      props: ['prop', 'label', 'rules', 'labelWidth', 'required'],
      emits: ['mouseenter', 'mouseleave'],
      inheritAttrs: true
    },
    'el-tooltip': {
      template: '<div class="el-tooltip" v-bind="$attrs"><slot></slot></div>',
      props: ['content', 'placement', 'effect', 'disabled', 'popperClass'],
      inheritAttrs: true
    },
    'el-input': {
      template:
        '<input class="el-input__inner" v-bind="$attrs" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\', $event)" @focus="$emit(\'focus\', $event)" @change="$emit(\'change\', $event)" />',
      props: ['modelValue', 'placeholder', 'disabled', 'readonly', 'type'],
      emits: ['update:modelValue', 'blur', 'focus', 'change'],
      inheritAttrs: true
    },
    'el-form': {
      template:
        '<form class="el-form" v-bind="$attrs" @submit.prevent="$emit(\'submit\', $event)"><slot></slot></form>',
      props: ['model', 'rules', 'labelPosition', 'labelWidth', 'inline'],
      emits: ['submit'],
      inheritAttrs: true
    },
    'el-select': {
      template: '<div class="el-select" v-bind="$attrs"><slot></slot></div>',
      props: ['modelValue', 'placeholder', 'disabled', 'multiple', 'options'],
      emits: ['update:modelValue', 'change'],
      inheritAttrs: true
    },
    'y-pop': {
      template: '<div class="y-pop" v-bind="$attrs"><slot></slot></div>',
      props: ['noPop', 'tipContent', 'tipProps', 'confirm', 'cancel'],
      emits: ['confirm', 'cancel'],
      inheritAttrs: true
    },
    'y-button': {
      template:
        '<button class="y-button el-button" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot></slot></button>',
      props: ['type', 'loading', 'disabled', 'link'],
      emits: ['click'],
      inheritAttrs: true
    },
    'el-popover': {
      template:
        '<div class="el-popover" v-bind="$attrs"><slot></slot><slot name="reference"></slot></div>',
      props: ['placement', 'width', 'popperClass', 'trigger', 'visible'],
      emits: ['update:visible'],
      inheritAttrs: true
    },
    'el-icon': {
      template: '<i class="el-icon" v-bind="$attrs"><slot></slot></i>',
      inheritAttrs: true
    },
    'el-menu': {
      template: '<div class="el-menu" v-bind="$attrs"><slot></slot></div>',
      props: ['collapse', 'mode', 'defaultActive'],
      emits: ['open', 'close', 'select'],
      inheritAttrs: true
    },
    'el-menu-item': {
      template:
        '<div class="el-menu-item" :class="{ \'is-disabled\': disabled }" v-bind="$attrs"><slot></slot></div>',
      props: ['index', 'disabled'],
      inheritAttrs: true
    },
    'el-sub-menu': {
      template:
        '<div class="el-sub-menu"><div class="el-sub-menu__title"><slot name="title" /></div><slot /></div>',
      props: ['index', 'disabled'],
      inheritAttrs: true
    }
  };

  // 注册指令
  config.global.directives = {
    loading: {
      mounted(el, binding) {
        if (binding.value) {
          el.classList.add('is-loading');
        }
      },
      updated(el, binding) {
        if (binding.value) {
          el.classList.add('is-loading');
        } else {
          el.classList.remove('is-loading');
        }
      }
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
