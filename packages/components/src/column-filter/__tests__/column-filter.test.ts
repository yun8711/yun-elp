import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnFilter from '../src/column-filter.vue';

describe('YColumnFilter', () => {
  it('渲染正常', () => {
    const wrapper = mount(YColumnFilter);
    expect(wrapper.exists()).toBe(true);
  });
});
