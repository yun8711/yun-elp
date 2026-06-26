export type DirectionType = 'ltr' | 'rtl';
export type DirectionSetting = DirectionType | 'auto';

export const directionContextKey = Symbol('yun-elp-direction');

/** 默认按 RTL 排版的语言 */
export const RTL_LOCALES = ['ar'] as const;

/**
 * 根据 locale 与 direction 配置解析实际排版方向
 */
export function resolveDirection(
  locale: string,
  direction: DirectionSetting = 'auto'
): DirectionType {
  if (direction !== 'auto') {
    return direction;
  }
  return (RTL_LOCALES as readonly string[]).includes(locale) ? 'rtl' : 'ltr';
}
