/**
 * YunElp 组件库解析器
 * 用于支持 unplugin-vue-components 和 unplugin-auto-import 插件
 */
import type { ComponentResolver, ComponentInfo } from 'unplugin-vue-components/types';

const PACKAGE_NAME = 'yun-elp';
const COMPONENT_PREFIX = 'Y';

/**
 * YunElp组件解析器配置选项
 */
export interface YunElpResolverOptions {
  /**
   * 是否导入组件样式
   * @default true
   */
  importStyle?: boolean;
  /**
   * 是否导入 scss 样式
   * @default true
   */
  importScss?: boolean;
  /**
   * 组件前缀
   * @default 'Y'
   */
  prefix?: string;
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
 *         importStyle: false,
 *         importScss: false,
 *         prefix: 'Y',
 *       })],
 *     }),
 *   ],
 * })
 * ```
 */
export function YunElpResolver(options: YunElpResolverOptions = {}): ComponentResolver {
  const { importStyle = true, importScss = true, prefix = COMPONENT_PREFIX } = options;

  return {
    type: 'component',
    resolve: (name: string): ComponentInfo | undefined => {
      console.log('name', name);
      if (name.startsWith(prefix)) {
        // 将PascalCase转换为kebab-case (例如：YButton -> y-button)
        const kebabName = name
          .replace(new RegExp(`^${prefix}`), 'y')
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase();

        const sideEffects: string[] = [];
        if (importStyle) {
          if (importScss) {
            sideEffects.push(`${PACKAGE_NAME}/theme-chalk/src/${kebabName}.scss`);
          }
          sideEffects.push(`${PACKAGE_NAME}/theme-chalk/${kebabName}.css`);
        }

        return {
          name,
          from: `${PACKAGE_NAME}/es/components`,
          sideEffects: sideEffects.length ? sideEffects : undefined
        };
      }
    }
  };
}

/**
 * YunElp自动导入解析器配置选项
 */
export interface YunElpAutoImportResolverOptions {
  /**
   * 要自动导入的工具函数列表
   * @default 'all'
   */
  utils?: string[] | 'all';
  /**
   * 是否导入组件样式
   * @default true
   */
  importStyle?: boolean;
}

/**
 * YunElp自动导入解析器
 * 用于unplugin-auto-import插件，自动导入工具函数
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import AutoImport from 'unplugin-auto-import/vite'
 * import { YunElpAutoImportResolver } from 'yun-elp/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     AutoImport({
 *       resolvers: [YunElpAutoImportResolver({
 *         importStyle: false,
 *       })],
 *     }),
 *   ],
 * })
 * ```
 */
export function YunElpAutoImportResolver(options: YunElpAutoImportResolverOptions = {}) {
  const { utils = 'all', importStyle = true } = options;

  return {
    type: 'component',
    resolveId: (id: string) => {
      if (id.startsWith(`${PACKAGE_NAME}/`)) {
        return id;
      }
    },
    resolve: (name: string) => {
      // 如果指定了特定工具函数并且当前名称在列表中
      // 或者设置为'all'
      if ((Array.isArray(utils) && utils.includes(name)) || utils === 'all') {
        return {
          name,
          from: `${PACKAGE_NAME}/es/utils`,
          sideEffects: importStyle ? [`${PACKAGE_NAME}/theme-chalk/index.css`] : undefined
        };
      }
    }
  };
}

export default {
  YunElpResolver,
  YunElpAutoImportResolver
};
