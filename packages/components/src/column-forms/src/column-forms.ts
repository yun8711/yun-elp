import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { ElTooltipProps, FormItemProps } from 'element-plus';

// 组件中表单项配置
export interface ColumnFormsItem {
  // 表单项的prop
  prop: string;
  // 表单项的label
  label?: string;
  // 表单项的label宽度
  labelWidth?: string | number;
  // 表单项的规则
  rules?: any;
  // 表单项的其他属性
  formAttrs?: Partial<FormItemProps> | ((scope: any, prop: string) => Partial<FormItemProps>);
  // 表单项的显示条件
  show?: boolean | ((scope: any, prop: string) => boolean);
  width?: string | ((scope: any, prop: string) => string);
  // 表单项错误提示的tooltip属性
  tooltipAttrs?: Partial<ElTooltipProps> | ((scope: any, prop: string) => Partial<ElTooltipProps>);

  style?: Record<string, any> | ((scope: any, prop: string) => Record<string, any>);
}

// 组件props
export interface ColumnFormsProps {
  options?: ColumnFormsItem[];
  // 多个表单时的布局方式，默认是纵向布局
  inline?: boolean;
  //form中table字段名，用于绑定校验组
  tName?: string;
  // 自定义表头样式
  headerStyle?: Record<string, string | number>;
}

export const columnFormsProps = {
  options: {
    type: Array as PropType<ColumnFormsItem[]>,
    default: () => []
  },
  inline: {
    type: Boolean,
    default: true
  },
  tName: {
    type: String,
    default: ''
  },
  headerStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  }
} as const;

export type columnFormsInstance = ExtractPublicPropTypes<typeof columnFormsProps>;
