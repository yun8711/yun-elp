import type { ExtractPublicPropTypes } from '@vue/runtime-core';

// 定义组件的属性接口
export interface LabelProps {
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 标签宽度
   */
  width?: string;
  /**
   * 是否块级显示
   */
  block?: boolean;
}

// 定义 props 对象
export const labelProps = {
  label: {
    type: String,
    default: undefined
  },
  width: {
    type: String,
    default: '316px'
  },
  block: {
    type: Boolean,
    default: false
  }
} as const;

// 导出实例类型
export type LabelInstance = ExtractPublicPropTypes<typeof labelProps>;
