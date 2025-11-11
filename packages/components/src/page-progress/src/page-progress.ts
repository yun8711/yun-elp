import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface PageProgressEmits {
  'update:modelValue': [value: boolean];
}

export interface PageProgressProps {
  /**
   * 进度条显示状态 (v-model)
   */
  modelValue?: boolean;
  /**
   * 步进距离 (0-100)，默认为8
   */
  step?: number;
  /**
   * 是否显示加载图标
   */
  spinner?: boolean;
  /**
   * 完成后的延迟隐藏时间 (ms)
   */
  delay?: number;
  /**
   * 自动增量速度 (ms)，每xx毫秒增加step进度
   */
  speed?: number;
}

export const pageProgressProps = {
  modelValue: {
    type: Boolean,
    default: false
  },
  step: {
    type: Number,
    default: 8,
    validator: (value: number) => value >= 0 && value <= 100
  },
  spinner: {
    type: Boolean,
    default: false
  },
  delay: {
    type: Number,
    default: 200
  },
  speed: {
    type: Number,
    default: 200
  }
} as const;

export type PageProgressInstance = ExtractPublicPropTypes<typeof pageProgressProps>;
