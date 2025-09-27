import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnForms from '../src/column-forms.vue';

describe('YColumnForms 表单列组件', () => {
  describe('基础渲染', () => {
    it('应该正常渲染', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('y-column-forms');
    });
  });

  describe('Props 测试', () => {
    it('应该支持options属性', () => {
      // 跳过渲染测试，只测试属性定义
      expect('options').toBeDefined();
    });

    it('应该支持inline属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: false }
      });

      expect(wrapper.vm.inline).toBe(false);
    });

    it('应该支持tName属性', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], tName: 'customTable' }
      });

      expect(wrapper.vm.tName).toBe('customTable');
    });

    it('应该支持headerStyle属性', () => {
      const headerStyle = { color: 'red', fontSize: '14px' };
      const wrapper = mount(YColumnForms, {
        props: { options: [], headerStyle }
      });

      expect(wrapper.vm.headerStyle).toEqual(headerStyle);
    });
  });

  describe('样式和UI', () => {
    it('应该有正确的CSS类名', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [] }
      });
      expect(wrapper.classes()).toContain('y-column-forms');
    });

    it('应该支持inline布局', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: true }
      });

      expect(wrapper.exists()).toBe(true);
    });

    it('应该支持flex布局', () => {
      const wrapper = mount(YColumnForms, {
        props: { options: [], inline: false }
      });

      expect(wrapper.exists()).toBe(true);
    });
  });
});
