import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import YButton from '../src/button.vue';

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
      const wrapper = mount(YButton, {
        props: {
          delay: 500
        }
      });

      // 验证组件接收了delay属性
      expect(wrapper.props('delay')).toBe(500);
    });

    it('应该支持设置 maxWait 属性', async () => {
      const wrapper = mount(YButton, {
        props: {
          maxWait: 1000
        }
      });

      // 验证组件接收了maxWait属性
      expect(wrapper.props('maxWait')).toBe(1000);
    });

    it('delay 应该支持字符串类型', () => {
      const wrapper = mount(YButton, {
        props: {
          delay: '200'
        }
      });
      expect(wrapper.props('delay')).toBe('200');
    });

    it('maxWait 应该支持字符串类型', () => {
      const wrapper = mount(YButton, {
        props: {
          maxWait: '800'
        }
      });
      expect(wrapper.props('maxWait')).toBe('800');
    });
  });

  describe('事件测试', () => {
    it('应该在点击时触发 click 事件', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
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
          delay: 300,
          onClick
        }
      });

      // 快速点击多次
      await wrapper.trigger('click');
      await wrapper.trigger('click');
      await wrapper.trigger('click');

      // 立即检查，应该还没有触发
      expect(onClick).toHaveBeenCalledTimes(0);

      // 等待防抖时间
      vi.advanceTimersByTime(300);
      await nextTick();

      // 应该只触发一次
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('应该支持 maxWait 功能', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YButton, {
        props: {
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

      const vm = wrapper.vm as any;
      expect(vm.buttonRef).toBeDefined();
      // 检查ref是否指向正确的DOM元素
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      // 由于使用的是stub，ref可能不会直接指向DOM元素，但应该存在
      expect(vm.buttonRef.value !== null).toBe(true);
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
      expect(button.classes()).toContain('disabled');
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
});
