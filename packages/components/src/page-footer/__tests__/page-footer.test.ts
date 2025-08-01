/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, reactive } from 'vue';
import YPageFooter from '../src/page-footer.vue';

// Mock lodash-es
vi.mock('lodash-es', () => ({
  isNumber: vi.fn((value) => typeof value === 'number')
}));

describe('YPageFooter 组件', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('组件正常渲染', () => {
      const wrapper = mount(YPageFooter);
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.y-page-footer').exists()).toBe(true);
    });

    it('组件名称正确', () => {
      const wrapper = mount(YPageFooter);
      expect(wrapper.vm.$options.name).toBe('YPageFooter');
    });

    it('inheritAttrs 为 true', () => {
      const wrapper = mount(YPageFooter);
      expect(wrapper.vm.$options.inheritAttrs).toBe(true);
    });

    it('默认插槽内容渲染', () => {
      const wrapper = mount(YPageFooter, {
        slots: { default: '<span>页脚内容</span>' }
      });
      expect(wrapper.find('span').exists()).toBe(true);
      expect(wrapper.text()).toBe('页脚内容');
    });
  });

  describe('Props 测试', () => {
    it('height prop 为数字类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: 80 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('height: 80px');
    });

    it('height prop 为字符串类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: '100px' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('height: 100px');
    });

    it('left prop 为数字类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { left: 20 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('left: 20px');
    });

    it('left prop 为字符串类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { left: '30px' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('left: 30px');
    });

    it('right prop 为数字类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { right: 40 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('right: 40px');
    });

    it('right prop 为字符串类型', () => {
      const wrapper = mount(YPageFooter, {
        props: { right: '50px' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('right: 50px');
    });

    it('model prop 为 fixed', async () => {
      const wrapper = mount(YPageFooter, {
        props: { model: 'fixed' }
      });
      await nextTick();
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      // 使用更灵活的匹配方式，处理可能的格式差异
      expect(style).toMatch(/position:\s*fixed/);
    });

    it('model prop 为 absolute', async () => {
      const wrapper = mount(YPageFooter, {
        props: { model: 'absolute' }
      });
      await nextTick();
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      // 使用更灵活的匹配方式，处理可能的格式差异
      expect(style).toMatch(/position:\s*absolute/);
    });

    it('多个 props 同时使用', () => {
      const wrapper = mount(YPageFooter, {
        props: {
          height: 60,
          left: 10,
          right: 20,
          model: 'absolute'
        }
      });
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toContain('height: 60px');
      expect(style).toContain('left: 10px');
      expect(style).toContain('right: 20px');
      expect(style).toContain('bottom: 0');
      expect(style).toMatch(/position:\s*absolute/);
    });
  });

  describe('Model 属性测试', () => {
    it('默认 model 值为 fixed', () => {
      const wrapper = mount(YPageFooter);
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toMatch(/position:\s*fixed/);
    });

    it('model 为 fixed 时使用固定定位', () => {
      const wrapper = mount(YPageFooter, {
        props: { model: 'fixed' }
      });
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toMatch(/position:\s*fixed/);
    });

    it('model 为 absolute 时使用绝对定位', () => {
      const wrapper = mount(YPageFooter, {
        props: { model: 'absolute' }
      });
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toMatch(/position:\s*absolute/);
    });

    it('model 属性与其他样式属性共存', () => {
      const wrapper = mount(YPageFooter, {
        props: {
          height: 80,
          left: 20,
          right: 30,
          model: 'absolute'
        }
      });
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toContain('height: 80px');
      expect(style).toContain('left: 20px');
      expect(style).toContain('right: 30px');
      expect(style).toContain('bottom: 0');
      expect(style).toMatch(/position:\s*absolute/);
    });
  });

  describe('默认样式测试', () => {
    it('无 props 时使用默认样式', () => {
      const wrapper = mount(YPageFooter);
      const element = wrapper.find('.y-page-footer');
      const style = element.attributes('style');
      expect(style).toContain('height: 56px');
      expect(style).toContain('left: 0');
      expect(style).toContain('right: 0');
      expect(style).toContain('bottom: 0');
      expect(style).toMatch(/position:\s*fixed/);
    });

    it('bottom 始终为 0', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: 100, left: 50, right: 50 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('bottom: 0');
    });
  });

  describe('边界值测试', () => {
    it('height 为 0', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: 0 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('height: 0px');
    });

    it('left 为 0', () => {
      const wrapper = mount(YPageFooter, {
        props: { left: 0 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('left: 0px');
    });

    it('right 为 0', () => {
      const wrapper = mount(YPageFooter, {
        props: { right: 0 }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('right: 0px');
    });

    it('height 为空字符串', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: '' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('height: 56px');
    });

    it('left 为空字符串', () => {
      const wrapper = mount(YPageFooter, {
        props: { left: '' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('left: 0');
    });

    it('right 为空字符串', () => {
      const wrapper = mount(YPageFooter, {
        props: { right: '' }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('right: 0');
    });

    it('height 为 undefined', () => {
      const wrapper = mount(YPageFooter, {
        props: { height: undefined }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('height: 56px');
    });

    it('left 为 undefined', () => {
      const wrapper = mount(YPageFooter, {
        props: { left: undefined }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('left: 0');
    });

    it('right 为 undefined', () => {
      const wrapper = mount(YPageFooter, {
        props: { right: undefined }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('style')).toContain('right: 0');
    });
  });

  describe('属性继承测试', () => {
    it('继承自定义属性', () => {
      const wrapper = mount(YPageFooter, {
        attrs: {
          'data-testid': 'page-footer',
          class: 'custom-class',
          style: 'background-color: red;'
        }
      });
      const element = wrapper.find('.y-page-footer');
      expect(element.attributes('data-testid')).toBe('page-footer');
      expect(element.attributes('class')).toContain('custom-class');
      expect(element.attributes('style')).toContain('background-color: red');
    });

    it('继承事件监听器', async () => {
      const onClick = vi.fn();
      const wrapper = mount(YPageFooter, {
        attrs: {
          onClick
        }
      });

      await wrapper.find('.y-page-footer').trigger('click');
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('响应式更新测试', () => {
    it('props 更新时样式重新计算', async () => {
      const wrapper = mount(YPageFooter, {
        props: { height: 60 }
      });

      expect(wrapper.find('.y-page-footer').attributes('style')).toContain('height: 60px');

      await wrapper.setProps({ height: 80 });
      await nextTick();

      expect(wrapper.find('.y-page-footer').attributes('style')).toContain('height: 80px');
    });

    it('model 属性更新时样式重新计算', async () => {
      const wrapper = mount(YPageFooter, {
        props: { model: 'fixed' }
      });

      expect(wrapper.find('.y-page-footer').attributes('style')).toContain('position: fixed');

      await wrapper.setProps({ model: 'absolute' });
      await nextTick();

      expect(wrapper.find('.y-page-footer').attributes('style')).toContain('position: absolute');
    });
  });
});
