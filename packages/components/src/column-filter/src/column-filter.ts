import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface ColumnFilterConfig {
  text: string;
  value: any;
  color?: string;
  bgColor?: string;
}

export interface ColumnFilterConfig2 {
  [key: string]: any;
}

export interface ColumnFilterProps {
  // TODO: 定义属性
  noStatus?: boolean;
  noFilter?: boolean;
  // 值格式化函数
  formatter?: boolean | ((value: any, row: any, scope: any) => string);
  config?: ColumnFilterConfig[];
  // 自定义表头样式
  headerStyle?: Record<string, any>;
  // 自定义文本样式
  textStyle?: Record<string, any>;
}

export const columnFilterProps = {
  noStatus: {
    type: Boolean,
    default: false
  },
  noFilter: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: [Boolean, Function] as PropType<boolean | ((value: any, row: any, scope: any) => string)>,
    default: () => ''
  },
  config: {
    type: Array as PropType<ColumnFilterConfig[]>,
    default: () => []
  },
  headerStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  textStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
} as const;

export type columnFilterInstance = ExtractPublicPropTypes<typeof columnFilterProps>;
