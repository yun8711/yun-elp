import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

// 定义组件的属性接口
export interface LabelProps {
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 组件总宽度
   */
  width?: string | number;
  /**
   * 组件高度
   */
  height?: string | number;
  /**
   * 标签宽度
   */
  labelWidth?: string | number;
  /**
   * 标签文本水平对齐方式
   */
  labelAlign?: 'left' | 'center' | 'right';
  /**
   * 标签后分隔符，默认无，border为false时有效
   */
  colon?: string;
  /**
   * 自定义样式
   */
  labelStyle?: Record<string, string | number>;
  /**
   * 自定义内容样式
   */
  contentStyle?: Record<string, string | number>;
}

// 定义 props 对象
export const labelProps = {
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
    default: ''
  },
  labelWidth: {
    type: String,
    default: 'auto'
  },
  labelAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  colon: {
    type: String,
    default: ''
  },
  labelStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  },
  contentStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  }
} as const;

// 导出实例类型
export type LabelInstance = ExtractPublicPropTypes<typeof labelProps>;
