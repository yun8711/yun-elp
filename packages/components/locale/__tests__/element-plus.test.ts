import { describe, it, expect } from 'vitest';
import { getElementPlusLocale } from '../element-plus';

describe('getElementPlusLocale', () => {
  it('zh-cn 对应 Element Plus 中文包', () => {
    expect(getElementPlusLocale('zh-cn').name).toBe('zh-cn');
  });

  it('en 对应 Element Plus 英文包', () => {
    expect(getElementPlusLocale('en').name).toBe('en');
  });

  it('ja 对应 Element Plus 日语包', () => {
    expect(getElementPlusLocale('ja').name).toBe('ja');
  });

  it('ar 对应 Element Plus 阿拉伯语包', () => {
    expect(getElementPlusLocale('ar').name).toBe('ar');
  });
});
