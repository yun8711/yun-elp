import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface EchartsProps {
  /** 图表配置项 */
  option?: any;
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 图表主题 */
  theme?: string | object;
  /** 初始化参数 */
  initOpts?: any;
};

export const echartsProps = {
  option: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
  },
  theme: {
    type: [String, Object],
    default: undefined
  },
  initOpts: {
    type: Object,
    default: () => ({})
  }
} as const;

export type echartsInstance = ExtractPublicPropTypes<typeof echartsProps>;
