/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import YButton from '../src/button.vue';

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn, delay, options) => {
    return vi.fn((...args) => {
      // 模拟防抖延迟
      setTimeout(() => fn(...args), delay);
    });
  })
}));

// Mock useAppConfig
vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn(() => ({
    delay: 300,
    maxWait: undefined,
    placement: 'top'
  }))
}));

// Mock Element Plus components
const ElButton = {
  name: 'ElButton',
  template: '<button class="el-button" :data-type="type" :data-size="size" :data-disabled="String(disabled)" :data-loading="String(loading)" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /><slot name="loading" /></button>',
  emits: ['click'],
  props: ['type', 'size', 'disabled', 'loading']
};

const ElTooltip = {
  name: 'ElTooltip',
  template: `
    <div class="el-tooltip" :disabled="disabled" :content="content" :placement="placement" :effect="effect" :enterable="enterable" v-bind="$attrs">
      <div class="el-tooltip__trigger">
        <slot />
      </div>
      <div v-if="$slots.content" class="el-tooltip__content">
        <slot name="content" />
      </div>
    </div>
  `,
  props: ['content', 'placement', 'disabled', 'effect', 'enterable']
};

// 全局配置
const globalConfig = {
  global: {
    components: {
      'el-button': ElButton,
      'el-tooltip': ElTooltip
    }
  }
};

describe('YButton 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('基础渲染', () => {
    const wrapper = mount(YButton, globalConfig);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.el-tooltip').exists()).toBe(true);
    expect(wrapper.find('.y-button').exists()).toBe(true);
  });

  it('默认插槽内容渲染', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      slots: { default: '点击按钮' }
    });
    expect(wrapper.text()).toBe('点击按钮');
  });

  it('具名插槽 icon 和 loading 渲染', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      slots: {
        icon: '<span class="icon">图标</span>',
        loading: '<span class="loading">加载中</span>'
      }
    });
    expect(wrapper.find('.icon').exists()).toBe(true);
    expect(wrapper.find('.loading').exists()).toBe(true);
  });

  it('传递自定义 props', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: {
        delay: 500,
        maxWait: 1000
      }
    });

    // 检查自定义 props 是否正确传递到组件
    expect(wrapper.vm.$props.delay).toBe(500);
    expect(wrapper.vm.$props.maxWait).toBe(1000);
  });

  it('自定义 delay 属性', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { delay: 500 }
    });
    expect(wrapper.props('delay')).toBe(500);
  });

  it('maxWait 属性传递', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { maxWait: 1000 }
    });
    expect(wrapper.props('maxWait')).toBe(1000);
  });

  it('点击事件触发防抖函数', async () => {
    const onClick = vi.fn();
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { onClick }
    });

    await wrapper.find('button').trigger('click');

    // 等待防抖延迟
    await new Promise(resolve => setTimeout(resolve, 350));

    // 验证点击事件被触发
    expect(wrapper.emitted('click')).toBeDefined();
  });

  it('不转发任意 attrs（data-testid/style/class 等），仅保留组件自身 class', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      attrs: {
        'data-testid': 'should-not-forward',
        class: 'custom-class',
        style: 'color: red;'
      }
    });

    const button = wrapper.find('button');
    // 非声明支持的 attrs 不应被透传
    expect(button.attributes('data-testid')).toBeUndefined();
    expect(button.attributes('style')).toBeUndefined();
    expect(button.classes()).not.toContain('custom-class');
    // 仍应包含 y-button
    expect(button.classes()).toContain('y-button');
  });

  it('emit click 事件', async () => {
    const wrapper = mount(YButton, globalConfig);
    const button = wrapper.find('button');

    await button.trigger('click');

    // 等待防抖延迟
    await new Promise(resolve => setTimeout(resolve, 350));

    // 验证点击事件被触发
    expect(wrapper.emitted('click')).toBeDefined();
  });

  it('组件名称正确', () => {
    const wrapper = mount(YButton, globalConfig);
    expect(wrapper.vm.$options.name).toBe('YButton');
  });

  it('inheritAttrs 为 false', () => {
    const wrapper = mount(YButton, globalConfig);
    expect(wrapper.vm.$options.inheritAttrs).toBe(false);
  });

  it('边界：delay 为字符串类型', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { delay: '500' }
    });
    expect(wrapper.props('delay')).toBe('500');
  });

  it('边界：maxWait 为字符串类型', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { maxWait: '1000' }
    });
    expect(wrapper.props('maxWait')).toBe('1000');
  });

  it('边界：maxWait 为 undefined', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      props: { maxWait: undefined }
    });
    expect(wrapper.props('maxWait')).toBeUndefined();
  });

  // Tooltip 相关测试
  describe('Tooltip 功能', () => {
    it('默认不显示 tooltip', () => {
      const wrapper = mount(YButton, globalConfig);
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('disabled')).toBe('true');
    });

    it('设置 content 属性时显示 tooltip', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: { content: '按钮提示' }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('disabled')).toBe('false');
      expect(tooltip.attributes('content')).toBe('按钮提示');
    });

    it('使用 content 插槽时显示 tooltip', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        slots: {
          content: '<span>自定义提示内容</span>'
        }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('disabled')).toBe('false');
      expect(wrapper.find('.el-tooltip__content').exists()).toBe(true);
    });

    it('默认 placement 为 top', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: { content: '提示' }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('placement')).toBe('top');
    });

    it('自定义 placement 属性', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: {
          content: '提示',
          placement: 'bottom'
        }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('placement')).toBe('bottom');
    });

    it('传递 tooltipProps 属性', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: {
          content: '提示',
          tooltipProps: {
            effect: 'dark',
            enterable: false
          }
        }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('effect')).toBe('dark');
      expect(tooltip.attributes('enterable')).toBe('false');
    });

    it('仅设置 tooltipProps.content 也应显示 tooltip（disabled=false）', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: {
          tooltipProps: { content: '来自 props.tooltipProps 的提示' }
        }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('disabled')).toBe('false');
    });

    it('tooltip 和 content 插槽同时存在时优先使用插槽', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: { content: 'props提示' },
        slots: {
          content: '<span>插槽提示</span>'
        }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.attributes('disabled')).toBe('false');
      expect(wrapper.find('.el-tooltip__content').text()).toBe('插槽提示');
    });

    it('tooltip 组件具有正确的 class', () => {
      const wrapper = mount(YButton, {
        ...globalConfig,
        props: { content: '提示' }
      });
      const tooltip = wrapper.find('.el-tooltip');
      expect(tooltip.classes()).toContain('y-button-tooltip');
    });

    it('button 组件具有正确的 class', () => {
      const wrapper = mount(YButton, globalConfig);
      const button = wrapper.find('button');
      expect(button.classes()).toContain('y-button');
    });

    it('expose buttonRef 和 tooltipRef', () => {
      const wrapper = mount(YButton, globalConfig);
      expect(wrapper.vm.buttonRef).toBeDefined();
      expect(wrapper.vm.tooltipRef).toBeDefined();
    });
  });
});
