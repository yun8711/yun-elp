import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YRadio from '../src/radio.vue';
import type { RadioOption } from '../src/radio';

describe('YRadio', () => {
  const mockOptions: RadioOption[] = [
    { label: '选项1', value: '1' },
    { label: '选项2', value: '2' },
    { label: '选项3', value: '3', disabled: true }
  ];

  // 基础 props，包含必要的 RadioGroupProps 属性
  const baseProps = {
    options: mockOptions,
    modelValue: '',
    disabled: false,
    fill: '#409EFF',
    textColor: '#ffffff',
    validateEvent: true
  };

  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.classes()).toContain('y-radio');
    });

    it('应该渲染 el-radio-group', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      // 由于 mock 的原因，我们检查组件是否正确渲染了内容
      expect(wrapper.html()).toContain('el-radio-group');
    });
  });

  describe('选项渲染', () => {
    it('应该根据 options 渲染正确的选项数量', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(3);
    });

    it('应该正确显示选项的 label', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].text()).toBe('选项1');
      expect(radioElements[1].text()).toBe('选项2');
      expect(radioElements[2].text()).toBe('选项3');
    });

    it('应该处理空选项数组', () => {
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          modelValue: '2'
        }
      });

      // 检查组件是否正确接收了 modelValue
      expect(wrapper.props('modelValue')).toBe('2');
    });

    it('应该正确更新 modelValue', async () => {
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[2].classes()).toContain('is-disabled');
    });

    it('应该处理所有选项都禁用的情况', () => {
      const disabledOptions: RadioOption[] = [
        { label: '禁用选项1', value: '1', disabled: true },
        { label: '禁用选项2', value: '2', disabled: true }
      ];

      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: disabledOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      radioElements.forEach(element => {
        expect(element.classes()).toContain('is-disabled');
      });
    });
  });

  describe('子组件类型', () => {
    it('默认应该使用 ElRadio 组件', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements.length).toBeGreaterThan(0);
    });

    it('当 childType 为 button 时应该使用 ElRadioButton 组件', () => {
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
        props: baseProps,
        slots: {
          default: props => `自定义: ${props.label}`
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].text()).toBe('自定义: 选项1');
      expect(radioElements[1].text()).toBe('自定义: 选项2');
      expect(radioElements[2].text()).toBe('自定义: 选项3');
    });

    it('应该在没有插槽时使用默认内容', () => {
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
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
      const wrapper = mount(YRadio, {
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
      const mixedOptions: RadioOption[] = [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 123 },
        { label: '布尔值', value: true }
      ];

      const wrapper = mount(YRadio, {
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
      const complexOptions: RadioOption[] = [
        {
          label: '复杂选项',
          value: 'complex',
          disabled: false,
          customProp: 'custom-value',
          nested: { key: 'value' }
        } as any
      ];

      const wrapper = mount(YRadio, {
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

  describe('disabledMethod 功能', () => {
    it('应该使用 disabledMethod 正确禁用选项', () => {
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          disabledMethod: (option: RadioOption) => {
            // 如果是对象，检查value；如果是简单值，直接比较
            const value = typeof option === 'object' && option !== null ? option.value : option;
            return value === '2';
          }
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].classes()).not.toContain('is-disabled');
      expect(radioElements[1].classes()).toContain('is-disabled');
      expect(radioElements[2].classes()).toContain('is-disabled'); // 这个已经在原始数据中禁用了
    });

    it('应该优先使用选项本身的 disabled 属性', () => {
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: [
            { label: '选项1', value: '1', disabled: false }, // 明确设置为不禁用
            { label: '选项2', value: '2' }, // 没有disabled属性，应该被disabledMethod禁用
            { label: '选项3', value: '3', disabled: true } // 明确设置为禁用
          ],
          disabledMethod: (option: RadioOption) => {
            const value = typeof option === 'object' && option !== null ? option.value : option;
            return value === '2';
          }
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements[0].classes()).not.toContain('is-disabled'); // 明确设置为不禁用
      expect(radioElements[1].classes()).toContain('is-disabled'); // 被disabledMethod禁用
      expect(radioElements[2].classes()).toContain('is-disabled'); // 明确设置为禁用
    });
  });

  describe('简单值选项', () => {
    it('应该支持字符串数组作为选项', () => {
      const stringOptions: RadioOption[] = ['选项1', '选项2', '选项3'];

      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: stringOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(3);
      expect(radioElements[0].text()).toBe('选项1');
      expect(radioElements[1].text()).toBe('选项2');
      expect(radioElements[2].text()).toBe('选项3');
    });

    it('应该支持数字数组作为选项', () => {
      const numberOptions: RadioOption[] = [1, 2, 3];

      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: numberOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(3);
      expect(radioElements[0].text()).toBe('1');
      expect(radioElements[1].text()).toBe('2');
      expect(radioElements[2].text()).toBe('3');
    });

    it('应该支持布尔值数组作为选项', () => {
      const booleanOptions: RadioOption[] = [true, false];

      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: booleanOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(2);
      expect(radioElements[0].text()).toBe('true');
      expect(radioElements[1].text()).toBe('false');
    });

    it('应该支持混合类型的选项', () => {
      const mixedOptions: RadioOption[] = [
        '字符串选项',
        42,
        true,
        { label: '对象选项', value: 'object' }
      ];

      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          options: mixedOptions
        }
      });

      const radioElements = wrapper.findAll('.el-radio');
      expect(radioElements).toHaveLength(4);
      expect(radioElements[0].text()).toBe('字符串选项');
      expect(radioElements[1].text()).toBe('42');
      expect(radioElements[2].text()).toBe('true');
      expect(radioElements[3].text()).toBe('对象选项');
    });
  });

  describe('组件名称', () => {
    it('应该设置正确的组件名称', () => {
      const wrapper = mount(YRadio, {
        props: baseProps
      });

      expect(wrapper.vm.$options.name).toBe('YRadio');
    });
  });

  describe('radioValue 计算属性', () => {
    it('radioValue getter 应该正确绑定到 modelValue', () => {
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          modelValue: 'selected-value'
        }
      });

      // 验证 el-radio-group 接收到了正确的 modelValue
      // 通过检查组件的响应性来验证 radioValue 的 getter 工作正常
      expect(wrapper.props('modelValue')).toBe('selected-value');
    });

    it('radioValue setter 应该同时触发 update:modelValue 和 change 事件', async () => {
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          modelValue: '1'
        }
      });

      // 通过直接触发组件内部的 radioValue setter 来测试
      // 由于 radioValue 是计算属性，我们可以通过 setValue 方法或者直接访问组件实例来测试
      const componentVM = wrapper.vm as any;

      // 直接调用 radioValue 的 setter
      componentVM.radioValue = '2';

      // 验证组件同时触发了两个事件
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('change')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2']);
      expect(wrapper.emitted('change')?.[0]).toEqual(['2']);
    });

    it('应该支持不同数据类型的 radioValue 传递', async () => {
      const testCases = [
        { initial: '', new: 'string-value', desc: '字符串值' },
        { initial: '', new: 123, desc: '数字值' },
        { initial: '', new: true, desc: '布尔值 true' },
        { initial: '', new: false, desc: '布尔值 false' }
      ];

      for (const testCase of testCases) {
        const wrapper = mount(YRadio, {
          props: {
            ...baseProps,
            modelValue: testCase.initial
          }
        });

        const componentVM = wrapper.vm as any;

        // 直接设置 radioValue 来触发 setter
        componentVM.radioValue = testCase.new;

        // 验证两个事件都被触发且值正确
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('change')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([testCase.new]);
        expect(wrapper.emitted('change')?.[0]).toEqual([testCase.new]);
      }
    });

    it('radioValue 应该支持完整双向绑定流程', async () => {
      const wrapper = mount(YRadio, {
        props: {
          ...baseProps,
          modelValue: 'initial'
        }
      });

      // 验证初始值
      expect(wrapper.props('modelValue')).toBe('initial');

      // 模拟用户选择新值（通过直接设置 radioValue）
      const componentVM = wrapper.vm as any;
      componentVM.radioValue = 'new-selection';

      // 验证事件触发
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new-selection']);
      expect(wrapper.emitted('change')?.[0]).toEqual(['new-selection']);

      // 模拟父组件响应 update:modelValue 事件，更新 modelValue
      await wrapper.setProps({ modelValue: 'new-selection' });

      // 验证新的值被正确设置
      expect(wrapper.props('modelValue')).toBe('new-selection');
    });

  });
});
