import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import YSimpleSelect from '../src/simple-select.vue';

// 简化的 mock 组件
const MockElSelect = {
  name: 'ElSelect',
  template: '<div class="el-select"><slot /></div>',
  props: {
    modelValue: {},
    multiple: { type: Boolean, default: false },
    placeholder: { type: String },
    clearable: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'change', 'visible-change']
};

const MockElOption = {
  name: 'ElOption',
  template: '<div class="el-option"></div>',
  props: ['label', 'value', 'disabled']
};

const MockElOptionGroup = {
  name: 'ElOptionGroup',
  template: '<div class="el-option-group"><slot /></div>',
  props: ['label', 'disabled']
};

describe('YSimpleSelect', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染', () => {
    const wrapper = mount(YSimpleSelect, {
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });
    expect(wrapper.findComponent(MockElSelect).exists()).toBe(true);
  });

  it('应该正确渲染选项', () => {
    const options = [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' }
    ];

    const wrapper = mount(YSimpleSelect, {
      props: { options } as any,
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    const optionElements = wrapper.findAllComponents(MockElOption);
    expect(optionElements).toHaveLength(2);
  });

  it('应该支持 v-model', async () => {
    const options = [{ label: '选项1', value: '1' }];

    const wrapper = mount(YSimpleSelect, {
      props: {
        options,
        modelValue: ''
      } as any,
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    const select = wrapper.findComponent(MockElSelect);
    await select.vm.$emit('update:modelValue', '1');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1']);
  });

  it('应该支持多选', () => {
    const options = [{ label: '选项1', value: '1' }];

    const wrapper = mount(YSimpleSelect, {
      props: {
        options,
        multiple: true,
        modelValue: []
      } as any,
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    // 检查组件是否正确接收了 multiple 属性
    expect(wrapper.props('multiple')).toBe(true);

    // 检查组件是否正确接收了 modelValue 数组（多选模式）
    expect(wrapper.props('modelValue')).toEqual([]);
  });

  it('应该暴露正确的方法', () => {
    const wrapper = mount(YSimpleSelect, {
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    const vm = wrapper.vm;
    expect(typeof vm.focus).toBe('function');
    expect(typeof vm.blur).toBe('function');
    expect(typeof vm.getSelectedLabel).toBe('function');
    expect(typeof vm.getSelectInstance).toBe('function');
  });
});
