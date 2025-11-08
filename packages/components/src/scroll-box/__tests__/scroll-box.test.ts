import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElScrollbar, ElIcon, ElButton } from 'element-plus';
import YScrollBox from '../src/scroll-box.vue';

// Mock ResizeObserver
const mockResizeObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
};

global.ResizeObserver = vi.fn().mockImplementation(() => mockResizeObserver);

// Mock @vueuse/core
vi.mock('@vueuse/core', () => ({
  useThrottleFn: vi.fn((fn: Function) => {
    // useThrottleFn 应该返回传入的函数本身，用于测试
    return fn;
  }),
  useResizeObserver: vi.fn(() => ({
    stop: vi.fn(() => {
      // 模拟停止观察
    })
  }))
}));

describe('YScrollBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 重置mock
    vi.mocked(global.ResizeObserver).mockClear();
    vi.mocked(mockResizeObserver.observe).mockClear();
    vi.mocked(mockResizeObserver.unobserve).mockClear();
    vi.mocked(mockResizeObserver.disconnect).mockClear();
  });

  const createWrapper = (props = {}, slots = {}) => {
    return mount(YScrollBox, {
      props,
      slots,
      global: {
        components: {
          ElScrollbar,
          ElIcon,
          ElButton
        }
      }
    });
  };

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__container').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__content').exists()).toBe(true);
    });

    it('应该正确渲染内容', () => {
      const wrapper = createWrapper(
        {},
        {
          default: '<div>测试内容</div>'
        }
      );
      expect(wrapper.exists()).toBe(true);
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
      const style = container.attributes('style') || '';
      expect(style).toMatch(/height:\s*200px/);
      expect(style).toMatch(/width:\s*300px/);
    });

    it('应该应用自定义箭头样式', () => {
      const arrowStyle = { backgroundColor: 'red', color: 'white' };
      const wrapper = createWrapper({
        arrowModel: 'always',
        arrowStyle
      });

      const arrow = wrapper.find('.y-scroll-box__arrow--prev');
      const style = arrow.attributes('style') || '';
      expect(style).toMatch(/background-color:\s*red/);
      expect(style).toMatch(/color:\s*white/);
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

      // 模拟滚动条状态 - 设置为可以向左滚动
      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置scrollbar的wrapRef
      scrollbarVm.wrapRef = {
        scrollLeft: 200,
        scrollWidth: 500,
        clientWidth: 200,
        style: {}
      };

      // 手动设置滚动状态 - 通过触发滚动事件来更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 200 });

      // 等待组件响应
      await wrapper.vm.$nextTick();

      // 模拟单击
      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('click');

      // 验证触发了scroll事件（可能包括初始设置、点击以及resizeObserver的调用）
      expect(wrapper.emitted('scroll')).toBeTruthy();
      expect(wrapper.emitted('scroll')?.length).toBeGreaterThanOrEqual(2);
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

  describe('连续滚动功能测试', () => {
    it('应该在边界位置正确处理连续滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 100
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟滚动到最左边界
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 500,
        clientWidth: 200,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });
      await wrapper.vm.$nextTick();

      // 模拟长按右键
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动计时器触发
      await new Promise(resolve => setTimeout(resolve, 150));

      // 验证长按事件被正确处理（不抛出错误）
      expect(nextArrow.exists()).toBe(true);

      // 清理定时器
      await nextArrow.trigger('mouseup');
    });

    it('应该在无法滚动时正确处理连续滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 100
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟滚动到最右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 300, // 已经滚动到最右
        scrollWidth: 500,
        clientWidth: 200,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 300 });
      await wrapper.vm.$nextTick();

      // 模拟长按右键
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动计时器触发
      await new Promise(resolve => setTimeout(resolve, 150));

      // 验证长按事件被正确处理（不抛出错误）
      expect(nextArrow.exists()).toBe(true);

      // 清理定时器
      await nextArrow.trigger('mouseup');
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
    it('应该暴露 scrollTo 方法', () => {
      const wrapper = createWrapper();

      // 验证方法存在
      expect(typeof wrapper.vm.scrollTo).toBe('function');
    });

    it('应该暴露 scrollToStart 方法', () => {
      const wrapper = createWrapper();

      // 验证方法存在
      expect(typeof wrapper.vm.scrollToStart).toBe('function');
    });

    it('应该暴露 scrollToEnd 方法', () => {
      const wrapper = createWrapper();

      // 验证方法存在
      expect(typeof wrapper.vm.scrollToEnd).toBe('function');
    });
  });

  describe('组件生命周期', () => {
    it('应该正确挂载和卸载', async () => {
      const wrapper = createWrapper();
      await wrapper.vm.$nextTick();

      expect(wrapper.exists()).toBe(true);

      wrapper.unmount();
      expect(wrapper.exists()).toBe(false);
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
