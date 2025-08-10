import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { ScrollbarProps } from 'element-plus';

export interface ScrollBoxProps {
  // 高度
  height?: string | number;
  // 宽度
  width?: string | number;
  // 箭头显示模式
  // always: 始终显示箭头
  // auto: 根据内容是否超出自动显示/隐藏
  arrowModel?: 'always' | 'auto';
  // 箭头样式
  arrowStyle?: Record<string, any>;

  // 滚动条配置
  scrollbarProps?: Partial<ScrollbarProps>;
  // 滚动步进距离
  step?: number;
  // 连续滚动步进距离
  continuousStep?: number;
  // 连续滚动触发时间（毫秒）
  continuousTime?: number;
  // 是否支持连续滚动
  continuous?: boolean;
  // 是否支持鼠标滚轮触发水平滚动
  wheelScroll?: boolean;
}

export interface ScrollBoxEmits {
  // 滚动事件
  scroll: [scrollLeft: number];
}

export interface ScrollBoxExpose {
  // 检查滚动状态
  checkScrollStatus: () => void;
  // scrollbar 实例
  scrollbarRef: any;
  // 内容元素
  contentRef: HTMLElement | undefined;
  // 滚动到指定位置
  scrollTo: (scrollLeft: number) => void;
  // 滚动到开始位置
  scrollToStart: () => void;
  // 滚动到结束位置
  scrollToEnd: () => void;
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
  scrollbarProps: {
    type: Object as PropType<Partial<ScrollbarProps>>,
    default: () => ({})
  },
  step: {
    type: Number,
    default: 30
  },
  continuousStep: {
    type: Number,
    default: undefined
  },
  continuousTime: {
    type: Number,
    default: 300
  },
  continuous: {
    type: Boolean,
    default: false
  },
  wheelScroll: {
    type: Boolean,
    default: false
  },
} as const;

export type ScrollBoxInstance = ExtractPublicPropTypes<typeof scrollBoxProps>;
