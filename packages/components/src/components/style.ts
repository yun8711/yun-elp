/**
 * 样式按需导入入口
 * 提供给使用者通过 import 'kd-elp/es/components/k-button/style' 的方式导入
 */

// 导入基础样式
import '../styles/index.scss';

// 样式导入函数：动态导入组件样式
export const importStyle = (componentName: string) => {
  try {
    // 尝试导入组件样式
    return import(`./${componentName}/${componentName}.scss`);
  } catch (e) {
    console.warn(`[kd-elp] Component style not found: ${componentName}`);
    return Promise.resolve();
  }
};

// 组件样式导入映射
export const styleImporters = {
  'k-button': () => importStyle('button'),
  'k-config-provider': () => importStyle('config-provider')
  // 随着组件的增加，在这里添加更多组件的样式导入
};

// 导出默认样式加载器
export default styleImporters;
