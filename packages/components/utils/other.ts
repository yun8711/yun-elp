/**
 * 根据值获取尺寸值
 * @param value 尺寸值
 * @returns
 */
export const getSizeValue = (value?: string | number) => {
  if (value) {
    return typeof value === 'number' ? `${value}px` : value;
  }
  return '';
};
