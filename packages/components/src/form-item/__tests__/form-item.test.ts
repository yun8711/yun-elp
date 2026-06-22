/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import FormItem from '../src/form-item.vue';

describe('YFormItem 组件', () => {
  const FormItemCapture = defineComponent({
    name: 'ElFormItem',
    props: ['prop', 'label', 'rules', 'labelWidth', 'required', 'inlineMessage'],
    template: '<div class="el-form-item"><slot /><slot name="label" /><slot name="error" /></div>'
  });

  const mountOptions = {
    global: {
      stubs: {
        'el-form-item': FormItemCapture
      }
    }
  };

  it('基础渲染', () => {
    const wrapper = mount(FormItem, {
      attrs: { label: '姓名', prop: 'name' },
      ...mountOptions
    });

    expect(wrapper.find('.el-form-item').exists()).toBe(true);
  });

  it('表单项属性分发给 el-form-item', () => {
    const wrapper = mount(FormItem, {
      attrs: {
        label: '姓名',
        prop: 'name',
        required: true,
        'label-width': '100px'
      },
      ...mountOptions
    });

    const formItem = wrapper.findComponent(FormItemCapture);
    expect(formItem.props('label')).toBe('姓名');
    expect(formItem.props('prop')).toBe('name');
    expect(formItem.props('required')).toBe(true);
    expect(formItem.props('labelWidth')).toBe('100px');
  });

  it('default 插槽渲染表单控件', () => {
    const wrapper = mount(FormItem, {
      attrs: { label: '姓名', prop: 'name' },
      slots: {
        default: () => h('input', { class: 'test-input' })
      },
      ...mountOptions
    });

    expect(wrapper.find('.test-input').exists()).toBe(true);
  });

  it('label 插槽', () => {
    const Wrapper = defineComponent({
      components: { FormItem },
      template: `
        <FormItem prop="name">
          <template #label><span class="custom-label">自定义标签</span></template>
          <input />
        </FormItem>
      `
    });

    const wrapper = mount(Wrapper, mountOptions);
    expect(wrapper.find('.custom-label').exists()).toBe(true);
    expect(wrapper.find('.custom-label').text()).toBe('自定义标签');
  });

  it('error 插槽', () => {
    const Wrapper = defineComponent({
      components: { FormItem },
      template: `
        <FormItem prop="name">
          <template #error="{ error }"><span class="custom-error">{{ error || '校验失败' }}</span></template>
          <input />
        </FormItem>
      `
    });

    const wrapper = mount(Wrapper, mountOptions);
    expect(wrapper.find('.custom-error').exists()).toBe(true);
  });
});
