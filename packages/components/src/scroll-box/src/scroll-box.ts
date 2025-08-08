import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { ScrollbarProps } from 'element-plus';

export interface ScrollBoxProps {
  // 高度
  height?: string | number;
  // 宽度
  width?: string | number;

  // 箭头显示模式
  // always: 始终显示箭头
  // auto: 水平滚动时根据内容是否超出自动显示/隐藏，垂直滚动时不显示（可通过鼠标滚轮操作）
  arrowModel?: 'always' | 'auto';
  // 箭头样式
  arrowStyle?: Record<string, any>;

  // 滚动方向
  direction?: 'horizontal' | 'vertical';
  // 滚动条配置
  scrollbarProps?: Partial<ScrollbarProps>;
  // 滚动步进距离
  step?: number;
  // 是否支持连续滚动
  continuous?: boolean;
  // 是否支持鼠标滚轮触发水平滚动（仅在水平滚动模式下生效）
  wheelScroll?: boolean;
}

export const scrollBoxProps = {
  height: {
    type: [String, Number],
    default: '100%'
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  arrowModel: {
    type: String as PropType<'always' | 'auto'>,
    default: 'auto'
  },
  arrowStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
    validator: (value: string) => {
      return ['horizontal', 'vertical'].includes(value);
    }
  },
  scrollbarProps: {
    type: Object as PropType<Partial<ScrollbarProps>>,
    default: () => ({})
  },
  step: {
    type: Number,
    default: 30
  },
  continuous: {
    type: Boolean,
    default: false
  },
  wheelScroll: {
    type: Boolean,
    default: false
  }
} as const;

export type ScrollBoxInstance = ExtractPublicPropTypes<typeof scrollBoxProps>;
