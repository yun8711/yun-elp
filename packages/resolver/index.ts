/**
 * YunElp 组件库解析器
 * 用于支持 unplugin-vue-components 和 unplugin-auto-import 插件
 * 参考 ElementPlus 解析器实现
 */
import type { ComponentResolver, ComponentInfo } from 'unplugin-vue-components/types';

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
   * 导入样式类型
   * @default 'scss'
   */
  importStyle?: boolean | 'css' | 'scss';
  /**
   * 排除组件名称，如果匹配则不解析组件
   */
  exclude?: RegExp;
}

type YunElpResolverOptionsResolved = {
  importStyle: boolean | 'css' | 'scss';
  exclude?: RegExp;
  noStylesComponents: string[];
};

const noStylesComponents = ['YAppWrap', 'YButton', 'YGroupSelect', 'YSelect'];

function getSideEffects(
  dirName: string,
  options: YunElpResolverOptionsResolved
): SideEffectsInfo | undefined {
  const { importStyle } = options;

  // 如果 importStyle 为 false，不导入样式
  if (importStyle === false) {
    return undefined;
  }

  const themeFolder = `${PACKAGE_NAME}/theme-chalk`;

  if (importStyle === 'scss') {
    return [`${themeFolder}/src/${dirName}.scss`];
  } else if (importStyle === true || importStyle === 'css') {
    return [`${themeFolder}/${dirName}.css`];
  }

  return undefined;
}

function resolveComponent(
  name: string,
  options: YunElpResolverOptionsResolved
): ComponentInfo | undefined {
  // 排除组件
  if (options.exclude?.test(name)) {
    return;
  }
  // 组件名必须以 Y 开头
  if (!name.match(/^Y[A-Z]/)) {
    return;
  }
  // 获取组件名 YLabel -> label
  const kebabName = kebabCase(name);
  const sideEffects = getSideEffects(kebabName, options);
  return {
    name,
    from: `${PACKAGE_NAME}`,
    sideEffects
  };
}

/**
 * YunElp组件解析器
 * 用于unplugin-vue-components插件，自动按需导入组件
 * 同时支持 scss 和 css 样式文件
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import Components from 'unplugin-vue-components/vite'
 * import { YunElpResolver } from 'yun-elp/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [YunElpResolver({
 *         importStyle: 'scss',
 *         noStylesComponents: ['YAppWrap'],
 *       })],
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
      importStyle: options?.importStyle || 'scss',
      exclude: options?.exclude,
      noStylesComponents: noStylesComponents,
    };
    return optionsResolved;
  }

  return {
    type: 'component',
    resolve: async (name: string) => {
      // name-组件名称，如YButton
      const options = await resolveOptions();
      if (options.noStylesComponents.includes(name)) {
        return resolveComponent(name, { ...options, importStyle: false });
      } else {
        return resolveComponent(name, options);
      }
    }
  };
}

export default YunElpResolver;
