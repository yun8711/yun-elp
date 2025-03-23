/**
 * KdElp 组件库解析器
 * 用于支持 unplugin-vue-components 和 unplugin-auto-import 插件
 */
// 定义ComponentResolver类型，避免直接依赖unplugin-vue-components
interface ComponentInfo {
  name: string;
  from: string;
  sideEffects?: string | string[];
}

interface ComponentResolver {
  type: string;
  resolve: (name: string) => ComponentInfo | void;
}

const PACKAGE_NAME = 'kd-elp';
const COMPONENT_PREFIX = 'K';

/**
 * KdElp组件解析器
 * 用于unplugin-vue-components插件
 */
export function KdElpResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith(COMPONENT_PREFIX)) {
        // 将PascalCase转换为kebab-case (例如：KButton -> k-button)
        const kebabName = name
          .replace(new RegExp(`^${COMPONENT_PREFIX}`), 'k')
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase();

        return {
          name: name, // 导出的组件名
          from: PACKAGE_NAME, // 从主包导入
          // 使用具体组件的样式路径，而不是全局样式
          sideEffects: `${PACKAGE_NAME}/components/${kebabName}/style`
        } as ComponentInfo;
      }
    }
  };
}

/**
 * 用于unplugin-auto-import插件的解析器
 * 自动导入工具函数
 */
interface AutoImportResolverOptions {
  /**
   * 要自动导入的工具函数列表
   * 默认为all
   */
  utils?: string[] | 'all';
}

export function KdElpAutoImportResolver(options: AutoImportResolverOptions = {}) {
  const { utils = 'all' } = options;

  return {
    type: 'component',
    resolveId: (id: string) => {
      if (id.startsWith('kd-elp/')) {
        return id;
      }
    },
    resolve: (name: string) => {
      // 如果指定了特定工具函数并且当前名称在列表中
      // 或者设置为'all'
      if ((Array.isArray(utils) && utils.includes(name)) || utils === 'all') {
        return {
          name,
          from: `${PACKAGE_NAME}/utils`
        };
      }
    }
  };
}

export default {
  KdElpResolver,
  KdElpAutoImportResolver
};
