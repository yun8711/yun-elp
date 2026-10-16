import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { appConfigKey } from '../../app-wrap/src/use-app-config';
import OrderButton from '../src/order-button.vue';
import { resolveNextOrder } from '../src/order-button';

describe('resolveNextOrder', () => {
  const config = { defaultOrder: 'asc' as const, clearable: false };

  it('未排序时使用 defaultOrder', () => {
    expect(resolveNextOrder('', config)).toBe('asc');
  });

  it('升序再点击变为降序', () => {
    expect(resolveNextOrder('asc', config)).toBe('desc');
  });

  it('未开启 clearable 时，降序再点击回到升序', () => {
    expect(resolveNextOrder('desc', config)).toBe('asc');
  });

  it('开启 clearable 时，降序再点击取消排序', () => {
    expect(resolveNextOrder('desc', { defaultOrder: 'asc', clearable: true })).toBe('');
  });
});

describe('YOrderButton', () => {
  it('渲染文案，并高亮当前方向', () => {
    const wrapper = mount(OrderButton, {
      props: { modelValue: 'desc' },
      slots: { default: '更新时间' }
    });

    expect(wrapper.text()).toContain('更新时间');
    expect(wrapper.classes()).toContain('is-active');
    const icons = wrapper.findAll('.y-order-button__icon');
    expect(icons).toHaveLength(2);
    expect(icons[0].classes()).not.toContain('is-active');
    expect(icons[1].classes()).toContain('is-active');
  });

  it('无默认插槽时不渲染文案', () => {
    const wrapper = mount(OrderButton);
    expect(wrapper.find('.y-order-button__label').exists()).toBe(false);
    expect(wrapper.find('.y-order-button__icons').exists()).toBe(true);
  });
  it('icon 为 arrow 时使用箭头修饰类', () => {
    const wrapper = mount(OrderButton, {
      props: { icon: 'arrow' },
      slots: { default: '更新时间' }
    });

    expect(wrapper.classes()).toContain('y-order-button--arrow');
  });

  it('支持自定义 yNamespace', () => {
    const wrapper = mount(OrderButton, {
      props: {},
      slots: { default: '更新时间' },
      global: {
        provide: {
          [appConfigKey as symbol]: {
            yNamespace: 'yp'
          }
        }
      }
    });

    expect(wrapper.classes()).toContain('yp-order-button');
    expect(wrapper.classes()).not.toContain('y-order-button');
  });

  it('点击后抛出下一个方向', async () => {
    const wrapper = mount(OrderButton, {
      props: { modelValue: 'asc' },
      slots: { default: '更新时间' }
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['desc']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['desc']);
  });

  it('禁用时点击不抛出事件', async () => {
    const wrapper = mount(OrderButton, {
      props: { disabled: true },
      slots: { default: '更新时间' }
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('change')).toBeUndefined();
  });
});
