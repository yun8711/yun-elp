/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Label from '../src/label.vue';

describe('Label 组件', () => {
  it('基础渲染', () => {
    const wrapper = mount(Label, { props: { label: '测试标签' } });
    expect(wrapper.find('.y-label').exists()).toBe(true);
    expect(wrapper.find('.y-label__label span').text()).toBe('测试标签');
    expect(wrapper.find('.y-label__content').exists()).toBe(true);
  });

  it('无 label 时不渲染标签文本', () => {
    const wrapper = mount(Label, { props: {} });
    expect(wrapper.find('.y-label__label span').exists()).toBe(false);
  });

  it('默认插槽内容渲染', () => {
    const wrapper = mount(Label, {
      props: { label: '测试标签' },
      slots: { default: '<div class="slot-content">内容</div>' }
    });
    expect(wrapper.find('.slot-content').exists()).toBe(true);
  });

  it('具名插槽 prefix/suffix', () => {
    const wrapper = mount(Label, {
      props: { label: '测试标签' },
      slots: {
        prefix: '<span class="prefix">前缀</span>',
        suffix: '<span class="suffix">后缀</span>'
      }
    });
    expect(wrapper.find('.prefix').exists()).toBe(true);
    expect(wrapper.find('.suffix').exists()).toBe(true);
  });

  it('label 插槽优先于 label 属性', () => {
    const wrapper = mount(Label, {
      props: { label: '属性标签' },
      slots: { label: '<span class="custom-label">插槽标签</span>' }
    });
    expect(wrapper.find('.custom-label').text()).toBe('插槽标签');
    expect(wrapper.find('.y-label__label span').text()).toBe('插槽标签');
  });

  it('colon 属性渲染分隔符', () => {
    const wrapper = mount(Label, { props: { label: '测试', colon: '：' } });
    expect(wrapper.find('.y-label__colon').text()).toBe('：');
  });

  it('labelAlign 属性控制对齐', () => {
    const wrapper = mount(Label, { props: { label: '测试', labelAlign: 'right' } });
    const style = wrapper.find('.y-label__label').attributes('style');
    expect(style).toContain('justify-content: flex-end');
  });

  it('labelWidth 属性控制宽度', () => {
    const wrapper = mount(Label, { props: { label: '测试', labelWidth: '120px' } });
    const style = wrapper.find('.y-label__label').attributes('style');
    expect(style).toContain('width: 120px');
  });

  it('height 属性控制整体高度', () => {
    const wrapper = mount(Label, { props: { label: '测试', height: '40px' } });
    const style = wrapper.find('.y-label').attributes('style');
    expect(style).toContain('height: 40px');
  });

  it('labelStyle/contentStyle 属性生效', () => {
    const wrapper = mount(Label, {
      props: {
        label: '测试',
        labelStyle: { color: 'red' },
        contentStyle: { backgroundColor: 'blue' }
      }
    });
    expect(wrapper.find('.y-label__label').attributes('style')).toContain('color: red');
    expect(wrapper.find('.y-label__content').attributes('style')).toContain('background-color: blue');
  });

  it('边界：labelAlign 非法值时默认左对齐', () => {
    const wrapper = mount(Label, { props: { label: '测试', labelAlign: 'invalid' as any } });
    const style = wrapper.find('.y-label__label').attributes('style');
    expect(style).toContain('justify-content: flex-start');
  });
});
