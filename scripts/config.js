/**
 * 组件库配置
 */

// 组件前缀
export const COMPONENT_PREFIX = 'k'

// 获取完整的组件名称（带前缀）
export function getComponentName (name) {
  return name.startsWith(`${COMPONENT_PREFIX}-`) ? name : `${COMPONENT_PREFIX}-${name}`
}

// 获取不带前缀的组件名称
export function getComponentNameWithoutPrefix (name) {
  return name.startsWith(`${COMPONENT_PREFIX}-`) ? name.slice(COMPONENT_PREFIX.length + 1) : name
}

// 获取组件目录名（不带前缀）
export function getComponentDirName (name) {
  return getComponentNameWithoutPrefix(name)
}

// 获取组件文件名（不带前缀）
export function getComponentFileName (name) {
  return getComponentNameWithoutPrefix(name)
}

// 将短横线命名转换为大驼峰命名
export function toPascalCase (name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}
