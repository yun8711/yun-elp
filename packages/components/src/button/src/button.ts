import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface ButtonProps {
  /**
   * 防抖延迟时间（毫秒）
   */
  delay?: number | string;
  /**
   * 最大
   */
  maxWait?: number | string | undefined;
}

export const buttonProps = {
  delay: {
    type: [Number, String],
    default: 300
  },
  maxWait: {
    type: [Number, String],
    default: undefined
  }
} as const;

export type buttonInstance = ExtractPublicPropTypes<typeof buttonProps>;
