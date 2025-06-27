/// <reference types="vitest/globals" />
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YPartTitle from '../src/part-title.vue';

describe('YPartTitle组件', () => {
  // 基础渲染测试
  it('应该正确渲染基础结构', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    expect(wrapper.find('.y-part-title').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__left').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__right').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__left-extra').exists()).toBe(true);
  });

  // title prop 测试
  it('应该正确显示title属性', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    expect(wrapper.find('.y-part-title__left span').text()).toBe('测试标题');
  });

  it('应该在没有title时显示空字符串', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: ''
      }
    });

    expect(wrapper.find('.y-part-title__left span').text()).toBe('');
  });

  // 默认插槽测试
  it('应该正确渲染默认插槽内容', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '默认标题'
      },
      slots: {
        default: '<span class="custom-content">自定义内容</span>'
      }
    });

    expect(wrapper.find('.custom-content').exists()).toBe(true);
    expect(wrapper.find('.custom-content').text()).toBe('自定义内容');
  });

  it('应该在没有默认插槽时显示title', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    expect(wrapper.find('.y-part-title__left span').text()).toBe('测试标题');
  });

  // 具名插槽测试
  it('应该正确渲染extra插槽', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      slots: {
        extra: '<span class="extra-content">额外内容</span>'
      }
    });

    expect(wrapper.find('.extra-content').exists()).toBe(true);
    expect(wrapper.find('.extra-content').text()).toBe('额外内容');
  });

  it('应该正确渲染right插槽', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      slots: {
        right: '<span class="right-content">右侧内容</span>'
      }
    });

    expect(wrapper.find('.right-content').exists()).toBe(true);
    expect(wrapper.find('.right-content').text()).toBe('右侧内容');
  });

  it('应该在没有right插槽时右侧为空', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    expect(wrapper.find('.y-part-title__right').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__right').text()).toBe('');
  });

  // 属性继承测试（inheritAttrs: true）
  it('应该正确绑定传入的属性', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      attrs: {
        id: 'test-id',
        class: 'custom-class',
        style: 'color: red;'
      }
    });

    const rootElement = wrapper.find('.y-part-title');
    expect(rootElement.attributes('id')).toBe('test-id');
    expect(rootElement.attributes('class')).toContain('custom-class');
    expect(rootElement.attributes('style')).toContain('color: red');
  });

  it('应该正确处理data属性', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      attrs: {
        'data-test': 'test-value',
        'data-cy': 'part-title'
      }
    });

    const rootElement = wrapper.find('.y-part-title');
    expect(rootElement.attributes('data-test')).toBe('test-value');
    expect(rootElement.attributes('data-cy')).toBe('part-title');
  });

  // 样式类名测试
  it('应该包含正确的CSS类名', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    expect(wrapper.classes()).toContain('y-part-title');
    expect(wrapper.find('.y-part-title__left').classes()).toContain('y-part-title__left');
    expect(wrapper.find('.y-part-title__right').classes()).toContain('y-part-title__right');
    expect(wrapper.find('.y-part-title__left-extra').classes()).toContain(
      'y-part-title__left-extra'
    );
  });

  // 复杂插槽组合测试
  it('应该正确处理多个插槽的组合', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      slots: {
        default: '<span class="default-slot">默认插槽</span>',
        extra: '<span class="extra-slot">额外内容</span>',
        right: '<span class="right-slot">右侧插槽</span>'
      }
    });

    expect(wrapper.find('.default-slot').exists()).toBe(true);
    expect(wrapper.find('.extra-slot').exists()).toBe(true);
    expect(wrapper.find('.right-slot').exists()).toBe(true);

    // 默认插槽应该显示在左侧span中
    expect(wrapper.find('.y-part-title__left .default-slot').exists()).toBe(true);
    // 额外插槽应该显示在left-extra中
    expect(wrapper.find('.y-part-title__left-extra .extra-slot').exists()).toBe(true);
  });

  // 边界情况测试
  it('应该在没有props时正常工作', () => {
    const wrapper = mount(YPartTitle);

    expect(wrapper.find('.y-part-title').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__left span').text()).toBe('');
  });

  it('应该正确处理特殊字符的title', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '特殊字符：!@#$%^&*()'
      }
    });

    expect(wrapper.find('.y-part-title__left span').text()).toBe('特殊字符：!@#$%^&*()');
  });

  // 组件名称测试
  it('应该具有正确的组件名称', () => {
    expect(YPartTitle.name).toBe('YPartTitle');
  });

  // 事件测试
  it('应该能够触发点击事件', async () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      }
    });

    await wrapper.find('.y-part-title').trigger('click');
    // 这里可以添加更多事件相关的测试
  });

  // 插槽优先级测试
  it('应该优先显示默认插槽而不是title', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '原始标题'
      },
      slots: {
        default: '插槽标题'
      }
    });

    expect(wrapper.find('.y-part-title__left span').text()).toBe('插槽标题');
  });

  // 空插槽测试
  it('应该正确处理空的extra插槽', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      slots: {
        extra: ''
      }
    });

    expect(wrapper.find('.y-part-title__left-extra').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__left-extra').text()).toBe('');
  });

  it('应该正确处理空的right插槽', () => {
    const wrapper = mount(YPartTitle, {
      props: {
        title: '测试标题'
      },
      slots: {
        right: ''
      }
    });

    expect(wrapper.find('.y-part-title__right').exists()).toBe(true);
    expect(wrapper.find('.y-part-title__right').text()).toBe('');
  });
});
