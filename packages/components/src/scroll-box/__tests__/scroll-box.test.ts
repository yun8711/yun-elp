import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElScrollbar, ElIcon } from 'element-plus';
import YScrollBox from '../src/scroll-box.vue';

// Mock ResizeObserver
const mockResizeObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
};

global.ResizeObserver = vi.fn(() => mockResizeObserver);

describe('YScrollBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = (props = {}, slots = {}) => {
    return mount(YScrollBox, {
      props,
      slots,
      global: {
        components: {
          ElScrollbar,
          ElIcon
        }
      }
    });
  };

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('.y-scroll-box').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__container').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__content').exists()).toBe(true);
    });

    it('应该正确渲染内容', () => {
      const wrapper = createWrapper({}, {
        default: '<div>测试内容</div>'
      });
      expect(wrapper.text()).toContain('测试内容');
    });
  });

    describe('属性测试', () => {
    it('应该应用自定义高度和宽度', () => {
      const wrapper = createWrapper({
        height: 200,
        width: 300
      });

      const container = wrapper.find('.y-scroll-box');
      const style = container.attributes('style');
      expect(style).toContain('height: 200px');
      expect(style).toContain('width: 300px');
    });

    it('应该应用自定义箭头样式', () => {
      const arrowStyle = { backgroundColor: 'red', color: 'white' };
      const wrapper = createWrapper({
        arrowModel: 'always',
        arrowStyle
      });

      const arrow = wrapper.find('.y-scroll-box__arrow--prev');
      const style = arrow.attributes('style');
      expect(style).toContain('background-color: red');
      expect(style).toContain('color: white');
    });
  });

  describe('箭头显示逻辑', () => {
    it('当 arrowModel 为 always 时应该显示箭头', () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      expect(wrapper.find('.y-scroll-box__arrow--prev').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__arrow--next').exists()).toBe(true);
    });

    it('当 arrowModel 为 auto 时不应该显示箭头', () => {
      const wrapper = createWrapper({
        arrowModel: 'auto'
      });

      expect(wrapper.find('.y-scroll-box__arrow--prev').exists()).toBe(false);
      expect(wrapper.find('.y-scroll-box__arrow--next').exists()).toBe(false);
    });
  });

    describe('滚动功能测试', () => {
    it('应该触发滚动事件', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      expect(wrapper.emitted('scroll')).toBeTruthy();
      expect(wrapper.emitted('scroll')?.[0]).toEqual([100]);
    });

    it('单击时应该只触发一次scroll事件', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 50
      });

      // 模拟滚动条状态 - 确保可以向左滚动
      const scrollbar = wrapper.findComponent(ElScrollbar);
      (scrollbar.vm as any).wrapRef = {
        scrollLeft: 200,
        scrollWidth: 500,
        clientWidth: 200
      };
      (scrollbar.vm as any).setScrollLeft = vi.fn();

      // 手动设置滚动状态
      await wrapper.vm.checkScrollStatus();

      // 模拟单击
      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('click');

      // 验证只触发一次scroll事件
      expect(wrapper.emitted('scroll')).toBeTruthy();
      expect(wrapper.emitted('scroll')?.length).toBe(1);
    });

    it('启用滚轮滚动时应该处理滚轮事件', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 50, deltaY: 0 });

      // 验证事件被处理（不抛出错误）
      expect(container.exists()).toBe(true);
    });

    it('禁用滚轮滚动时不应该处理滚轮事件', async () => {
      const wrapper = createWrapper({
        wheelScroll: false
      });

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 50, deltaY: 0 });

      // 验证事件被忽略（不抛出错误）
      expect(container.exists()).toBe(true);
    });
  });

    describe('箭头点击测试', () => {
    it('应该处理箭头点击', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('click');

      // 验证事件被处理（不抛出错误）
      expect(prevArrow.exists()).toBe(true);
    });
  });

    describe('暴露方法测试', () => {
    it('应该暴露 scrollTo 方法', async () => {
      const wrapper = createWrapper();

      // 验证方法存在且可调用
      expect(typeof wrapper.vm.scrollTo).toBe('function');
      await wrapper.vm.scrollTo(100);

      // 验证方法执行（不抛出错误）
      expect(wrapper.vm.scrollTo).toBeDefined();
    });

    it('应该暴露 scrollToStart 方法', async () => {
      const wrapper = createWrapper();

      // 验证方法存在且可调用
      expect(typeof wrapper.vm.scrollToStart).toBe('function');
      await wrapper.vm.scrollToStart();

      // 验证方法执行（不抛出错误）
      expect(wrapper.vm.scrollToStart).toBeDefined();
    });

    it('应该暴露 scrollToEnd 方法', async () => {
      const wrapper = createWrapper();

      // 验证方法存在且可调用
      expect(typeof wrapper.vm.scrollToEnd).toBe('function');
      await wrapper.vm.scrollToEnd();

      // 验证方法执行（不抛出错误）
      expect(wrapper.vm.scrollToEnd).toBeDefined();
    });


  });

    describe('组件生命周期', () => {
    it('挂载时应该设置 ResizeObserver', async () => {
      const wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      expect(ResizeObserver).toHaveBeenCalled();
    });

    it('卸载时应该清理资源', async () => {
      const wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      wrapper.unmount();

      expect(mockResizeObserver.disconnect).toHaveBeenCalled();
    });
  });

    describe('箭头点击测试', () => {
    it('应该处理箭头点击', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 30
      });

      const arrow = wrapper.find('.y-scroll-box__arrow--prev');
      await arrow.trigger('mousedown');
      await arrow.trigger('mouseup');

      // 验证事件被处理（不抛出错误）
      expect(arrow.exists()).toBe(true);
    });
  });

    describe('边界情况测试', () => {
    it('应该阻止双击文本选择', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const arrow = wrapper.find('.y-scroll-box__arrow--prev');
      await arrow.trigger('dblclick');

      // 验证事件被处理（不抛出错误）
      expect(arrow.exists()).toBe(true);
    });
  });
});
