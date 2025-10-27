/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YStickyLayout from '../src/sticky-layout.vue';
import type { StickyLayoutProps } from '../src/sticky-layout';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock @vueuse/core to avoid complex scroll/resize logic in tests
vi.mock('@vueuse/core', () => ({
  useResizeObserver: vi.fn(() => ({ stop: vi.fn() })),
  useScroll: vi.fn(() => ({
    x: { value: 0 },
    y: { value: 0 },
    isScrolling: { value: false },
    arrivedState: {
      left: true,
      right: false,
      top: true,
      bottom: false
    },
    directions: {
      left: false,
      right: false,
      top: false,
      bottom: false
    }
  })),
  useElementBounding: vi.fn(() => ({
    left: { value: 0 },
    top: { value: 0 },
    right: { value: 0 },
    bottom: { value: 0 },
    width: { value: 0 },
    height: { value: 0 },
    x: { value: 0 },
    y: { value: 0 }
  })),
  useElementSize: vi.fn(() => ({
    width: { value: 0 },
    height: { value: 0 }
  }))
}));

// 测试工具函数
const createWrapper = (
  props: Partial<StickyLayoutProps> = {},
  slots: Record<string, string> = {}
) => {
  const wrapper = mount(YStickyLayout, {
    props,
    slots,
    global: {
      stubs: {}
    }
  });
  return wrapper;
};

describe('YStickyLayout 侧边吸顶布局组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础功能', () => {
    it('组件正常渲染', async () => {
      const wrapper = createWrapper();
      await nextTick();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-sticky-layout').exists()).toBe(true);
    });

    it('默认插槽内容正常渲染', async () => {
      const slotContent = '这是内容区域';
      const wrapper = createWrapper(
        {},
        {
          default: slotContent
        }
      );
      await nextTick();
      expect(wrapper.text()).toContain(slotContent);
      expect(wrapper.find('.y-sticky-layout__content').exists()).toBe(true);
    });

    it('左侧插槽内容正常渲染', async () => {
      const leftContent = '左侧内容';
      const wrapper = createWrapper(
        {},
        {
          left: leftContent
        }
      );
      await nextTick();
      expect(wrapper.find('.y-sticky-layout__left').exists()).toBe(true);
      expect(wrapper.html()).toContain(leftContent);
    });

    it('右侧插槽内容正常渲染', async () => {
      const rightContent = '右侧内容';
      const wrapper = createWrapper(
        {},
        {
          right: rightContent
        }
      );
      await nextTick();
      expect(wrapper.find('.y-sticky-layout__right').exists()).toBe(true);
      expect(wrapper.html()).toContain(rightContent);
    });

    it('组件正确设置name属性', async () => {
      const wrapper = createWrapper();
      await nextTick();
      expect(wrapper.vm.$options.name).toBe('YStickyLayout');
    });
  });

  describe('Props 属性测试', () => {
    it('scrollContainer 属性 - 字符串类型', () => {
      const wrapper = createWrapper({ scrollContainer: '.scroll-container' });
      expect(wrapper.props('scrollContainer')).toBe('.scroll-container');
    });

    it('scrollContainer 属性 - HTMLElement类型', () => {
      const element = document.createElement('div');
      const wrapper = createWrapper({ scrollContainer: element });
      expect(wrapper.props('scrollContainer')).toBe(element);
    });

    it('scrollContainer 属性 - 默认值undefined', () => {
      const wrapper = createWrapper();
      expect(wrapper.props('scrollContainer')).toBeUndefined();
    });
  });

  describe('插槽组合测试', () => {
    it('同时使用所有插槽', async () => {
      const wrapper = createWrapper(
        {},
        {
          left: '<div class="left-content">左侧内容</div>',
          default: '<div class="main-content">主要内容</div>',
          right: '<div class="right-content">右侧内容</div>'
        }
      );
      await nextTick();

      expect(wrapper.find('.left-content').exists()).toBe(true);
      expect(wrapper.find('.main-content').exists()).toBe(true);
      expect(wrapper.find('.right-content').exists()).toBe(true);
    });

    it('只有默认插槽', async () => {
      const wrapper = createWrapper(
        {},
        {
          default: '<div class="only-content">只有内容</div>'
        }
      );
      await nextTick();

      expect(wrapper.find('.only-content').exists()).toBe(true);
      expect(wrapper.find('.y-sticky-layout__content').exists()).toBe(true);
    });
  });

  describe('样式类名测试', () => {
    it('应用正确的CSS类名', async () => {
      const wrapper = createWrapper();
      await nextTick();

      expect(wrapper.classes()).toContain('y-sticky-layout');
      expect(wrapper.find('.y-sticky-layout__content').exists()).toBe(true);
    });
  });
});
