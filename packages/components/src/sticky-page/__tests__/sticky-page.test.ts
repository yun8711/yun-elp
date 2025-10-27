import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YStickyPage from '../src/sticky-page.vue';

describe('YStickyPage', () => {
  it('渲染正常', () => {
    const wrapper = mount(YStickyPage);
    expect(wrapper.exists()).toBe(true);
  });
});
