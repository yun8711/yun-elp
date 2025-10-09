import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import YColumnOperation from '../src/column-operation.vue';

describe('YColumnOperation', () => {
  it('渲染正常', () => {
    const wrapper = mount(YColumnOperation);
    expect(wrapper.exists()).toBe(true);
  });
});
