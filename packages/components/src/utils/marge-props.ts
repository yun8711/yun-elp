/**
 * 合并对象属性，当后面的值为undefined时保留前面的值
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
const mergeProps = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] !== undefined) {
      result[key as keyof T] = source[key] as T[keyof T];
    }
  });
  return result;
};

export default mergeProps;
