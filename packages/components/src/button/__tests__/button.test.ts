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

// Mock Element Plus components
const ElButton = {
  name: 'ElButton',
  template: '<button v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /><slot name="loading" /></button>',
  emits: ['click'],
  props: ['type', 'size', 'disabled', 'loading']
};

// 全局配置
const globalConfig = {
  global: {
    components: {
      'el-button': ElButton
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
    expect(wrapper.find('button').exists()).toBe(true);
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

  it('默认 delay 属性为 300', () => {
    const wrapper = mount(YButton, globalConfig);
    expect(wrapper.props('delay')).toBe(300);
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

  it('继承 el-button 的所有属性', () => {
    const wrapper = mount(YButton, {
      ...globalConfig,
      attrs: {
        'data-testid': 'test-button',
        class: 'custom-class',
        style: 'color: red;'
      }
    });

    const button = wrapper.find('button');
    expect(button.attributes('data-testid')).toBe('test-button');
    expect(button.attributes('class')).toContain('custom-class');
    expect(button.attributes('style')).toContain('color: red');
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

  it('inheritAttrs 为 true', () => {
    const wrapper = mount(YButton, globalConfig);
    expect(wrapper.vm.$options.inheritAttrs).toBe(true);
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
});
