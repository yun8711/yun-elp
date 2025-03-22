/**
 * 首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str || str.length === 0) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转连字符
 * @param str 驼峰字符串
 * @returns 连字符字符串
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 连字符转驼峰
 * @param str 连字符字符串
 * @returns 驼峰字符串
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
} 