import type { ExtractPublicPropTypes } from '@vue/runtime-core';
import type { ElTooltipProps } from 'element-plus';

// 定义组件的属性接口
export interface ButtonProps {
  /**
   * 防抖延迟时间（毫秒）
   */
  delay?: number | string;
  /**
   * 最大
   */
  maxWait?: number | string | undefined;
  /**
   * tooltip配置
   */
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

  content?: string;
  tooltipProps?: Partial<ElTooltipProps>;
}

// 定义 props 对象
export const buttonProps = {
  // y-button 特有的 props
  delay: {
    type: [Number, String],
    default: 300
  },
  maxWait: {
    type: [Number, String],
    default: undefined
  },
  placement: {
    type: String,
    default: 'top'
  },
  content: {
    type: String,
    default: ''
  },
  tooltipProps: {
    type: Object,
    default: () => ({})
  }
} as const;

// 导出实例类型
export type ButtonInstance = ExtractPublicPropTypes<typeof buttonProps>;
