import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { FormRules, FormItemProps, ElTooltipProps } from 'element-plus';

export interface ColumnFormProps {
  // 不使用el-form-item包裹
  noFrom?: boolean;
  // form中table字段名，用于绑定校验组
  tName?: string;
  // 表单验证规则
  rules?: FormRules | ((scope: any, prop: string) => FormRules);
  // 表单项的其他属性
  formProps?: Partial<FormItemProps>;
  // 表单项错误提示的tooltip属性
  tipProps?: Partial<ElTooltipProps>;
}

export const columnFormProps = {
  noFrom: {
    type: Boolean,
    default: false
  },
  tName: {
    type: String,
    default: 'tableData'
  },
  rules: {
    type: [Object, Function] as PropType<FormRules | ((scope: any, prop: string) => FormRules)>,
    default: undefined
  },
  formProps: {
    type: Object as PropType<Partial<FormItemProps>>,
    default: undefined
  },
  tipProps: {
    type: Object as PropType<Partial<ElTooltipProps>>,
    default: undefined
  },
} as const;

export type columnFormInstance = ExtractPublicPropTypes<typeof columnFormProps>;
