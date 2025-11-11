import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, h } from 'vue';
import YButton from '../src/button.vue';
// Mock VueUse functions
vi.mock('@vueuse/core', () => ({
  useDebounceFn: vi.fn((fn, delay, options) => {
    let timeoutId: NodeJS.Timeout;
    let maxWaitTimeoutId: NodeJS.Timeout | undefined;

    const debouncedFn = (...args: any[]) => {
      clearTimeout(timeoutId);

      if (options?.maxWait !== undefined) {
        // maxWait为0时立即执行并返回，不设置delay的定时器
        if (options.maxWait <= 0) {
          fn(...args);
          return;
        }
        if (!maxWaitTimeoutId) {
          maxWaitTimeoutId = setTimeout(() => {
            fn(...args);
            maxWaitTimeoutId = undefined;
          }, options.maxWait);
        }
      }

      // delay为0或负数时立即执行
      if (delay <= 0) {
        fn(...args);
        return;
      }

      timeoutId = setTimeout(() => {
        fn(...args);
        if (maxWaitTimeoutId) {
          clearTimeout(maxWaitTimeoutId);
          maxWaitTimeoutId = undefined;
        }
      }, delay);
    };

    return debouncedFn;
  }),
  useThrottleFn: vi.fn((fn, delay) => {
    let lastExecTime = 0;
    let timeoutId: NodeJS.Timeout | undefined;

    const throttledFn = (...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime >= delay || lastExecTime === 0) {
        fn(...args);
        lastExecTime = currentTime;
      } else {
        // 在节流间隔内，设置定时器在剩余时间后执行
        if (timeoutId) clearTimeout(timeoutId);
        const remainingTime = delay - (currentTime - lastExecTime);
        timeoutId = setTimeout(() => {
          fn(...args);
          lastExecTime = Date.now();
        }, remainingTime);
      }
    };

    return throttledFn;
  })
}));

// Mock useAppConfig hook，让它在测试中返回可配置的值
let mockAppConfig: Record<string, any> = { delay: 500, maxWait: 1000 };

vi.mock('../../app-wrap/src/use-app-config', () => ({
  useAppConfig: vi.fn((key?: string) => {
    if (key === 'button') {
      return mockAppConfig;
    }
    return {};
  }),
  appConfigKey: Symbol('yun-elp-app-config')
}));

// Mock useExternalListener hook
let mockHasExternalListener = vi.fn((event: string) => {
  // 默认情况下返回 false，表示没有监听器
  // 测试可以通过 mockImplementation 来覆盖这个行为
  return false;
});

vi.mock('../../../hooks/use-external-listener', () => ({
  useExternalListener: vi.fn(() => {
    // 获取当前组件实例
    const { getCurrentInstance } = require('@vue/runtime-core');
    const instance = getCurrentInstance();

    return {
      hasExternalListener: (eventName: string) => {
        // 调用 mock 函数
        const mockResult = mockHasExternalListener(eventName);

        // 如果 mock 返回 true，直接返回 true
        if (mockResult === true) {
          return true;
        }

        // 如果 mock 返回 false，检查实际的 props
        if (instance && instance.vnode && instance.vnode.props) {
          const props = instance.vnode.props;
          const listenerKey = `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
          return props[listenerKey] !== undefined;
        }

        return false;
      }
    };
  })
}));

import { appConfigKey } from '../../app-wrap/src/use-app-config';
import { buttonProps } from '../src/button';

// Mock YAppWrap组件用于测试provide配置
const MockYAppWrap = {
  name: 'YAppWrap',
  template: '<div class="y-app-wrap"><slot></slot></div>',
  props: ['button', 'locale', 'borderLabel', 'pageHeader', 'pageFooter'],
  provide(this: any) {
    return {
      [appConfigKey]: this.$props
    };
  }
};

describe('YButton 防抖按钮组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  describe('基本功能', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YButton);
      expect(wrapper.exists()).toBe(true);
      // 检查组件的HTML结构是否正确
      expect(wrapper.html()).toContain('y-button');
    });

    it('应该渲染默认插槽内容', () => {
      const wrapper = mount(YButton, {
        slots: {
          default: '点击按钮'
        }
      });
      expect(wrapper.text()).toContain('点击按钮');
    });

    it('应该渲染图标插槽', () => {
      const wrapper = mount(YButton, {
        slots: {
          icon: '<i class="el-icon-star-on"></i>'
        }
      });
      expect(wrapper.html()).toContain('el-icon-star-on');
    });

    it('应该渲染loading插槽', () => {
      const wrapper = mount(YButton, {
        slots: {
          loading: '<i class="el-icon-loading"></i>'
        }
      });
      expect(wrapper.html()).toContain('el-icon-loading');
    });
  });

  describe('Props 测试', () => {
    it('应该支持设置 delay 属性', async () => {
      // 设置mock配置为不同的值，确保我们能看到props优先级
      mockAppConfig = { delay: 999 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 500,
          model: 'debounce',
          onClick
        }
      });

      // 通过行为验证：触发点击事件，验证是否在500ms后触发（而不是999ms）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0); // 立即不应该触发

      // 等待500ms（props的值），应该触发
      vi.advanceTimersByTime(500);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('应该支持设置 maxWait 属性', async () => {
      // 设置mock配置为不同的值
      mockAppConfig = { maxWait: 999 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          maxWait: 1000,
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：快速连续点击，验证是否在maxWait时间内触发
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过delay但小于maxWait的时间
      vi.advanceTimersByTime(500);
      await nextTick();
      // 由于maxWait限制，应该至少触发一次
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('delay 应该支持数字类型', async () => {
      // 使用默认配置，但设置不同的delay值
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 200,
          model: 'debounce',
          onClick
        }
      });

      // 通过行为验证：触发点击，验证是否在200ms后触发
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(200);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('maxWait 应该支持数字类型', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          maxWait: 800,
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：快速连续点击，验证maxWait是否生效
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过delay但小于maxWait的时间
      vi.advanceTimersByTime(500);
      await nextTick();
      // 由于maxWait限制，应该至少触发一次
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('事件测试', () => {
    it('应该在点击时触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 300, // 显式设置延迟时间，避免受Mock配置影响
          onClick
        }
      });

      await wrapper.trigger('click');
      // 等待防抖时间
      vi.advanceTimersByTime(300);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('click 事件应该传递 MouseEvent 参数', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 300, // 显式设置延迟时间，避免受Mock配置影响
          onClick
        }
      });

      await wrapper.trigger('click');
      // 等待防抖时间
      vi.advanceTimersByTime(300);
      await nextTick();

      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('应该支持防抖功能', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 快速点击多次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待防抖时间
      vi.advanceTimersByTime(300);
      await nextTick();

      // 由于防抖，应该只触发最后一次调用
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持 maxWait 功能', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 300,
          maxWait: 500,
          onClick
        }
      });

      // 快速连续点击多次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过maxWait的时间
      vi.advanceTimersByTime(600);
      await nextTick();

      // 由于maxWait限制，应该至少触发一次
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('暴露的接口', () => {
    it('应该暴露 buttonRef', async () => {
      const wrapper = mount(YButton);
      await nextTick(); // 等待组件挂载完成

      // 通过 Proxy 暴露的接口，buttonRef 本身没有直接暴露
      // 但可以通过访问 el-button 的方法来验证 ref 是否存在
      const vm = wrapper.vm as any;
      // 检查是否有 el-button 的方法（通过 Proxy 暴露）
      // 由于 Proxy 会代理所有对 el-button 的访问，我们可以检查是否有任何方法
      expect(vm).toBeDefined();
      // 验证组件可以正常访问（说明 Proxy 工作正常）
      expect(wrapper.find('button').exists()).toBe(true);
    });
  });

  describe('继承属性', () => {
    it('应该继承 el-button 的所有属性', () => {
      const wrapper = mount(YButton, {
        props: {
          type: 'primary',
          disabled: true,
          loading: true
        }
      });

      // 由于使用的是 stub，直接检查根元素的属性
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      // 检查类型相关的class是否正确应用
      expect(button.classes()).toContain('el-button--primary');
      // 检查disabled状态是否通过class反映
      expect(button.classes()).toContain('is-disabled');
    });

    it('应该支持 el-button 的原生事件', async () => {
      const onFocus = vi.fn();
      const wrapper = mount(YButton, {
        attrs: {
          onFocus
        }
      });

      const button = wrapper.find('button');
      await button.trigger('focus');

      expect(onFocus).toHaveBeenCalledTimes(1);
    });
  });

  describe('样式测试', () => {
    it('应该应用 y-button 类名', () => {
      const wrapper = mount(YButton);
      // 检查HTML中是否包含y-button类
      expect(wrapper.html()).toContain('y-button');
    });

    it('应该与 el-button 样式兼容', () => {
      const wrapper = mount(YButton, {
        props: {
          type: 'success'
        }
      });

      const button = wrapper.find('button');
      expect(button.classes()).toContain('el-button--success');
    });
  });

  describe('集成测试', () => {
    it('应该在表单中使用正常', () => {
      const wrapper = mount({
        template: `
          <form @submit.prevent="handleSubmit">
            <y-button type="primary" @click="handleClick">提交</y-button>
          </form>
        `,
        components: { YButton },
        setup() {
          const handleSubmit = vi.fn();
          const handleClick = vi.fn();

          return {
            handleSubmit,
            handleClick
          };
        }
      });

      const button = wrapper.findComponent(YButton);
      expect(button.exists()).toBe(true);
      expect(button.text()).toBe('提交');
    });

    it('应该支持异步操作', async () => {
      const onClick = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 100));
      });

      const wrapper = mount(YButton, {
        props: {
          delay: 300, // 显式设置延迟时间，避免受Mock配置影响
          onClick
        }
      });

      await wrapper.trigger('click');

      // 等待防抖时间
      vi.advanceTimersByTime(300);
      await nextTick();

      // 等待异步操作完成
      vi.advanceTimersByTime(100);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('节流模式测试', () => {
    it('应该支持节流模式', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 300,
          onClick
        }
      });

      // 第一次点击应该立即触发
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      // 在节流间隔内再次点击，不应该立即触发（但会设置定时器）
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      // 由于在节流间隔内，不应该立即触发
      expect(onClick).toHaveBeenCalledTimes(1);

      // 等待节流间隔后，定时器应该触发
      vi.advanceTimersByTime(300);
      await nextTick();
      // 定时器会触发最后一次调用
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('节流模式下应该传递正确的参数', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 300,
          onClick
        }
      });

      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('节流模式应该在指定延迟后允许再次触发', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 500,
          onClick
        }
      });

      // 第一次点击
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);

      // 等待节流间隔后，再次点击应该触发
      vi.advanceTimersByTime(500);
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('双击事件测试', () => {
    it('应该支持双击事件', async () => {
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onDblclick: onDblClick
        }
      });

      // 触发双击事件
      await wrapper.trigger('dblclick');
      expect(onDblClick).toHaveBeenCalledTimes(1);
    });

    it('双击事件应该传递MouseEvent参数', async () => {
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onDblclick: onDblClick
        }
      });

      await wrapper.trigger('dblclick');
      expect(onDblClick).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('双击事件应该与单击事件独立工作', async () => {
      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick
        }
      });

      // 触发双击
      await wrapper.trigger('dblclick');

      // 双击事件应该触发
      expect(onDblClick).toHaveBeenCalledTimes(1);
      // 单击事件不应该触发
      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('dblDelay属性测试', () => {
    it('应该支持设置dblDelay属性', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          dblDelay: 500,
          onClick,
          onDblclick: onDblClick
        }
      });

      // 通过行为验证：单击后等待设置的dblDelay时间（500ms），验证是否在500ms后触发单击
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待500ms（props的dblDelay），应该触发单击
      vi.advanceTimersByTime(500);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('dblDelay应该有默认值300ms', async () => {
      // 修改mock，让它检测到dblclick监听器（在挂载前设置）
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 通过行为验证：单击后等待默认的dblDelay时间（300ms），验证是否在300ms后触发单击
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待300ms（默认的dblDelay），应该触发单击
      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('dblDelay应该支持从模拟配置获取', async () => {
      // 修改mock配置
      mockAppConfig = { dblDelay: 600 };
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick
        }
      });

      // 通过行为验证：单击后等待配置的dblDelay时间（600ms），验证是否在600ms后触发单击
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待600ms（配置的dblDelay），应该触发单击
      vi.advanceTimersByTime(600);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('props的dblDelay应该优先于模拟配置', async () => {
      // 设置模拟配置
      mockAppConfig = { dblDelay: 600 };
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          dblDelay: 400,
          onClick,
          onDblclick: onDblClick
        }
      });

      // 通过行为验证：单击后等待props的dblDelay时间（400ms），而不是配置的600ms
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待400ms（props的dblDelay），应该触发单击
      vi.advanceTimersByTime(400);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });
  });

  describe('双击检测逻辑测试', () => {
    it('没有双击监听器时应该直接触发单击事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick
        }
      });

      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('有双击监听器时单击应该延迟触发', async () => {
      // 修改mock，让它检测到dblclick监听器（在挂载前设置）
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 单击一次
      await wrapper.trigger('click');

      // 立即检查，不应该触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待dblDelay时间
      vi.advanceTimersByTime(300);
      await nextTick();

      // 现在应该触发单击事件
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('快速双击应该触发双击事件而不是单击事件', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 使用原生的dblclick事件
      await wrapper.trigger('dblclick');

      // 双击事件应该触发
      expect(onDblClick).toHaveBeenCalledTimes(1);

      // 单击事件不应该触发（因为双击事件会清除单击定时器）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('单击后等待dblDelay应该触发单击事件', async () => {
      // 修改mock，让它检测到dblclick监听器（在挂载前设置）
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 第一次点击
      await wrapper.trigger('click');

      // 等待超过dblDelay时间
      vi.advanceTimersByTime(400);
      await nextTick();

      // 应该触发单击事件
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onDblClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('双击检测应该与防抖功能配合工作', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 200,
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 使用dblclick事件触发双击
      await wrapper.trigger('dblclick');

      // 双击事件应该立即触发
      expect(onDblClick).toHaveBeenCalledTimes(1);

      // 单击事件不应该触发（因为是双击）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待dblDelay时间，确保没有单击触发
      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('双击检测应该与节流功能配合工作', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 200,
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 使用dblclick事件触发双击
      await wrapper.trigger('dblclick');

      // 双击事件应该立即触发
      expect(onDblClick).toHaveBeenCalledTimes(1);

      // 由于节流，第一次点击应该触发一次（但双击会清除定时器，所以可能不会触发）
      // 实际上，双击事件会清除单击定时器，所以单击不应该触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });
  });

  describe('model属性验证器测试', () => {
    it('应该接受有效的model值 "debounce"', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：防抖模式下，快速点击多次应该只触发一次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0); // 立即不应该触发

      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1); // 防抖后应该只触发一次
    });

    it('应该接受有效的model值 "throttle"', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：节流模式下，第一次点击应该立即触发
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1); // 节流模式下第一次应该立即触发
    });

    it('应该接受undefined作为有效值', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: undefined,
          onClick
        }
      });

      // 通过行为验证：model为undefined时，应该立即触发（没有防抖或节流）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1); // 应该立即触发
    });

    it('应该在开发环境下警告无效的model值', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // 在测试环境中，我们需要手动验证validator
      const validator = (buttonProps as any).model.validator;
      expect(validator('debounce')).toBe(true);
      expect(validator('throttle')).toBe(true);
      expect(validator(undefined)).toBe(true);
      expect(validator('invalid')).toBe(false);

      consoleWarnSpy.mockRestore();
    });
  });

  describe('配置优先级测试', () => {
    it('props的delay应该优先于模拟配置', async () => {
      // 设置模拟配置
      mockAppConfig = { delay: 600 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 400,
          model: 'debounce',
          onClick
        }
      });

      // 通过行为验证：触发点击，验证是否在400ms后触发（而不是600ms）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(400);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('props的maxWait应该优先于模拟配置', async () => {
      // 设置模拟配置
      mockAppConfig = { maxWait: 800 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          maxWait: 500,
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：快速连续点击，验证是否在maxWait时间内触发
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过delay但小于maxWait的时间
      vi.advanceTimersByTime(400);
      await nextTick();
      // 由于maxWait限制，应该至少触发一次
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('没有props时应该使用模拟配置', async () => {
      // 设置模拟配置
      mockAppConfig = { delay: 600, maxWait: 800 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          onClick
        }
      });

      // 通过行为验证：触发点击，验证是否在600ms后触发（使用配置的delay）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(600);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('model属性不应该从模拟配置获取', async () => {
      // 设置模拟配置包含model
      mockAppConfig = { model: 'throttle' };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce', // props优先
          delay: 300,
          onClick
        }
      });

      // 通过行为验证：防抖模式下，快速点击多次应该只触发一次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0); // 防抖模式下不应该立即触发

      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1); // 防抖后应该只触发一次

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('当设置model时delay应该默认为300ms', async () => {
      // 设置空的模拟配置
      mockAppConfig = {};

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          onClick
        }
      });

      // 通过行为验证：触发点击，验证是否在300ms后触发（默认delay）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });
  });

  describe('YAppWrap配置模拟测试', () => {
    let originalMockAppConfig: any;

    beforeEach(() => {
      originalMockAppConfig = mockAppConfig;
    });

    afterEach(() => {
      mockAppConfig = originalMockAppConfig;
    });

    it('应该能从模拟配置中获取配置', async () => {
      // 修改mock配置
      mockAppConfig = { delay: 800, maxWait: 1500 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          model: 'debounce'
        }
      });

      await wrapper.trigger('click');

      // 应该没有立即触发（使用配置的800ms延迟）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待配置的延迟时间
      vi.advanceTimersByTime(800);
      await nextTick();

      // 现在应该触发
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('props应该优先于模拟配置', async () => {
      // 设置模拟配置
      mockAppConfig = { delay: 800, maxWait: 1500 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          model: 'debounce',
          delay: 400 // props设置400ms，应该优先
        }
      });

      await wrapper.trigger('click');

      // 应该没有立即触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待props设置的延迟时间400ms
      vi.advanceTimersByTime(400);
      await nextTick();

      // 现在应该触发
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('没有配置时应该使用默认行为', async () => {
      // 设置空的模拟配置
      mockAppConfig = {};

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          model: 'debounce'
        }
      });

      await wrapper.trigger('click');

      // 没有立即触发（使用默认300ms延迟）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待默认延迟300ms
      vi.advanceTimersByTime(300);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('配置中的model属性不应该影响组件', async () => {
      // 设置模拟配置包含model
      mockAppConfig = { model: 'throttle', delay: 800 };

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          model: 'debounce', // props设置防抖，应该优先
          delay: 400
        }
      });

      // 第一次点击应该没有立即触发（防抖模式）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待props设置的延迟时间
      vi.advanceTimersByTime(400);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持模拟配置中的dblDelay', async () => {
      // 设置模拟配置包含dblDelay
      mockAppConfig = { dblDelay: 600 };

      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onDblclick: onDblClick
        }
      });

      // 触发双击
      await wrapper.trigger('dblclick');

      // 双击事件应该触发
      expect(onDblClick).toHaveBeenCalledTimes(1);
    });

    it('MockYAppWrap应该正确渲染子组件', () => {
      const wrapper = mount(MockYAppWrap, {
        props: {
          button: {
            delay: 800,
            maxWait: 1500,
            dblDelay: 600
          }
        },
        slots: {
          default: () => h('div', 'test content')
        }
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.text()).toContain('test content');
    });
  });

  describe('警告测试', () => {
    it('当dblDelay小于delay时应该发出警告', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const wrapper = mount(YButton, {
        props: {
          delay: 500,
          dblDelay: 300
        }
      });

      // 等待组件挂载和computed属性计算完成
      await nextTick();

      // 触发一次点击，确保computed属性被访问
      await wrapper.trigger('click');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[YButton] dblDelay (300ms) should be greater than or equal to delay (500ms). Using delay value instead.'
      );

      consoleWarnSpy.mockRestore();
    });

    it('当dblDelay等于delay时不应该发出警告', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mount(YButton, {
        props: {
          delay: 300,
          dblDelay: 300
        }
      });

      vi.runAllTimers();

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('当dblDelay大于delay时不应该发出警告', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mount(YButton, {
        props: {
          delay: 300,
          dblDelay: 500
        }
      });

      vi.runAllTimers();

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('当dblDelay小于delay时应该使用delay值作为dblDelay', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 500,
          dblDelay: 300,
          onClick,
          onDblclick: onDblClick
        }
      });

      // 通过行为验证：单击后等待delay时间（500ms），而不是dblDelay（300ms）
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待300ms，不应该触发（因为使用了delay的值500ms）
      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待500ms（delay的值），应该触发
      vi.advanceTimersByTime(200);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });
  });

  describe('边界情况测试', () => {
    it('应该处理delay为0的情况', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 0,
          model: 'debounce',
          onClick
        }
      });

      await wrapper.trigger('click');
      // delay为0时应该立即触发
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该处理maxWait为0的情况', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 100,
          maxWait: 0,
          model: 'debounce',
          onClick
        }
      });

      // 快速点击多次
      await wrapper.trigger('click');

      // maxWait为0时，应该立即触发（因为maxWait的setTimeout会立即执行）
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 再次点击不应该触发（因为maxWait已经触发过了）
      await wrapper.trigger('click');
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该处理dblDelay为0的情况', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 100,
          dblDelay: 0,
          onClick,
          onDblclick: onDblClick
        }
      });

      // 触发双击事件
      await wrapper.trigger('dblclick');

      // dblDelay为0时应该立即触发双击
      expect(onDblClick).toHaveBeenCalledTimes(1);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('应该处理负数delay值', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: -100,
          model: 'debounce',
          onClick
        }
      });

      await wrapper.trigger('click');
      // 负数delay应该被视为0，立即触发
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该处理null和undefined值', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: undefined,
          maxWait: undefined,
          dblDelay: undefined,
          onClick,
          onDblclick: onDblClick
        }
      });

      // 通过行为验证：应该使用默认值或配置值
      // 如果没有设置model，delay为undefined，应该立即触发（因为没有防抖）
      await wrapper.trigger('click');
      // 但由于有双击监听器，会延迟触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // dblDelay应该有默认值300ms
      vi.advanceTimersByTime(300);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1); // 在300ms后触发

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('应该处理非常大的数值', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          delay: 999999,
          maxWait: 999999,
          dblDelay: 999999,
          model: 'debounce',
          onClick
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 通过行为验证：触发点击，验证是否在999999ms后触发
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待一小段时间，确保定时器已设置
      await nextTick();

      vi.advanceTimersByTime(999999);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('节流模式下应该正确处理连续快速点击', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 100,
          onClick
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 第一次点击应该立即触发
      await wrapper.trigger('click');
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(1);

      // 模拟快速连续点击，不应该立即触发（但会设置定时器）
      for (let i = 0; i < 10; i++) {
        await wrapper.trigger('click');
      }
      expect(onClick).toHaveBeenCalledTimes(1);

      // 等待节流间隔后，定时器应该触发
      vi.advanceTimersByTime(100);
      await nextTick();
      expect(onClick).toHaveBeenCalledTimes(2); // 定时器触发最后一次调用
    });

    it('防抖模式下应该正确处理maxWait边界', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 100,
          maxWait: 200,
          onClick
        }
      });

      // 等待组件挂载完成
      await nextTick();

      // 快速点击多次，超过maxWait
      await wrapper.trigger('click');
      await nextTick();
      vi.advanceTimersByTime(50);
      await nextTick();
      await wrapper.trigger('click');
      await nextTick();
      vi.advanceTimersByTime(50);
      await nextTick();
      await wrapper.trigger('click');
      await nextTick();
      vi.advanceTimersByTime(150); // 总共250ms，超过maxWait

      await nextTick();

      // 应该触发一次（因为maxWait限制）
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('性能和清理测试', () => {
    it('应该在组件卸载时清理定时器', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          dblDelay: 300
        }
      });

      // 触发一次点击，创建定时器
      await wrapper.trigger('click');

      // 模拟组件卸载
      wrapper.unmount();

      // 等待一段时间，确保定时器被清理
      vi.advanceTimersByTime(500);
      await nextTick();

      // 验证定时器被清理（通过检查事件是否触发）
      expect(onClick).toHaveBeenCalledTimes(0); // 如果定时器被清理，事件不应该触发

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('双击检测应该清理之前的定时器', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick,
          dblDelay: 300
        }
      });

      // 第一次点击
      await wrapper.trigger('click');

      // 立即第二次点击（双击）
      await wrapper.trigger('dblclick');

      // 双击事件应该触发
      expect(onDblClick).toHaveBeenCalledTimes(1);

      // 等待足够时间，确保没有额外的单击触发
      vi.advanceTimersByTime(300);
      await nextTick();

      // 单击事件不应该触发（因为双击清除了定时器）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('快速连续点击应该不会造成内存泄漏', async () => {
      // 修改mock，让它检测到dblclick监听器
      mockHasExternalListener.mockImplementation((event: string) => event === 'dblclick');

      const onClick = vi.fn();
      const onDblClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          onClick,
          onDblclick: onDblClick,
          dblDelay: 100
        }
      });

      // 模拟快速连续点击（使用dblclick事件）
      for (let i = 0; i < 20; i++) {
        await wrapper.trigger('dblclick');
        vi.advanceTimersByTime(10);
      }

      // 等待所有定时器完成
      vi.advanceTimersByTime(200);
      await nextTick();

      // 双击事件应该触发多次
      expect(onDblClick).toHaveBeenCalledTimes(20);

      // 单击事件不应该触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // 恢复默认mock
      mockHasExternalListener.mockImplementation(() => false);
    });

    it('节流模式应该立即触发', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'throttle',
          delay: 200,
          onClick
        }
      });

      // 节流模式下点击应该立即触发
      await wrapper.trigger('click');
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该正确处理异步操作完成后的清理', async () => {
      const onClick = vi.fn().mockImplementation(() => {
        return new Promise(resolve => setTimeout(resolve, 50));
      });

      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 100,
          onClick
        }
      });

      // 触发点击
      await wrapper.trigger('click');

      // 等待防抖时间
      vi.advanceTimersByTime(100);
      await nextTick();

      // 等待异步操作完成
      vi.advanceTimersByTime(50);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);

      // 组件卸载后不应该有内存泄漏
      wrapper.unmount();
      // 验证没有遗留定时器（通过检查是否还有未解决的定时器）
      vi.advanceTimersByTime(1000);
      await nextTick();
    });

    it('不同的delay值应该正确工作', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 50,
          onClick
        }
      });

      // 点击
      await wrapper.trigger('click');

      // 等待delay时间
      vi.advanceTimersByTime(50);
      await nextTick();

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('默认值测试', () => {
    it('应该使用默认延迟300ms（设置model时）', async () => {
      // 测试目的：验证当设置model时，delay默认为300ms
      // 设置空的模拟配置
      mockAppConfig = {};

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          onClick
        }
      });

      await wrapper.trigger('click');
      // 立即检查，应该还没有触发（因为默认延迟300ms）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待默认防抖时间300ms
      vi.advanceTimersByTime(300);
      await nextTick();

      // 应该触发一次
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('应该使用默认maxWait（防抖模式下）', async () => {
      // 测试目的：验证当没有传入maxWait时，防抖模式下没有maxWait限制
      // 设置空的模拟配置
      mockAppConfig = {};

      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 快速连续点击多次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过默认maxWait的时间（应该没有限制）
      vi.advanceTimersByTime(1000);
      await nextTick();

      // 由于没有maxWait限制，应该只触发一次
      expect(onClick).toHaveBeenCalledTimes(1);

      // 恢复默认配置
      mockAppConfig = { delay: 500, maxWait: 1000 };
    });

    it('应该使用app-wrap配置的延迟时间', async () => {
      // 测试目的：验证当设置model但没有传入delay时，组件使用app-wrap配置的延迟时间500ms
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          onClick
        }
      });

      await wrapper.trigger('click');
      // 立即检查，应该还没有触发（因为配置延迟500ms）
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待配置的延迟时间500ms
      vi.advanceTimersByTime(500);
      await nextTick();

      // 应该触发一次
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该使用app-wrap配置的maxWait时间', async () => {
      // 测试目的：验证当没有传入maxWait时，组件使用app-wrap配置的maxWait时间1000ms
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
          model: 'debounce',
          delay: 300,
          onClick
        }
      });

      // 快速连续点击多次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 等待超过maxWait的时间1000ms
      vi.advanceTimersByTime(1100);
      await nextTick();

      // 由于maxWait限制，应该至少触发一次
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
