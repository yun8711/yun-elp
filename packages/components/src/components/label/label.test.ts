import { describe, it, expect, vi } from 'vitest';
import { renderComponent } from '../../test-utils';
import KLabel from './label.vue';

describe('KLabel 组件', () => {
  // 测试渲染
  it('应该正确渲染', () => {
    const { getByText } = renderComponent(KLabel, {
      slots: {
        default: '测试内容'
      }
    });

    expect(getByText('测试内容')).toBeTruthy();
  });

  // 添加更多测试...
});
