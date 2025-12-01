import type { ExtractPublicPropTypes } from 'vue';

// 定义组件的属性接口
export interface BorderLabelProps {
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 组件宽度
   */
  width?: string | number;
  /**
   * 组件高度
   */
  height?: string | number;
  /**
   * 是否不显示边框
   */
  noBorder?: boolean;
}

// 定义 props 对象
export const borderLabelProps = {
  label: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: 'auto'
  },
  height: {
    type: String,
    default: '32px'
  },
  noBorder: {
    type: Boolean,
    default: false
  }
} as const;

// 导出实例类型
export type BorderLabelInstance = ExtractPublicPropTypes<typeof borderLabelProps>;
