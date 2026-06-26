import { describe, it, expect } from 'vitest';
import { resolveDirection, RTL_LOCALES } from '../direction';

describe('resolveDirection', () => {
  it('auto 模式下 ar 使用 rtl', () => {
    expect(resolveDirection('ar', 'auto')).toBe('rtl');
  });

  it('auto 模式下其他语言使用 ltr', () => {
    expect(resolveDirection('zh-cn', 'auto')).toBe('ltr');
    expect(resolveDirection('en', 'auto')).toBe('ltr');
    expect(resolveDirection('ja', 'auto')).toBe('ltr');
  });

  it('显式 direction 优先于 locale', () => {
    expect(resolveDirection('ar', 'ltr')).toBe('ltr');
    expect(resolveDirection('zh-cn', 'rtl')).toBe('rtl');
  });

  it('RTL_LOCALES 包含 ar', () => {
    expect(RTL_LOCALES).toContain('ar');
  });
});
