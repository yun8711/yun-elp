/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 拷贝后的新对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }
  
  if (obj instanceof Object) {
    const copy = {} as Record<string, unknown>
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, unknown>)[key])
    })
    return copy as T
  }
  
  return obj
}

/**
 * 合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function mergeObjects<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as T & U
  
  Object.keys(source).forEach(key => {
    const targetValue = (target as Record<string, unknown>)[key]
    const sourceValue = (source as Record<string, unknown>)[key]
    
    if (
      targetValue &&
      sourceValue &&
      typeof targetValue === 'object' &&
      typeof sourceValue === 'object' &&
      !Array.isArray(targetValue) &&
      !Array.isArray(sourceValue)
    ) {
      (result as Record<string, unknown>)[key] = mergeObjects(
        targetValue as object,
        sourceValue as object
      )
    } else {
      (result as Record<string, unknown>)[key] = sourceValue
    }
  })
  
  return result
} 