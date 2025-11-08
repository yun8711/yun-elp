import { mount } from '@vue/test-utils';
import { describe, it, expect, afterEach } from 'vitest';
import YSelect from '../src/select.vue';

// 简化的 mock 组件
const MockElSelect = {
  name: 'ElSelect',
  template: '<div class="el-select"><slot /></div>',
  props: ['modelValue', 'multiple', 'placeholder', 'clearable'],
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

describe('YSelect', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染', () => {
    const wrapper = mount(YSelect, {
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

    const wrapper = mount(YSelect, {
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

    const wrapper = mount(YSelect, {
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

  it('应该支持多选', async () => {
    const options = [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ];

    const wrapper = mount(YSelect, {
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

    // 检查是否正确渲染了选项
    const optionElements = wrapper.findAllComponents(MockElOption);
    expect(optionElements).toHaveLength(3);

    // 模拟多选操作
    const selectComponent = wrapper.findComponent(MockElSelect);
    await selectComponent.vm.$emit('update:modelValue', ['1', '3']);

    // 检查是否正确触发了事件
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['1', '3']]);
  });

  it('应该支持disabledMethod参数', () => {
    const options = [
      { label: '选项1', value: '1' },
      { label: '选项2', value: '2' },
      { label: '选项3', value: '3' }
    ];

    const disabledMethod = (option: any) => option.value === '2';

    const wrapper = mount(YSelect, {
      props: {
        options,
        disabledMethod
      } as any,
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    const optionElements = wrapper.findAllComponents(MockElOption);
    expect(optionElements).toHaveLength(3);

    // 检查第二个选项是否被禁用
    expect(optionElements[1].props('disabled')).toBe(true);
    expect(optionElements[0].props('disabled')).toBe(false);
    expect(optionElements[2].props('disabled')).toBe(false);
  });

  it('应该支持简单类型选项', () => {
    const options = ['选项1', '选项2', '选项3'];

    const wrapper = mount(YSelect, {
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
    expect(optionElements).toHaveLength(3);

    // 检查简单类型选项是否正确转换为对象格式
    expect(optionElements[0].props('label')).toBe('选项1');
    expect(optionElements[0].props('value')).toBe('选项1');
    expect(optionElements[1].props('label')).toBe('选项2');
    expect(optionElements[1].props('value')).toBe('选项2');
  });

  it('应该支持选项分组', () => {
    const optionGroups = [
      {
        label: '分组1',
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' }
        ]
      },
      {
        label: '分组2',
        options: [{ label: '选项3', value: '3' }]
      }
    ];

    const wrapper = mount(YSelect, {
      props: { optionGroups } as any,
      global: {
        components: {
          ElSelect: MockElSelect,
          ElOption: MockElOption,
          ElOptionGroup: MockElOptionGroup
        }
      }
    });

    const groupElements = wrapper.findAllComponents(MockElOptionGroup);
    expect(groupElements).toHaveLength(2);

    const optionElements = wrapper.findAllComponents(MockElOption);
    expect(optionElements).toHaveLength(3);
  });

  it('应该暴露正确的方法', () => {
    const wrapper = mount(YSelect, {
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
