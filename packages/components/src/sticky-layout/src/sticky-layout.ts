import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface StickyLayoutProps {
  // 滚动容器（支持 CSS 选择器字符串或 HTMLElement）
  scrollContainer?: string | HTMLElement;
}

export interface StickyLayoutSlots {
  // 默认插槽（内容区域）
  default?: () => any;
  // 左侧区域插槽
  left?: (props: { height: number }) => any;
  // 右侧区域插槽
  right?: (props: { height: number }) => any;
}

export const stickyLayoutProps = {
  scrollContainer: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: undefined
  }
} as const;

export type StickyLayoutInstance = ExtractPublicPropTypes<typeof stickyLayoutProps>;
