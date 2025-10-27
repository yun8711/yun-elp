import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface StickyPageProps {
  // leftWidth?: number;
  // rightWidth?: number;
  // 左侧是否吸顶
  leftSticky?: boolean;
  // 右侧是否吸顶
  rightSticky?: boolean;
  // 是否显示左侧边框线
  leftBorder?: boolean;
  // 是否显示右侧边框线
  rightBorder?: boolean;
  // 是否显示顶部边框线
  topBorder?: boolean;
  // 底部预留高度
  bottom?: number;
  // 滚动容器（支持 CSS 选择器字符串或 HTMLElement）
  scrollContainer?: string | HTMLElement;
}

export interface StickyPageSlots {
  // 默认插槽（内容区域）
  default?: () => any;
  // 左侧区域插槽
  left?: (props: { height: number }) => any;
  // 右侧区域插槽
  right?: (props: { height: number }) => any;
}

export interface StickyPageExpose {
  // 重新计算布局
  updateLayout: () => void;
}

export const stickyPageProps = {
  // leftWidth: {
  //   type: Number as PropType<number>,
  //   default: 0
  // },
  // rightWidth: {
  //   type: Number as PropType<number>,
  //   default: 0
  // },
  leftSticky: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  rightSticky: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  leftBorder: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  rightBorder: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  topBorder: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  bottom: {
    type: Number as PropType<number>,
    default: 0
  },
  scrollContainer: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined
  }
} as const;

export type StickyPageInstance = ExtractPublicPropTypes<typeof stickyPageProps>;
