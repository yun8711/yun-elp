import { describe, expect, it } from 'vitest';
import {
  getElementPlusDepsForComponent,
  getElementPlusStylePaths,
  YUN_ELP_ELEMENT_PLUS_DEPS
} from '../ep-deps';
import YunElpResolver from '../index';

describe('ep-deps', () => {
  it('YTableSearch 应包含常用表单 EP 组件', () => {
    const deps = getElementPlusDepsForComponent('YTableSearch');
    expect(deps).toContain('button');
    expect(deps).toContain('collapse-transition');
    expect(deps).toContain('date-picker');
    expect(deps).toContain('select');
  });

  it('getElementPlusStylePaths 应去重并包含 base 样式', () => {
    const paths = getElementPlusStylePaths(['button', 'input'], 'sass');
    expect(paths).toContain('element-plus/es/components/base/style/index');
    expect(paths).toContain('element-plus/es/components/button/style/index');
    expect(paths).toContain('element-plus/es/components/input/style/index');
  });

  it('无 EP 依赖的组件返回空样式路径', () => {
    expect(getElementPlusDepsForComponent('YLabel')).toEqual([]);
    expect(getElementPlusStylePaths([], 'css')).toEqual([]);
  });

  it('映射表中的组件名均符合 Y 前缀约定', () => {
    for (const name of Object.keys(YUN_ELP_ELEMENT_PLUS_DEPS)) {
      expect(name).toMatch(/^Y[A-Z]/);
    }
  });
});

describe('YunElpResolver', () => {
  it('解析 YTableSearch 时应注入 yun-elp 与 element-plus 样式', async () => {
    const resolver = YunElpResolver({
      importStyle: 'scss',
      importElementStyle: 'sass'
    });
    const result = await resolver.resolve!('YTableSearch');

    expect(result).toMatchObject({
      name: 'YTableSearch',
      from: 'yun-elp'
    });

    const sideEffects = result?.sideEffects as string[];
    expect(sideEffects).toContain('yun-elp/theme-chalk/src/table-search.scss');
    expect(sideEffects).toContain('element-plus/es/components/collapse-transition/style/index');
    expect(sideEffects).toContain('element-plus/es/components/button/style/index');
  });

  it('YButton 无 yun 样式但仍注入 element-plus button 样式', async () => {
    const resolver = YunElpResolver();
    const result = await resolver.resolve!('YButton');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects.some(item => String(item).includes('theme-chalk'))).toBe(false);
    expect(sideEffects).toContain('element-plus/es/components/button/style/index');
  });

  it('importElementStyles: false 时不注入 element-plus 样式', async () => {
    const resolver = YunElpResolver({ importElementStyles: false });
    const result = await resolver.resolve!('YTableSearch');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects).toEqual(['yun-elp/theme-chalk/src/table-search.scss']);
  });

  it('YLabel 仅有 yun-elp 样式、无 element-plus 依赖', async () => {
    const resolver = YunElpResolver();
    const result = await resolver.resolve!('YLabel');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects).toEqual(['yun-elp/theme-chalk/src/label.scss']);
    expect(sideEffects.some(item => item.includes('element-plus'))).toBe(false);
  });
});
