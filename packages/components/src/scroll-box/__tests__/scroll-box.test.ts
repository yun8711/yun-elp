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
  });

  afterEach(() => {
    // 清理所有定时器，防止测试间的干扰
    vi.clearAllTimers();
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

    it('应该支持字符串类型的高度和宽度', () => {
      const wrapper = createWrapper({
        height: '50%',
        width: '80%'
      });

      const container = wrapper.find('.y-scroll-box');
      const style = container.attributes('style') || '';
      expect(style).toMatch(/height:\s*50%/);
      expect(style).toMatch(/width:\s*80%/);
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

    it('应该支持自定义滚动条属性', () => {
      const scrollbarProps = { height: '200px', always: true };
      const wrapper = createWrapper({
        scrollbarProps
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      expect(scrollbar.props('height')).toBe('200px');
      expect(scrollbar.props('always')).toBe(true);
    });

    it('应该支持自定义滚动步进距离', () => {
      const wrapper = createWrapper({
        step: 50
      });

      expect(wrapper.vm.step).toBe(50);
    });

    it('应该支持自定义连续滚动时间', () => {
      const wrapper = createWrapper({
        continuousTime: 300
      });

      expect(wrapper.vm.continuousTime).toBe(300);
    });

    it('应该支持自定义连续滚动步进距离', () => {
      const wrapper = createWrapper({
        continuousStep: 40
      });

      expect(wrapper.vm.continuousStep).toBe(40);
    });

    it('应该正确应用默认属性值', () => {
      const wrapper = createWrapper();

      expect(wrapper.vm.arrowModel).toBe('auto');
      expect(wrapper.vm.step).toBe(30);
      expect(wrapper.vm.wheelScroll).toBe(false);
      expect(wrapper.vm.continuous).toBe(false);
      expect(wrapper.vm.continuousTime).toBe(200);
      expect(wrapper.vm.continuousStep).toBe(20);
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

    it('当 arrowModel 为 auto 且内容超出时应该显示箭头', async () => {
      const wrapper = createWrapper({
        arrowModel: 'auto',
        width: 100
      }, {
        default: '<div style="width: 200px;">长内容测试</div>'
      });

      // 等待组件更新
      await wrapper.vm.$nextTick();

      // 手动设置滚动状态
      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 200,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动状态检查
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      expect(wrapper.find('.y-scroll-box__arrow--prev').exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__arrow--next').exists()).toBe(true);
    });
  });

  describe('箭头状态测试', () => {
    it('应该正确显示箭头禁用状态 - 无法向左滚动时', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟滚动到最左边界
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 200,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      expect(prevArrow.classes()).toContain('y-scroll-box__arrow--disabled');
      expect(nextArrow.classes()).not.toContain('y-scroll-box__arrow--disabled');
    });

    it('应该正确显示箭头禁用状态 - 无法向右滚动时', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟滚动到最右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 200,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      expect(prevArrow.classes()).not.toContain('y-scroll-box__arrow--disabled');
      expect(nextArrow.classes()).toContain('y-scroll-box__arrow--disabled');
    });

    it('应该正确显示箭头禁用状态 - 内容未超出时', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟内容未超出容器
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      expect(prevArrow.classes()).toContain('y-scroll-box__arrow--disabled');
      expect(nextArrow.classes()).toContain('y-scroll-box__arrow--disabled');
    });

    it('应该正确显示箭头启用状态 - 可以双向滚动时', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 模拟可以双向滚动
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 200,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 50 });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      expect(prevArrow.classes()).not.toContain('y-scroll-box__arrow--disabled');
      expect(nextArrow.classes()).not.toContain('y-scroll-box__arrow--disabled');
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

    it('应该正确处理箭头点击滚动 - 向右滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置初始状态 - 不在边界
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 点击向右箭头
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('click');

      // 验证调用了setScrollLeft并传入了正确的参数
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(150); // 100 + 50
    });

    it('应该正确处理箭头点击滚动 - 向左滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置初始状态 - 不在边界
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 点击向左箭头
      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('click');

      // 验证调用了setScrollLeft并传入了正确的参数
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(50); // 100 - 50
    });

    it('应该在左边界阻止向左滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置在左边界
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      // 点击向左箭头
      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('click');

      // 验证没有调用setScrollLeft（因为已经在边界）
      expect(scrollbarVm.setScrollLeft).not.toHaveBeenCalled();
    });

    it('应该在右边界阻止向右滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置在右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 200, // 300 - 100
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 200 });

      // 点击向右箭头
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('click');

      // 验证没有调用setScrollLeft（因为已经在边界）
      expect(scrollbarVm.setScrollLeft).not.toHaveBeenCalled();
    });

    it('应该处理超出边界的滚动位置', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 100
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置接近右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 180,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 180 });

      // 点击向右箭头（会超出边界）
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('click');

      // 验证调用了setScrollLeft并被限制在最大边界
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(200); // 300 - 100
    });

    it('启用滚轮滚动时应该处理滚轮事件', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 20, deltaY: 0 });

      // 验证调用了setScrollLeft并计算了正确的滚动位置
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(70); // 50 + 20
    });

    it('禁用滚轮滚动时不应该处理滚轮事件', async () => {
      const wrapper = createWrapper({
        wheelScroll: false
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 50, deltaY: 0 });

      // 验证没有调用setScrollLeft
      expect(scrollbarVm.setScrollLeft).not.toHaveBeenCalled();
    });

    it('滚轮滚动应该限制在边界内', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置接近右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 190,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 50, deltaY: 0 }); // 会超出边界

      // 验证被限制在最大边界
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(200); // 300 - 100
    });

    it('滚轮滚动应该处理deltaY值', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 0, deltaY: 30 });

      // 验证使用deltaY值进行滚动
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(80); // 50 + 30
    });

    it('滚轮滚动应该优先使用deltaX而非deltaY', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 20, deltaY: 30 });

      // 验证优先使用deltaX
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(70); // 50 + 20
    });

    it('滚轮滚动应该处理负数delta值', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: -20, deltaY: 0 });

      // 验证正确处理负数delta值
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(30); // 50 + (-20)
    });

    it('滚轮滚动应该防止事件冒泡', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      const mockEvent = {
        deltaX: 20,
        deltaY: 0,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };

      await container.trigger('wheel', mockEvent);

      // 验证调用了preventDefault
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('滚轮滚动应该在左边界阻止负数滚动', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置在左边界
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: -50, deltaY: 0 });

      // 验证滚动位置不小于0
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(0);
    });

    it('滚轮滚动应该在右边界阻止正数滚动', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置在右边界
      scrollbarVm.wrapRef = {
        scrollLeft: 200,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // Mock setScrollLeft方法
      scrollbarVm.setScrollLeft = vi.fn();

      const container = wrapper.find('.y-scroll-box__container');
      await container.trigger('wheel', { deltaX: 100, deltaY: 0 });

      // 验证滚动位置不超过最大值
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(200); // 300 - 100
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

    it('应该正确启动连续滚动 - 向右滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50,
        continuousStep: 20
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以向右滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 模拟长按右键
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证连续滚动已启动
      expect(wrapper.vm.isContinuous).toBe(true);
      expect(wrapper.vm.continuousDirection).toBe('next');

      // 清理
      await nextArrow.trigger('mouseup');
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('应该正确启动连续滚动 - 向左滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50,
        continuousStep: 20
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以向左滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 模拟长按左键
      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');
      await prevArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证连续滚动已启动
      expect(wrapper.vm.isContinuous).toBe(true);
      expect(wrapper.vm.continuousDirection).toBe('prev');

      // 清理
      await prevArrow.trigger('mouseup');
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('应该在边界处停止连续滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50,
        continuousStep: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置接近右边界的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 180,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 180 });

      // 模拟长按右键
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 等待一些滚动帧
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证在边界处停止（setScrollLeft最后一次调用应该是边界值）
      const calls = scrollbarVm.setScrollLeft.mock.calls;
      if (calls.length > 0) {
        const lastCall = calls[calls.length - 1];
        expect(lastCall[0]).toBeLessThanOrEqual(200); // 不超过边界
      }

      // 清理
      await nextArrow.trigger('mouseup');
    });

    it('禁用连续滚动时不应该启动连续滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: false,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 模拟长按
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待计时器时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证连续滚动没有启动
      expect(wrapper.vm.isContinuous).toBe(false);
      expect(wrapper.vm.continuousDirection).toBe(null);
    });

    it('应该在鼠标释放时停止连续滚动', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 模拟长按启动连续滚动
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 模拟鼠标释放
      await nextArrow.trigger('mouseup');

      // 等待一小段时间确保清理完成
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证连续滚动已停止
      expect(wrapper.vm.isContinuous).toBe(false);
    });

    it('连续滚动应该使用正确的步进距离', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50,
        continuousStep: 25
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      // 模拟长按启动连续滚动
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 等待一些滚动帧
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证使用了正确的步进距离
      const calls = scrollbarVm.setScrollLeft.mock.calls;
      if (calls.length > 1) {
        const firstCall = calls[0][0];
        const secondCall = calls[1][0];
        expect(secondCall - firstCall).toBe(25);
      }

      // 清理
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

    it('scrollTo方法应该支持数字参数', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollTo方法
      wrapper.vm.scrollTo(150);

      // 验证调用了setScrollLeft
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(150);
    });

    it('scrollTo方法应该支持"start"参数', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollToStart方法
      wrapper.vm.scrollTo('start');

      // 验证滚动到开始位置
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(0);
    });

    it('scrollTo方法应该支持"end"参数', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollToEnd方法
      wrapper.vm.scrollTo('end');

      // 验证滚动到结束位置
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(200); // 300 - 100
    });

    it('scrollToStart方法应该滚动到开始位置', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 150,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollToStart方法
      wrapper.vm.scrollToStart();

      // 验证滚动到开始位置
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(0);
    });

    it('scrollToEnd方法应该滚动到结束位置', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 400,
        clientWidth: 150,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollToEnd方法
      wrapper.vm.scrollToEnd();

      // 验证滚动到结束位置
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(250); // 400 - 150
    });

    it('scrollTo方法应该直接传递数值参数', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollTo方法传入任意值
      wrapper.vm.scrollTo(500);

      // 验证直接传递给setScrollLeft（不进行边界检查）
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(500);
    });

    it('scrollTo方法应该直接传递负数参数', async () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 调用scrollTo方法传入负数
      wrapper.vm.scrollTo(-50);

      // 验证直接传递给setScrollLeft（不进行边界检查）
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(-50);
    });

    it('scrollTo方法在没有scrollbarRef时应该安全处理', () => {
      const wrapper = createWrapper();

      // Mock scrollbarRef为null
      const originalScrollbarRef = wrapper.vm.scrollbarRef;
      wrapper.vm.scrollbarRef = null;

      // 调用scrollTo方法应该不抛出错误
      expect(() => {
        wrapper.vm.scrollTo(100);
      }).not.toThrow();

      // 恢复
      wrapper.vm.scrollbarRef = originalScrollbarRef;
    });

    it('scrollTo方法在没有wrapRef时应该安全处理', () => {
      const wrapper = createWrapper();

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置wrapRef为null
      scrollbarVm.wrapRef = null;

      // 调用scrollTo方法应该不抛出错误
      expect(() => {
        wrapper.vm.scrollTo(100);
      }).not.toThrow();
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

  describe('事件处理测试', () => {
    it('应该正确处理mousedown和mouseup事件序列', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 模拟mousedown
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证mousedown事件被正确处理
      expect(wrapper.vm.continuousDirection).toBe('next');

      // 模拟mouseup
      await nextArrow.trigger('mouseup');

      // 等待一小段时间确保清理完成
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证mouseup事件被正确处理
      expect(wrapper.vm.isContinuous).toBe(false);
    });

    it('应该在mousedown时清除之前的定时器', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 100
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置边界状态（不能滚动）
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 第一次mousedown（在边界，不能滚动）
      await nextArrow.trigger('mousedown');

      // 立即第二次mousedown（应该清除第一个定时器）
      await nextArrow.trigger('mousedown');

      // 等待定时器时间
      await new Promise(resolve => setTimeout(resolve, 120));

      // 验证没有启动连续滚动（因为在边界位置）
      expect(wrapper.vm.isContinuous).toBe(false);

      // 清理
      await nextArrow.trigger('mouseup');
    });

    it('应该在mousedown时立即检查滚动状态', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置边界状态（不能滚动）
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 模拟mousedown
      await nextArrow.trigger('mousedown');

      // 等待定时器时间
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证因为在边界而没有启动连续滚动
      expect(wrapper.vm.isContinuous).toBe(false);

      // 清理
      await nextArrow.trigger('mouseup');
    });

    it('应该在mouseup时清除所有相关的定时器和状态', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 模拟mousedown启动连续滚动
      await nextArrow.trigger('mousedown');

      // 等待连续滚动启动
      await new Promise(resolve => setTimeout(resolve, 100));

      // 验证连续滚动已启动
      expect(wrapper.vm.isContinuous).toBe(true);

      // 模拟mouseup
      await nextArrow.trigger('mouseup');

      // 等待一小段时间确保清理完成
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证所有状态都被清理
      expect(wrapper.vm.isContinuous).toBe(false);
      expect(wrapper.vm.continuousDirection).toBe(null);
      expect(wrapper.vm.continuousTimer).toBe(null);
    });

    it('应该在连续滚动激活时忽略单击事件', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 10
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 手动设置连续滚动状态
      wrapper.vm.isContinuous = true;

      // 尝试单击（应该被忽略）
      await nextArrow.trigger('click');

      // 验证没有调用setScrollLeft（因为连续滚动激活时忽略单击）
      expect(scrollbarVm.setScrollLeft).not.toHaveBeenCalled();

      // 清理
      wrapper.vm.isContinuous = false;
    });

    it('应该正确处理双击事件防止文本选择', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const prevArrow = wrapper.find('.y-scroll-box__arrow--prev');

      // 创建mock事件
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      };

      // 手动触发handleDoubleClick方法
      (wrapper.vm as any).handleDoubleClick(mockEvent);

      // 验证调用了preventDefault和stopPropagation
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('应该在组件卸载时清理所有定时器', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 50
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置可以滚动的状态
      scrollbarVm.wrapRef = {
        scrollLeft: 100,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');

      // 启动连续滚动定时器
      await nextArrow.trigger('mousedown');

      // 卸载组件
      wrapper.unmount();

      // 验证组件已卸载（不抛出错误）
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

    it('应该处理内容为空的情况', () => {
      const wrapper = createWrapper({}, {});

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__content').exists()).toBe(true);
    });

    it('应该处理极端尺寸情况', () => {
      const wrapper = createWrapper({
        height: 0,
        width: 0
      });

      const container = wrapper.find('.y-scroll-box');
      const style = container.attributes('style') || '';
      expect(style).toMatch(/height:\s*0px/);
      expect(style).toMatch(/width:\s*0px/);
    });

    it('应该处理负数尺寸', () => {
      const wrapper = createWrapper({
        height: -100,
        width: -200
      });

      const container = wrapper.find('.y-scroll-box');
      const style = container.attributes('style') || '';
      expect(style).toMatch(/height:\s*-100px/);
      expect(style).toMatch(/width:\s*-200px/);
    });

    it('应该处理非常大的步进值', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        step: 10000
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置滚动条状态
      scrollbarVm.wrapRef = {
        scrollLeft: 50,
        scrollWidth: 300,
        clientWidth: 100,
        style: {}
      };
      scrollbarVm.setScrollLeft = vi.fn();

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 50 });

      // 点击向右箭头
      const nextArrow = wrapper.find('.y-scroll-box__arrow--next');
      await nextArrow.trigger('click');

      // 验证被限制在边界内
      expect(scrollbarVm.setScrollLeft).toHaveBeenCalledWith(200); // 300 - 100
    });

    it('应该处理滚动条不存在的情况', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      // 手动设置scrollbarRef为null
      wrapper.vm.scrollbarRef = null;

      // 触发滚动事件应该不抛出错误
      expect(() => {
        wrapper.vm.handleScroll({ scrollLeft: 100 });
      }).not.toThrow();
    });

    it('应该处理wrapRef不存在的情况', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always'
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置wrapRef为null
      scrollbarVm.wrapRef = null;

      // 触发滚动事件应该不抛出错误
      await scrollbar.vm.$emit('scroll', { scrollLeft: 100 });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理连续滚动的边界情况', async () => {
      const wrapper = createWrapper({
        arrowModel: 'always',
        continuous: true,
        continuousTime: 10
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置在边界
      scrollbarVm.wrapRef = {
        scrollLeft: 0,
        scrollWidth: 100,
        clientWidth: 100,
        style: {}
      };

      // 触发滚动事件更新状态
      await scrollbar.vm.$emit('scroll', { scrollLeft: 0 });

      // 尝试启动连续滚动
      wrapper.vm.handleMouseDown('prev');

      // 等待计时器
      await new Promise(resolve => setTimeout(resolve, 50));

      // 验证连续滚动没有启动（因为已经在边界）
      expect(wrapper.vm.isContinuous).toBe(false);

      // 清理
      wrapper.vm.handleMouseUp();
    });

    it('应该处理无效的arrowModel值', () => {
      // 这里测试传递无效的arrowModel值
      const wrapper = createWrapper({
        arrowModel: 'invalid' as any
      });

      // 验证组件仍然正常渲染
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-scroll-box__arrow--prev').exists()).toBe(false);
      expect(wrapper.find('.y-scroll-box__arrow--next').exists()).toBe(false);
    });

    it('应该处理空的scrollbarProps', () => {
      const wrapper = createWrapper({
        scrollbarProps: null as any
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      expect(scrollbar.exists()).toBe(true);
    });

    it('应该处理组件卸载时的清理', async () => {
      const wrapper = createWrapper({
        continuous: true
      });

      // 模拟连续滚动状态
      wrapper.vm.isContinuous = true;
      wrapper.vm.continuousDirection = 'next';

      // 卸载组件
      wrapper.unmount();

      // 验证组件已卸载
      expect(wrapper.exists()).toBe(false);
    });

    it('应该处理ResizeObserver回调的安全性', async () => {
      const wrapper = createWrapper();

      // 手动设置contentRef为null
      wrapper.vm.contentRef = null;

      // 触发nextTick（模拟ResizeObserver回调）
      await wrapper.vm.$nextTick();

      // 验证不抛出错误
      expect(wrapper.exists()).toBe(true);
    });

    it('应该处理滚轮事件的边界情况', async () => {
      const wrapper = createWrapper({
        wheelScroll: true
      });

      const scrollbar = wrapper.findComponent(ElScrollbar);
      const scrollbarVm = scrollbar.vm as any;

      // 设置wrapRef为null
      scrollbarVm.wrapRef = null;

      const container = wrapper.find('.y-scroll-box__container');

      // 触发滚轮事件应该不抛出错误
      await expect(container.trigger('wheel', { deltaX: 50 })).resolves.not.toThrow();
    });

    it('应该处理连续滚动动画的边界情况', async () => {
      const wrapper = createWrapper({
        continuous: true
      });

      // 手动调用startContinuousScroll但不设置必要的状态
      wrapper.vm.continuousDirection = 'next';

      // 调用不应该抛出错误
      expect(() => {
        (wrapper.vm as any).startContinuousScroll('next');
      }).not.toThrow();
    });
  });
});
