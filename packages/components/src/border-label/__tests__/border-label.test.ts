/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { ElInput, ElSelect, ElDatePicker, ElCascader, ElOption } from 'element-plus';
import BorderLabel from '../src/border-label.vue';

describe('BorderLabel', () => {
  // 基础渲染测试
  it('应该正确渲染基础结构', () => {
    const wrapper = mount(BorderLabel);
    expect(wrapper.classes()).toContain('y-border-label');
    expect(wrapper.attributes('style')).toContain('height: 32px');
    expect(wrapper.attributes('style')).toContain('width: auto');
  });

  // 属性测试
  it('应该正确应用自定义属性', () => {
    const wrapper = mount(BorderLabel, {
      props: {
        label: '测试标签',
        width: '200px',
        height: '40px',
        noBorder: true
      }
    });
    expect(wrapper.find('.y-border-label__label').text()).toBe('测试标签');
    expect(wrapper.attributes('style')).toContain('height: 40px');
    expect(wrapper.attributes('style')).toContain('width: 200px');
    expect(wrapper.find('.y-border-label__label').classes()).toContain(
      'y-border-label__label--no-border'
    );
  });

  // 插槽测试
  it('应该正确渲染所有插槽', () => {
    const wrapper = mount(BorderLabel, {
      slots: {
        default: '<div class="test-content">测试内容</div>',
        prefix: '<div class="test-prefix">前缀</div>',
        suffix: '<div class="test-suffix">后缀</div>',
        label: '<div class="test-label">自定义标签</div>'
      }
    });
    expect(wrapper.find('.test-content').exists()).toBe(true);
    expect(wrapper.find('.test-prefix').exists()).toBe(true);
    expect(wrapper.find('.test-suffix').exists()).toBe(true);
    expect(wrapper.find('.test-label').exists()).toBe(true);
  });

  // 条件渲染测试
  it('当没有提供prefix和suffix插槽时不应该渲染对应元素', () => {
    const wrapper = mount(BorderLabel);
    expect(wrapper.find('.y-border-label__prefix').exists()).toBe(false);
    expect(wrapper.find('.y-border-label__suffix').exists()).toBe(false);
  });

  // 标签插槽测试
  it('应该正确渲染label插槽', () => {
    const wrapper = mount(BorderLabel, {
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
    const wrapper = mount(BorderLabel, {
      props: {
        label: '测试标签',
        noBorder: true
      }
    });
    expect(wrapper.find('.y-border-label__label').classes()).toContain(
      'y-border-label__label--no-border'
    );
  });

  // 表单控件集成测试
  it('应该正确集成el-input', () => {
    const wrapper = mount(BorderLabel, {
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
    const wrapper = mount(BorderLabel, {
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
    const wrapper = mount(BorderLabel, {
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
    const wrapper = mount(BorderLabel, {
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
