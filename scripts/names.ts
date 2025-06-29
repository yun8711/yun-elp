/**
 * 组件库配置
 */

// 组件前缀小写
import { COMPONENT_PREFIX } from './base-config';
// 组件前缀大写
export const COMPONENT_PREFIX_UPPER = COMPONENT_PREFIX.toUpperCase();

/**
 * 获取组件大驼峰名称
 * @example
 * getCamelCaseName('button') // Button
 * getCamelCaseName('app-wrap', true) // YAppWrap
 * @param name 组件名称,使用小写字母、连字符
 * @param prefix 是否带前缀
 * @returns 组件注册名称，大驼峰写法
 */
export function getCamelCaseName(name: string, prefix?: boolean) {
  const camelCaseName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return prefix ? `${COMPONENT_PREFIX_UPPER}${camelCaseName}` : camelCaseName;
}

/**
 * 获取组件小写、连字符名称
 * @example
 * getKebabCaseName('YButton') // y-button
 * getKebabCaseName('YAppWrap', false) // app-wrap
 * @param name 组件名称,使用大驼峰写法
 * @param prefix 是否带前缀
 * @returns 组件注册名称，小写字母、连字符写法
 */
export function getKebabCaseName(name: string, prefix?: boolean) {
  const kebabCaseName = name
    .replace(new RegExp(`^${COMPONENT_PREFIX}`), 'y')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();
  return prefix ? `${COMPONENT_PREFIX}-${kebabCaseName}` : kebabCaseName;
}

// 获取完整的组件名称（带前缀）
export function getComponentName(name: string) {
  return name.startsWith(`${COMPONENT_PREFIX}-`) ? name : `${COMPONENT_PREFIX}-${name}`;
}

// 获取不带前缀的组件名称
export function getComponentNameWithoutPrefix(name: string) {
  return name.startsWith(`${COMPONENT_PREFIX}-`) ? name.slice(COMPONENT_PREFIX.length + 1) : name;
}

// 获取组件目录名（不带前缀）
export function getComponentDirName(name: string) {
  return getComponentNameWithoutPrefix(name);
}

// 获取组件文件名（不带前缀）
export function getComponentFileName(name: string) {
  return getComponentNameWithoutPrefix(name);
}
