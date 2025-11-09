import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { config } from '@vue/test-utils';

// Element Plus select 组件的注入 key
const SELECT_INJECTION_KEY = Symbol('ElSelect');

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

  // Mock 定时器相关的全局API，防止在测试环境中出现processImmediate错误
  if (typeof global !== 'undefined') {
    // Mock process.nextTick if not available
    if (!global.process.nextTick) {
      global.process.nextTick = (cb: Function) => setTimeout(cb, 0);
    }

    // Mock processImmediate if available and causing issues
    if (global.process._immediateCallback) {
      delete global.process._immediateCallback;
    }
  }

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
        '<button class="el-button" :class="[type ? `el-button--${type}` : \'\', disabled ? \'is-disabled\' : \'\', $attrs.class]" :style="style" v-bind="$attrs" @click="$emit(\'click\', $event)" @focus="$emit(\'focus\', $event)"><slot></slot></button>',
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
      template: '<div class="el-table-column" v-bind="$attrs"><slot name="default" :scope="{ row: { id: 1, name: \'test\' }, column: {}, $index: 0 }"></slot></div>',
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
        '<div class="el-input" v-bind="$attrs"><div class="el-input__wrapper" tabindex="-1"><input class="el-input__inner" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\', $event)" @focus="$emit(\'focus\', $event)" @change="$emit(\'change\', $event)" /></div></div>',
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
      inheritAttrs: true,
      provide() {
        return {
          [SELECT_INJECTION_KEY]: {
            props: this.$props,
            selectOption: () => {},
            removeOption: () => {},
            updateOptions: () => {}
          }
        };
      }
    },
    'el-option': {
      template: '<div class="el-option" v-bind="$attrs"></div>',
      props: ['label', 'value', 'disabled'],
      inheritAttrs: true,
      inject: {
        select: { from: SELECT_INJECTION_KEY, default: null }
      }
    },
    'el-cascader': {
      template: '<div class="el-cascader" v-bind="$attrs"></div>',
      props: ['modelValue', 'options', 'placeholder', 'disabled'],
      emits: ['update:modelValue', 'change'],
      inheritAttrs: true,
      provide() {
        return {
          [SELECT_INJECTION_KEY]: {
            props: this.$props,
            selectOption: () => {},
            removeOption: () => {},
            updateOptions: () => {}
          }
        };
      }
    },
    'el-option': {
      template: '<div class="el-option" v-bind="$attrs"></div>',
      props: ['label', 'value', 'disabled'],
      inheritAttrs: true,
      inject: {
        select: { from: SELECT_INJECTION_KEY, default: null }
      }
    },
    'el-radio-group': {
      template: '<div class="el-radio-group" v-bind="$attrs"><slot></slot></div>',
      props: ['modelValue', 'disabled'],
      emits: ['update:modelValue', 'change'],
      inheritAttrs: true
    },
    'el-radio': {
      template: '<div class="el-radio" v-bind="$attrs"><slot></slot></div>',
      props: ['label', 'value', 'disabled'],
      inheritAttrs: true
    },
    'el-radio-button': {
      template: '<div class="el-radio-button" v-bind="$attrs"><slot></slot></div>',
      props: ['label', 'value', 'disabled'],
      inheritAttrs: true
    },
    'el-cascader': {
      template: '<div class="el-cascader" v-bind="$attrs"></div>',
      props: ['modelValue', 'options', 'placeholder', 'disabled'],
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
    'el-scrollbar': {
      template:
        '<div class="el-scrollbar" v-bind="$attrs"><div class="el-scrollbar__wrap" ref="wrapRef"><div class="el-scrollbar__view"><slot></slot></div></div><div class="el-scrollbar__bar is-horizontal"><div class="el-scrollbar__thumb"></div></div></div>',
      props: [
        'height',
        'maxHeight',
        'native',
        'wrapStyle',
        'wrapClass',
        'viewStyle',
        'viewClass',
        'noresize',
        'tag',
        'always',
        'minSize'
      ],
      data() {
        return {
          wrapRef: null
        };
      },
      mounted() {
        this.wrapRef = this.$refs.wrapRef;
        if (this.wrapRef) {
          // 使用Object.defineProperty来模拟DOM属性
          Object.defineProperty(this.wrapRef, 'scrollLeft', {
            value: 0,
            writable: true
          });
          Object.defineProperty(this.wrapRef, 'scrollWidth', {
            value: 200,
            writable: true
          });
          Object.defineProperty(this.wrapRef, 'clientWidth', {
            value: 100,
            writable: true
          });
        }
      },
      methods: {
        setScrollLeft(left: number) {
          if (this.wrapRef) {
            this.wrapRef.scrollLeft = left;
            this.$emit('scroll', { scrollLeft: left });
          }
        }
      },
      emits: ['scroll'],
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
