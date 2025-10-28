import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YMenu from '../src/menu.vue';

describe('YMenu', () => {
  it('渲染正常', () => {
    const wrapper = mount(YMenu);
    expect(wrapper.exists()).toBe(true);
  });
});
