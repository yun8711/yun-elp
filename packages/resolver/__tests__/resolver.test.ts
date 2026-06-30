import { describe, expect, it } from 'vitest';
import {
  getElementPlusDepsForComponent,
  getElementPlusStylePaths,
  YUN_ELP_ELEMENT_PLUS_DEPS,
  type ElementPlusStyleFormat
} from '../ep-deps';
import {
  collectAllYunInternalComponents,
  collectYunInternalStyleComponents,
  getYunInternalDepsForComponent,
  YUN_ELP_INTERNAL_DEPS
} from '../yun-deps';
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
    for (const name of Object.keys(YUN_ELP_INTERNAL_DEPS)) {
      expect(name).toMatch(/^Y[A-Z]/);
    }
  });
});

describe('yun-deps', () => {
  it('YTableSearch 应包含 YBorderLabel 与 YButton 内部依赖', () => {
    expect(getYunInternalDepsForComponent('YTableSearch')).toEqual(['YBorderLabel', 'YButton']);
  });

  it('collectYunInternalStyleComponents 应递归收集需加载样式的内部组件', () => {
    expect(collectYunInternalStyleComponents('YTableSearch', ['YAppWrap', 'YGroupSelect'])).toEqual(
      ['YBorderLabel', 'YButton']
    );
    expect(collectYunInternalStyleComponents('YTableSearch', ['YButton'])).toEqual([
      'YBorderLabel'
    ]);
    expect(collectYunInternalStyleComponents('YColumnOp', ['YAppWrap', 'YGroupSelect'])).toEqual([
      'YButton',
      'YPop'
    ]);
    expect(collectYunInternalStyleComponents('YColumnOp', ['YButton'])).toEqual(['YPop']);
    expect(collectYunInternalStyleComponents('YTable', ['YAppWrap', 'YGroupSelect'])).toEqual([
      'YEmpty'
    ]);
    expect(collectYunInternalStyleComponents('YDesc', ['YAppWrap', 'YGroupSelect'])).toEqual([
      'YTextTooltip'
    ]);
  });

  it('collectAllYunInternalComponents 应包含无 y 样式的内部组件', () => {
    expect(collectAllYunInternalComponents('YDialog')).toEqual(['YButton']);
    expect(collectAllYunInternalComponents('YTableSearch')).toEqual(['YBorderLabel', 'YButton']);
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
    expect(sideEffects).toContain('yun-elp/theme-chalk/src/border-label.scss');
    expect(sideEffects).toContain('yun-elp/theme-chalk/src/button.scss');
    expect(sideEffects).toContain('element-plus/es/components/collapse-transition/style/index');
    expect(sideEffects).toContain('element-plus/es/components/button/style/index');
  });

  it('YButton 应注入 yun 与 element-plus button 样式', async () => {
    const resolver = YunElpResolver();
    const result = await resolver.resolve!('YButton');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects).toContain('yun-elp/theme-chalk/src/button.scss');
    expect(sideEffects).toContain('element-plus/es/components/button/style/index');
  });

  it('importElementStyles: false 时不注入 element-plus 样式', async () => {
    const resolver = YunElpResolver({ importElementStyles: false });
    const result = await resolver.resolve!('YTableSearch');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects).toEqual([
      'yun-elp/theme-chalk/src/border-label.scss',
      'yun-elp/theme-chalk/src/button.scss',
      'yun-elp/theme-chalk/src/table-search.scss'
    ]);
  });

  it('YLabel 仅有 yun-elp 样式、无 element-plus 依赖', async () => {
    const resolver = YunElpResolver();
    const result = await resolver.resolve!('YLabel');
    const sideEffects = result?.sideEffects as string[];

    expect(sideEffects).toEqual(['yun-elp/theme-chalk/src/label.scss']);
    expect(sideEffects.some(item => item.includes('element-plus'))).toBe(false);
  });

  it('解析 YTable 时应注入 YEmpty 样式', async () => {
    const resolver = YunElpResolver({ importElementStyles: false });
    const sideEffects = (await resolver.resolve!('YTable'))?.sideEffects as string[];

    expect(sideEffects).toEqual([
      'yun-elp/theme-chalk/src/empty.scss',
      'yun-elp/theme-chalk/src/table.scss'
    ]);
  });

  it('解析 YDesc 时应注入 YTextTooltip 样式', async () => {
    const resolver = YunElpResolver({ importElementStyles: false });
    const sideEffects = (await resolver.resolve!('YDesc'))?.sideEffects as string[];

    expect(sideEffects).toEqual([
      'yun-elp/theme-chalk/src/desc.scss',
      'yun-elp/theme-chalk/src/text-tooltip.scss'
    ]);
  });

  it('解析 YColumnOp 时应注入 YPop 样式', async () => {
    const resolver = YunElpResolver({ importElementStyles: false });
    const sideEffects = (await resolver.resolve!('YColumnOp'))?.sideEffects as string[];

    expect(sideEffects).toEqual([
      'yun-elp/theme-chalk/src/button.scss',
      'yun-elp/theme-chalk/src/column-op.scss',
      'yun-elp/theme-chalk/src/pop.scss'
    ]);
  });

  it('解析 YDialog 时应通过 YButton 注入 element-plus button 样式', async () => {
    const resolver = YunElpResolver();
    const sideEffects = (await resolver.resolve!('YDialog'))?.sideEffects as string[];

    expect(sideEffects).toContain('yun-elp/theme-chalk/src/dialog.scss');
    expect(sideEffects).toContain('yun-elp/theme-chalk/src/button.scss');
    expect(sideEffects).toContain('element-plus/es/components/dialog/style/index');
    expect(sideEffects).toContain('element-plus/es/components/button/style/index');
  });
});
