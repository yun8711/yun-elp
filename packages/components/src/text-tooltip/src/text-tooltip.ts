import type { ExtractPublicPropTypes } from 'vue';
import type { ElTooltipProps } from 'element-plus';

export type TextTooltipProps = Partial<ElTooltipProps> & {
  // 展示最大行数
  lineClamp?: number;
  // 宽度，默认100%
  width?: string | number;
  // tooltip显示方式
  model?: 'auto' | 'none' | 'always';
  textStyle?: Record<string, any>;
}

export const textTooltipProps = {
  lineClamp: {
    type: Number,
    default: 1
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  model: {
    type: String,
    default: 'auto',
    validator: (value: string) => ['auto', 'none', 'always'].includes(value)
  },
  textStyle: {
    type: Object,
    default: () => ({})
  },
} as const;

export type TextTooltipInstance = ExtractPublicPropTypes<typeof textTooltipProps>;
