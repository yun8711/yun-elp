import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YStep from '../src/step.vue';

describe('YStep', () => {
  it('渲染正常', () => {
    const wrapper = mount(YStep);
    expect(wrapper.exists()).toBe(true);
  });

  it('默认属性渲染正确', () => {
    const wrapper = mount(YStep);
    expect(wrapper.classes()).toContain('y-step');

    const items = wrapper.findAll('.y-step__item');
    expect(items.length).toBe(2); // 默认stepNumber为2

    const firstItem = items[0];
    expect(firstItem.classes()).toContain('is-active'); // 默认activeIndex为0
    expect(firstItem.find('.y-step__item-index').text()).toBe('1');
    expect(firstItem.find('.y-step__item-content').classes()).toContain('is-inline'); // 默认inlineLabel为true
  });

  it('steps属性正常工作', () => {
    const steps = ['步骤1', '步骤2', '步骤3'];
    const wrapper = mount(YStep, {
      props: { steps }
    });

    const items = wrapper.findAll('.y-step__item');
    expect(items.length).toBe(3);

    expect(wrapper.find('.y-step__item-label').text()).toBe('步骤1');
    expect(wrapper.findAll('.y-step__item-label')[1].text()).toBe('步骤2');
    expect(wrapper.findAll('.y-step__item-label')[2].text()).toBe('步骤3');
  });

  it('stepNumber属性正常工作', () => {
    const wrapper = mount(YStep, {
      props: { stepNumber: 4 }
    });

    const items = wrapper.findAll('.y-step__item');
    expect(items.length).toBe(4);

    // 当没有steps时，不显示label
    const labels = wrapper.findAll('.y-step__item-label');
    expect(labels.length).toBe(0);
  });

  it('activeIndex属性正常工作', () => {
    const steps = ['步骤1', '步骤2', '步骤3'];
    const wrapper = mount(YStep, {
      props: { steps, activeIndex: 1 }
    });

    const items = wrapper.findAll('.y-step__item');
    expect(items[0].classes()).toContain('is-active');
    expect(items[1].classes()).toContain('is-active');
    expect(items[2].classes()).not.toContain('is-active');
  });

  it('inlineLabel属性正常工作', () => {
    const steps = ['步骤1', '步骤2'];
    const wrapper = mount(YStep, {
      props: { steps, inlineLabel: false }
    });

    const content = wrapper.find('.y-step__item-content');
    expect(content.classes()).not.toContain('is-inline');
  });

  it('连接线渲染正确', () => {
    const steps = ['步骤1', '步骤2', '步骤3'];
    const wrapper = mount(YStep, {
      props: { steps, activeIndex: 1 }
    });

    const lines = wrapper.findAll('.y-step__item-line');
    expect(lines.length).toBe(2); // 三个步骤有两个连接线

    expect(lines[0].classes()).toContain('is-active'); // 第一条线激活
    expect(lines[1].classes()).not.toContain('is-active'); // 第二条线未激活
  });

  it('stepNumber正常工作', () => {
    const wrapper = mount(YStep, {
      props: { stepNumber: 3 }
    });

    const items = wrapper.findAll('.y-step__item');
    expect(items.length).toBe(3);
  });

  it('无steps时不显示label', () => {
    const wrapper = mount(YStep, {
      props: { stepNumber: 3 }
    });

    const labels = wrapper.findAll('.y-step__item-label');
    expect(labels.length).toBe(0);
  });

  it('有steps时显示label', () => {
    const steps = ['步骤1', '步骤2'];
    const wrapper = mount(YStep, {
      props: { steps }
    });

    const labels = wrapper.findAll('.y-step__item-label');
    expect(labels.length).toBe(2);
    expect(labels[0].text()).toBe('步骤1');
    expect(labels[1].text()).toBe('步骤2');
  });

  it('slot功能正常工作', () => {
    const steps = ['步骤1', '步骤2', '步骤3'];
    const wrapper = mount(YStep, {
      props: { steps, activeIndex: 1 },
      slots: {
        default: ({ step, index, active }) => `${step} - ${index + 1} - ${active ? '激活' : '未激活'}`
      }
    });

    // 检查是否使用了slot内容而不是默认内容
    expect(wrapper.text()).toContain('步骤1 - 1 - 激活');
    expect(wrapper.text()).toContain('步骤2 - 2 - 激活');
    expect(wrapper.text()).toContain('步骤3 - 3 - 未激活');

    // 检查默认内容是否不显示
    expect(wrapper.find('.y-step__item-content').exists()).toBe(false);
  });
});
