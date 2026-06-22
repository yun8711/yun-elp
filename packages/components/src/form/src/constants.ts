import type { FormRules } from 'element-plus';

/** 与 ElRow 官方 props 对齐：https://element-plus.org/zh-CN/component/layout.html#row-attributes */
export const ROW_PROP_KEYS = Object.freeze(['tag', 'gutter', 'justify', 'align'] as const);

/** 与 ElCol 官方 props 对齐：https://element-plus.org/zh-CN/component/layout.html#col-attributes */
export const COL_PROP_KEYS = Object.freeze([
  'tag',
  'span',
  'offset',
  'pull',
  'push',
  'xs',
  'sm',
  'md',
  'lg',
  'xl'
] as const);

/** 透传 attrs 时需额外排除的布局属性 */
export const ATTRS_LAYOUT_KEYS = ['class', 'style'] as const;

export type { FormRules };
