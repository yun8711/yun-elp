import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { ElTooltipProps } from 'element-plus';

export interface ColumnTextProps {
  // 是否以link-链接展示
  link?: boolean;
  // 值格式化函数
  formatter?: (value: any, row: any, scope: any) => string;
  // 自定义文本样式
  textStyle?: Record<string, any>;
  // 是否禁用tooltip
  noTip?: boolean;
  // 自定义toolti属性，在noTip为true时生效
  tipProps?: Partial<ElTooltipProps>;
}

export const columnTextProps = {
  link: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: Function as PropType<(value: any, row: any, scope: any) => string> | undefined,
    default: () => ''
  },
  textStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  },
  tipProps: {
    type: Object as PropType<Partial<ElTooltipProps>>,
    default: () => ({})
  },
  noTip: {
    type: Boolean,
    default: false
  }
} as const;

export type columnTextInstance = ExtractPublicPropTypes<typeof columnTextProps>;
