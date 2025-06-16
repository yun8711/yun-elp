/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElInput, ElSelect, ElDatePicker, ElCascader, ElOption } from 'element-plus';
import Label from '../src/label.vue';

describe('Label组件', () => {
  // 基础渲染测试
  it('应该正确渲染基础结构', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      }
    });
    expect(wrapper.find('.y-label').exists()).toBe(true);
    expect(wrapper.find('.y-label__label').exists()).toBe(true);
    expect(wrapper.find('.y-label__content').exists()).toBe(true);
    expect(wrapper.find('.y-label__label').text()).toBe('测试标签');
  });

  // 插槽测试
  it('应该正确渲染默认插槽内容', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        default: '<div class="test-content">测试内容</div>'
      }
    });
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-content').text()).toBe('测试内容');
  });

  // 具名插槽测试
  it('应该正确渲染prefix和suffix插槽', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        prefix: '<div class="test-prefix">前缀</div>',
        suffix: '<div class="test-suffix">后缀</div>'
      }
    });
    expect(wrapper.find('.test-prefix').exists()).toBe(true);
    expect(wrapper.find('.test-suffix').exists()).toBe(true);
  });

  // 标签插槽测试
  it('应该正确渲染label插槽', () => {
    const wrapper = mount(Label, {
      props: {
        label: '默认标签'
      },
      slots: {
        label: '<span class="custom-label">自定义标签</span>'
      }
    });
    expect(wrapper.find('.custom-label').exists()).toBe(true);
    expect(wrapper.find('.custom-label').text()).toBe('自定义标签');
  });

  // 属性测试
  it('应该正确应用border属性', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签',
        border: true
      }
    });
    expect(wrapper.classes()).toContain('y-label--border');
  });

  it('应该正确应用colon属性', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签',
        colon: '：'
      }
    });
    expect(wrapper.find('.y-label__colon').text()).toBe('：');
  });

  it('应该正确应用align属性', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签',
        align: 'right'
      }
    });
    const labelEl = wrapper.find('.y-label__label');
    expect(labelEl.attributes('style')).toContain('justify-content: flex-end');
  });

  // 样式测试
  it('应该正确应用自定义样式', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签',
        labelStyle: { color: 'red' },
        contentStyle: { backgroundColor: 'blue' },
        height: '40px'
      }
    });
    const labelEl = wrapper.find('.y-label__label');
    const contentEl = wrapper.find('.y-label__content');
    const containerEl = wrapper.find('.y-label');

    expect(labelEl.attributes('style')).toContain('color: red');
    expect(contentEl.attributes('style')).toContain('background-color: blue');
    expect(containerEl.attributes('style')).toContain('height: 40px');
  });

  // 表单控件集成测试
  it('应该正确集成el-input', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        default: '<el-input v-model="value" />'
      },
      global: {
        components: {
          ElInput
        }
      }
    });
    expect(wrapper.find('.el-input').exists()).toBe(true);
  });

  it('应该正确集成el-select', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        default: '<el-select v-model="value"><el-option label="选项1" value="1" /></el-select>'
      },
      global: {
        components: {
          ElSelect,
          ElOption
        }
      }
    });
    expect(wrapper.find('.el-select').exists()).toBe(true);
  });

  it('应该正确集成el-date-picker', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        default: '<el-date-picker v-model="value" type="date" />'
      },
      global: {
        components: {
          ElDatePicker
        }
      }
    });
    expect(wrapper.find('.el-date-editor').exists()).toBe(true);
  });

  it('应该正确集成el-cascader', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试标签'
      },
      slots: {
        default: '<el-cascader v-model="value" :options="[]" />'
      },
      global: {
        components: {
          ElCascader
        }
      }
    });
    expect(wrapper.find('.el-cascader').exists()).toBe(true);
  });
});
