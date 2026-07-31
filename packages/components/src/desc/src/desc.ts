import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { DescriptionItemProps } from 'element-plus';
import type { TextTooltipProps } from '../../text-tooltip/src/text-tooltip';

/** 默认空值规则：null / undefined / 空字符串（字符串会先 trim） */
export const defaultEmptyRule = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
};

export type DescEmptyRule = (value: any) => boolean;

export type DescItem = Partial<DescriptionItemProps> & {
  content?: any;
  path?: string;
  prop?: string;
  label?: string;
  noTooltip?: boolean;
  labelStyle?: Record<string, any>;
  contentStyle?: Record<string, any>;
  labelWidth?: string | number;
  labelAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  span?: number | 'column'; // 占用列数：数字、整行、自动填充
  format?: (value: any) => any; // 格式化函数
  // text-tooltip配置
  textTooltip?: TextTooltipProps;
  // 空值时的显示内容
  emptyText?: string;
  // 空值规则，也就是什么情况下显示空值
  emptyRule?: DescEmptyRule;
};

export interface DescProps {
  // 数据
  data: Record<string, any>;
  // 配置
  config: DescItem[];
  // 布局方向
  direction?: 'horizontal' | 'vertical';
  // 列数自适应方法
  column?: number | ((width: number) => number);
  // labelWidth
  labelWidth?: string | number;
  // labelStyle
  labelStyle?: Record<string, any>;
  // contentStyle
  contentStyle?: Record<string, any>;
  // 对齐方式
  labelAlign?: 'left' | 'center' | 'right';
  contentAlign?: 'left' | 'center' | 'right';
  noTooltip?: boolean;
  // 空值时的显示内容
  emptyText?: string;
  // 空值规则，也就是什么情况下显示空值
  emptyRule?: DescEmptyRule;
}

export const descProps = {
  data: {
    type: Object as PropType<DescProps['data']>,
    default: () => ({})
  },
  config: {
    type: Array as PropType<DescProps['config']>,
    default: () => []
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal'
  },
  column: {
    type: [Number, Function] as PropType<DescProps['column']>,
    default: 3
  },
  labelWidth: {
    type: [String, Number] as PropType<DescProps['labelWidth']>,
    default: undefined
  },
  labelStyle: {
    type: Object as PropType<DescProps['labelStyle']>,
    default: () => ({})
  },
  contentStyle: {
    type: Object as PropType<DescProps['contentStyle']>,
    default: () => ({})
  },
  labelAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  contentAlign: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'left'
  },
  emptyText: {
    type: String as PropType<DescProps['emptyText']>,
    default: ''
  },
  emptyRule: {
    type: Function as PropType<DescProps['emptyRule']>,
    default: undefined
  },
  noTooltip: {
    type: Boolean as PropType<DescProps['noTooltip']>,
    default: false
  }
} as const;

export type descriptionsInstance = ExtractPublicPropTypes<typeof descProps>;
