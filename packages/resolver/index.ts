/**
 * YunElp 组件库解析器
 * 用于支持 unplugin-vue-components 和 unplugin-auto-import 插件
 * 参考 ElementPlus 解析器实现
 */
import type { ComponentResolver, ComponentInfo } from 'unplugin-vue-components/types';
import {
  getElementPlusDepsForComponent,
  getElementPlusStylePaths,
  type ElementPlusStyleFormat
} from './ep-deps.ts';
import { collectYunInternalStyleComponents, collectAllYunInternalComponents } from './yun-deps.ts';

const PACKAGE_NAME = 'yun-elp';

interface ImportInfo {
  as?: string;
  name?: string;
  from: string;
}

type SideEffectsInfo = (ImportInfo | string)[] | ImportInfo | string | undefined;

/**
 * 将 PascalCase 转换为 kebab-case
 */
function kebabCase(componentName: string) {
  return componentName
    .replace(/^Y/, '') // 移除开头的 Y
    .replace(/([A-Z])/g, (match, offset, string) => {
      // 如果不是第一个字符，且前一个字符不是大写，则添加连字符
      return offset > 0 && string[offset - 1] >= 'A' && string[offset - 1] <= 'Z'
        ? match.toLowerCase()
        : '-' + match.toLowerCase();
    })
    .replace(/^-/, ''); // 移除开头的连字符（如果有的话）
}

/**
 * YunElp组件解析器配置选项
 */
export interface YunElpResolverOptions {
  /**
   * 导入 yun-elp 样式类型
   * @default 'scss'
   */
  importStyle?: boolean | 'css' | 'scss';
  /**
   * 是否自动注入 y 组件内部依赖的 Element Plus 组件样式
   * @default true
   */
  importElementStyles?: boolean;
  /**
   * Element Plus 样式导入方式，需与 ElementPlusResolver 的 importStyle 保持一致
   * @default 'sass'
   */
  importElementStyle?: ElementPlusStyleFormat;
  /**
   * 排除组件名称，如果匹配则不解析组件
   */
  exclude?: RegExp;
}

type YunElpResolverOptionsResolved = {
  importStyle: boolean | 'css' | 'scss';
  importElementStyles: boolean;
  importElementStyle: ElementPlusStyleFormat;
  exclude?: RegExp;
  noStylesComponents: string[];
};

const noStylesComponents = ['YAppWrap', 'YGroupSelect'];

function getYunStylePaths(dirNames: string[], options: YunElpResolverOptionsResolved): string[] {
  const { importStyle } = options;

  if (importStyle === false || dirNames.length === 0) {
    return [];
  }

  const themeFolder = `${PACKAGE_NAME}/theme-chalk`;

  return dirNames.map(dirName =>
    importStyle === 'scss' ? `${themeFolder}/src/${dirName}.scss` : `${themeFolder}/${dirName}.css`
  );
}

function getYunSideEffects(
  componentName: string,
  options: YunElpResolverOptionsResolved
): SideEffectsInfo | undefined {
  const { importStyle, noStylesComponents } = options;

  if (importStyle === false) {
    return undefined;
  }

  const styleDirNames = new Set<string>();

  if (!noStylesComponents.includes(componentName)) {
    styleDirNames.add(kebabCase(componentName));
  }

  for (const dep of collectYunInternalStyleComponents(componentName, noStylesComponents)) {
    styleDirNames.add(kebabCase(dep));
  }

  const paths = getYunStylePaths([...styleDirNames].sort(), options);

  return paths.length > 0 ? paths : undefined;
}

function getElementSideEffects(
  componentName: string,
  options: YunElpResolverOptionsResolved
): string[] | undefined {
  if (!options.importElementStyles) {
    return undefined;
  }

  const deps = new Set(getElementPlusDepsForComponent(componentName));

  for (const internalComponent of collectAllYunInternalComponents(componentName)) {
    for (const dep of getElementPlusDepsForComponent(internalComponent)) {
      deps.add(dep);
    }
  }

  const paths = getElementPlusStylePaths([...deps].sort(), options.importElementStyle);

  return paths.length > 0 ? paths : undefined;
}

function mergeSideEffects(
  yunEffects: SideEffectsInfo | undefined,
  elementEffects: string[] | undefined
): SideEffectsInfo | undefined {
  const merged = [
    ...(Array.isArray(yunEffects) ? yunEffects : yunEffects ? [yunEffects] : []),
    ...(elementEffects ?? [])
  ];

  return merged.length > 0 ? merged : undefined;
}

function resolveComponent(
  name: string,
  options: YunElpResolverOptionsResolved
): ComponentInfo | undefined {
  if (options.exclude?.test(name)) {
    return;
  }

  if (!name.match(/^Y[A-Z]/)) {
    return;
  }

  const sideEffects = mergeSideEffects(
    getYunSideEffects(name, options),
    getElementSideEffects(name, options)
  );

  return {
    name,
    from: PACKAGE_NAME,
    sideEffects
  };
}

/**
 * YunElp组件解析器
 * 用于unplugin-vue-components插件，自动按需导入组件
 * 同时支持 scss 和 css 样式文件，并可注入内部依赖的 Element Plus 样式
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import Components from 'unplugin-vue-components/vite'
 * import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
 * import { YunElpResolver } from 'yun-elp/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [
 *         ElementPlusResolver({ importStyle: 'sass' }),
 *         YunElpResolver({
 *           importStyle: 'scss',
 *           importElementStyle: 'sass',
 *         }),
 *       ],
 *     }),
 *   ],
 * })
 * ```
 */
export function YunElpResolver(options: YunElpResolverOptions = {}): ComponentResolver {
  let optionsResolved: YunElpResolverOptionsResolved;

  async function resolveOptions() {
    if (optionsResolved) return optionsResolved;
    optionsResolved = {
      importStyle: options?.importStyle ?? 'scss',
      importElementStyles: options?.importElementStyles ?? true,
      importElementStyle: options?.importElementStyle ?? 'sass',
      exclude: options?.exclude,
      noStylesComponents
    };
    return optionsResolved;
  }

  return {
    type: 'component',
    resolve: async (name: string) => {
      const options = await resolveOptions();
      if (options.noStylesComponents.includes(name)) {
        return resolveComponent(name, { ...options, importStyle: false });
      }

      return resolveComponent(name, options);
    }
  };
}

export default YunElpResolver;

export { YUN_ELP_ELEMENT_PLUS_DEPS } from './ep-deps.ts';
export { YUN_ELP_INTERNAL_DEPS } from './yun-deps.ts';
