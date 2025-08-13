import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YGroupSelect from '../src/group-select.vue';
import type { GroupSelectOption } from '../src/group-select';

describe('YGroupSelect', () => {
  const mockOptions: GroupSelectOption[] = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3', disabled: true }
  ];

  const baseProps = {
    options: mockOptions,
    modelValue: '1'
  };

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('y-group-select');
    });

    it('应该渲染按钮组', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      expect(wrapper.find('.el-button-group').exists()).toBe(true);
    });

    it('应该根据 options 渲染正确的按钮数量', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('选项渲染', () => {
    it('应该正确显示选项的 label', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].text()).toBe('选项1');
      expect(buttons[1].text()).toBe('选项2');
      expect(buttons[2].text()).toBe('选项3');
    });

    it('应该处理空选项数组', () => {
      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: []
        }
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons).toHaveLength(0);
    });

    it('应该支持自定义插槽内容', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps,
        slots: {
          default: (props) => `自定义: ${props.item.label}`
        }
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].text()).toBe('自定义: 选项1');
      expect(buttons[1].text()).toBe('自定义: 选项2');
      expect(buttons[2].text()).toBe('自定义: 选项3');
    });
  });

  describe('选中状态', () => {
    it('应该正确显示选中状态', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].classes()).toContain('el-button--primary');
      expect(buttons[1].classes()).toContain('el-button--default');
      expect(buttons[2].classes()).toContain('el-button--default');
    });

    it('应该正确更新选中状态', async () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      await wrapper.setProps({ modelValue: '2' });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].classes()).toContain('el-button--default');
      expect(buttons[1].classes()).toContain('el-button--primary');
      expect(buttons[2].classes()).toContain('el-button--default');
    });
  });

  describe('事件触发', () => {
    it('应该触发 update:modelValue 事件', async () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      await buttons[1].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
    });

    it('应该触发 change 事件', async () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      await buttons[1].trigger('click');

      expect(wrapper.emitted('change')).toBeTruthy();
      const changeEvent = wrapper.emitted('change')?.[0]?.[0];
      expect(changeEvent).toEqual({
        value: '2',
        item: mockOptions[1],
        index: 1
      });
    });

    it('点击已选中的选项不应该触发事件', async () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      await buttons[0].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('change')).toBeFalsy();
    });

    it('点击禁用的选项不应该触发事件', async () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      await buttons[2].trigger('click');

      expect(wrapper.emitted('update:modelValue')).toBeFalsy();
      expect(wrapper.emitted('change')).toBeFalsy();
    });
  });

  describe('样式应用', () => {
    it('应该应用 itemClass', () => {
      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          itemClass: 'custom-class'
        }
      });

      const buttons = wrapper.findAll('.el-button');
      buttons.forEach(button => {
        expect(button.classes()).toContain('custom-class');
      });
    });

    it('应该应用 itemStyles', () => {
      const customStyles = { backgroundColor: 'red', color: 'white' };
      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          itemStyles: customStyles
        }
      });

      const buttons = wrapper.findAll('.el-button');
      buttons.forEach(button => {
        expect(button.attributes('style')).toContain('background-color: red');
        expect(button.attributes('style')).toContain('color: white');
      });
    });
  });

  describe('禁用状态', () => {
    it('应该正确渲染禁用选项', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[2].attributes('disabled')).toBeDefined();
    });

    it('应该处理所有选项都禁用的情况', () => {
      const disabledOptions: GroupSelectOption[] = [
        { label: '禁用选项1', value: '1', disabled: true },
        { label: '禁用选项2', value: '2', disabled: true }
      ];

      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: disabledOptions
        }
      });

      const buttons = wrapper.findAll('.el-button');
      buttons.forEach(button => {
        expect(button.attributes('disabled')).toBeDefined();
      });
    });
  });

  describe('图标和加载状态', () => {
    it('应该支持图标', () => {
      const optionsWithIcon: GroupSelectOption[] = [
        { label: '选项1', value: '1', icon: 'el-icon-edit' },
        { label: '选项2', value: '2', icon: 'el-icon-delete' }
      ];

      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: optionsWithIcon
        }
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].attributes('icon')).toBe('el-icon-edit');
      expect(buttons[1].attributes('icon')).toBe('el-icon-delete');
    });

    it('应该支持加载状态', () => {
      const optionsWithLoading: GroupSelectOption[] = [
        { label: '选项1', value: '1', loading: true },
        { label: '选项2', value: '2', loading: false }
      ];

      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: optionsWithLoading
        }
      });

      const buttons = wrapper.findAll('.el-button');
      expect(buttons[0].attributes('loading')).toBe('true');
      expect(buttons[1].attributes('loading')).toBe('false');
    });
  });

  describe('插槽功能', () => {
    it('应该支持 icon 插槽', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps,
        slots: {
          icon: '<span class="custom-icon">图标</span>'
        }
      });

      expect(wrapper.find('.custom-icon').exists()).toBe(true);
    });

    it('应该支持 loading 插槽', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps,
        slots: {
          loading: '<span class="custom-loading">加载中</span>'
        }
      });

      expect(wrapper.find('.custom-loading').exists()).toBe(true);
    });
  });

  describe('边界情况', () => {
    it('应该处理不同类型的 value', () => {
      const mixedOptions: GroupSelectOption[] = [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 123 },
        { label: '布尔值', value: 'true' }
      ];

      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: mixedOptions,
          modelValue: 'string'
        }
      });

      expect(wrapper.exists()).toBe(true);
      const buttons = wrapper.findAll('.el-button');
      expect(buttons).toHaveLength(3);
    });

    it('应该处理复杂的选项对象', () => {
      const complexOptions: GroupSelectOption[] = [
        {
          label: '复杂选项',
          value: 'complex',
          disabled: false,
          customProp: 'custom-value',
          nested: { key: 'value' }
        }
      ];

      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          options: complexOptions
        }
      });

      expect(wrapper.exists()).toBe(true);
      const buttons = wrapper.findAll('.el-button');
      expect(buttons).toHaveLength(1);
    });

    it('应该处理 modelValue 不在选项中的情况', () => {
      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          modelValue: 'nonexistent'
        }
      });

      expect(wrapper.exists()).toBe(true);
      const buttons = wrapper.findAll('.el-button');
      // 所有按钮都应该是 default 状态
      buttons.forEach(button => {
        expect(button.classes()).toContain('el-button--default');
      });
    });
  });

  describe('组件名称', () => {
    it('应该设置正确的组件名称', () => {
      const wrapper = mount(YGroupSelect, {
        props: baseProps
      });

      expect(wrapper.vm.$options.name).toBe('YGroupSelect');
    });
  });

  describe('属性透传', () => {
    it('应该透传属性到组件', () => {
      const wrapper = mount(YGroupSelect, {
        props: {
          ...baseProps,
          'data-testid': 'group-select'
        }
      });

      expect(wrapper.attributes('data-testid')).toBe('group-select');
    });
  });
});
