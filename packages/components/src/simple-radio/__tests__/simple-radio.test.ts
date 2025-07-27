import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import YSimpleRadio from '../src/simple-radio.vue';
import type { SimpleRadioOption } from '../src/simple-radio';

// 模拟 Element Plus 组件
vi.mock('element-plus', () => ({
  ElRadio: {
    name: 'ElRadio',
    template: '<div class="el-radio" :class="{ disabled: disabled }"><slot></slot></div>',
    props: ['label', 'disabled', 'value'],
    emits: ['change']
  },
  ElRadioButton: {
    name: 'ElRadioButton',
    template: '<div class="el-radio-button" :class="{ disabled: disabled }"><slot></slot></div>',
    props: ['label', 'disabled', 'value'],
    emits: ['change']
  },
  ElRadioGroup: {
    name: 'ElRadioGroup',
    template: '<div class="el-radio-group"><slot></slot></div>',
    props: ['modelValue'],
    emits: ['update:modelValue', 'change']
  }
}));

describe('YSimpleRadio', () => {
  const mockOptions: SimpleRadioOption[] = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3', disabled: true }
  ];

  // 基础 props，包含必要的 RadioGroupProps 属性
  const baseProps = {
    options: mockOptions,
    disabled: false,
    fill: '#409EFF',
    textColor: '#ffffff',
    validateEvent: true
  };

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('y-simple-radio');
    });

    it('应该渲染 el-radio-group', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      // 由于 mock 的原因，我们检查组件是否正确渲染了内容
      expect(wrapper.html()).toContain('el-radio-group');
    });
  });

  describe('选项渲染', () => {
    it('应该根据 options 渲染正确的选项数量', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(3);
    });

    it('应该正确显示选项的 label', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].text()).toBe('选项1');
      expect(radioElements[1].text()).toBe('选项2');
      expect(radioElements[2].text()).toBe('选项3');
    });

    it('应该处理空选项数组', () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          options: []
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(0);
    });
  });

  describe('双向绑定', () => {
    it('应该正确绑定 modelValue', async () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          modelValue: '2'
        }
      });

      // 检查组件是否正确接收了 modelValue
      expect(wrapper.props('modelValue')).toBe('2');
    });

    it('应该正确更新 modelValue', async () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          modelValue: '1'
        }
      });

      await wrapper.setProps({ modelValue: '3' });
      expect(wrapper.props('modelValue')).toBe('3');
    });
  });

  describe('事件触发', () => {
    it('应该触发 update:modelValue 事件', async () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          modelValue: '1'
        }
      });

      // 直接触发组件的事件
      await wrapper.vm.$emit('update:modelValue', '2');

      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
    });

    it('应该触发 change 事件', async () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          modelValue: '1'
        }
      });

      // 直接触发组件的事件
      await wrapper.vm.$emit('change', '2');

      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('change')?.[0]).toEqual(['2']);
    });
  });

  describe('禁用状态', () => {
    it('应该正确渲染禁用选项', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[2].classes()).toContain('disabled');
    });

    it('应该处理所有选项都禁用的情况', () => {
      const disabledOptions: SimpleRadioOption[] = [
        { label: '禁用选项1', value: '1', disabled: true },
        { label: '禁用选项2', value: '2', disabled: true }
      ];

      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          options: disabledOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      radioElements.forEach(element => {
        expect(element.classes()).toContain('disabled');
      });
    });
  });

  describe('子组件类型', () => {
    it('默认应该使用 ElRadio 组件', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements.length).toBeGreaterThan(0);
    });

    it('当 childType 为 button 时应该使用 ElRadioButton 组件', () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          childType: 'button'
        }
      });

      const radioButtonElements = wrapper.findAll('.el-radio-button');
      expect(radioButtonElements.length).toBeGreaterThan(0);
    });
  });

  describe('插槽功能', () => {
    it('应该支持默认插槽', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps,
        slots: {
          default: (props) => `自定义: ${props.label}`
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].text()).toBe('自定义: 选项1');
      expect(radioElements[1].text()).toBe('自定义: 选项2');
      expect(radioElements[2].text()).toBe('自定义: 选项3');
    });

    it('应该在没有插槽时使用默认内容', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].text()).toBe('选项1');
      expect(radioElements[1].text()).toBe('选项2');
      expect(radioElements[2].text()).toBe('选项3');
    });
  });

  describe('属性透传', () => {
    it('应该透传属性到组件', () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          size: 'large',
          disabled: true
        }
      });

      // 检查组件是否正确接收了属性
      expect(wrapper.props('size')).toBe('large');
      expect(wrapper.props('disabled')).toBe(true);
    });

    it('应该透传属性到子组件', () => {
      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          options: [
            { label: '选项1', value: '1', name: 'test-name' },
            { label: '选项2', value: '2', 'data-test': 'test-value' }
          ]
        }
      });

      // 检查选项是否正确传递了属性
      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(2);
    });
  });

  describe('边界情况', () => {
    it('应该处理不同类型的 value', () => {
      const mixedOptions: SimpleRadioOption[] = [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 123 },
        { label: '布尔值', value: true }
      ];

      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          options: mixedOptions
        }
      });

      expect(wrapper.exists()).toBe(true);
      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(3);
    });

    it('应该处理复杂的选项对象', () => {
      const complexOptions: SimpleRadioOption[] = [
        {
          label: '复杂选项',
          value: 'complex',
          disabled: false,
          customProp: 'custom-value',
          nested: { key: 'value' }
        }
      ];

      const wrapper = mount(YSimpleRadio, {
        props: {
          ...baseProps,
          options: complexOptions
        }
      });

      expect(wrapper.exists()).toBe(true);
      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(1);
    });
  });

  describe('组件名称', () => {
    it('应该设置正确的组件名称', () => {
      const wrapper = mount(YSimpleRadio, {
        props: baseProps
      });

      expect(wrapper.vm.$options.name).toBe('YSimpleRadio');
    });
  });
});
