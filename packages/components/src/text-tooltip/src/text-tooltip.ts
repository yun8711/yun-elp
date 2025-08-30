import type { ExtractPublicPropTypes } from '@vue/runtime-core';
import type { ElTooltipProps } from 'element-plus';

export interface TextTooltipProps {
  // 展示最大行数
  lineClamp?: string | number;
  // 宽度，默认100%
  width?: string | number;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end';
  // tooltip显示方式
  model?: 'auto' | 'none' | 'always';
  tooltipProps?: Partial<ElTooltipProps>;
  textStyle?: Record<string, any>;
}

export const textTooltipProps = {
  lineClamp: {
    type: [String, Number],
    default: 1
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  placement: {
    type: String,
    default: 'top'
  },
  model: {
    type: String,
    default: 'auto',
    validator: (value: string) => ['auto', 'none', 'always'].includes(value)
  },
  tooltipProps: {
    type: Object,
    default: () => ({})
  },
  textStyle: {
    type: Object,
    default: () => ({})
  },
} as const;

export type TextTooltipInstance = ExtractPublicPropTypes<typeof textTooltipProps>;
