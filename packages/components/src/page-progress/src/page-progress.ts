import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface PageProgressProps {
  /**
   * 是否启用自动模式，自动监听页面加载状态
   */
  auto?: boolean;
  /**
   * 进度条显示状态 (v-model)
   */
  modelValue?: boolean;
  /**
   * 最小进度值 (0-100)，默认为8
   */
  minimum?: number;
  /**
   * 是否显示加载图标
   */
  showSpinner?: boolean;
  /**
   * 动画缓动函数
   */
  easing?: string;
  /**
   * 动画速度 (ms)
   */
  speed?: number;
  /**
   * 是否启用自动增量
   */
  trickle?: boolean;
  /**
   * 自动增量速度 (ms)
   */
  trickleSpeed?: number;
  /**
   * 父容器选择器
   */
  parent?: string;
}

export const pageProgressProps = {
  auto: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: undefined
  },
  minimum: {
    type: Number,
    default: 8,
    validator: (value: number) => value >= 0 && value <= 100
  },
  showSpinner: {
    type: Boolean,
    default: true
  },
  easing: {
    type: String,
    default: 'linear'
  },
  speed: {
    type: Number,
    default: 200
  },
  trickle: {
    type: Boolean,
    default: true
  },
  trickleSpeed: {
    type: Number,
    default: 200
  },
  parent: {
    type: String,
    default: 'body'
  },
} as const;

export type PageProgressInstance = ExtractPublicPropTypes<typeof pageProgressProps>;
