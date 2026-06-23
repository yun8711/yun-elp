import type { ExtractPublicPropTypes, InjectionKey, PropType, Ref } from 'vue';
import type { FormRules } from 'element-plus';

export interface FormChangeContext {
  field: string;
  prevValue: unknown;
  newValue: unknown;
}

export type FormConfigFn = (model: Record<string, any>, context: FormChangeContext) => void;

export interface FormProps {
  /** 对应 el-form.model */
  model?: Record<string, any>;
  /** 对应 el-form.rules */
  rules?: FormRules;
  /** 表单数据变化时的回调，(model, context) => void */
  config?: FormConfigFn | null;
  /** el-row 的 class */
  rowClass?: string;
  /** el-row 的 style */
  rowStyle?: Record<string, any>;
  /** y-form-item 默认栅格占位，对应 el-col.span */
  span?: number;
  /** 静态字段，不监听的字段，这些字段变化时不触发 config */
  staticFields?: string[];
  /** 队列处理防抖时间（ms），0 表示不防抖，立即处理 */
  debounce?: number;
}

export const formProps = {
  model: {
    type: Object as PropType<FormProps['model']>,
    default: () => ({})
  },
  rules: {
    type: Object as PropType<FormProps['rules']>,
    default: () => ({})
  },
  config: {
    type: [Function, null] as PropType<FormConfigFn | null>,
    default: null
  },
  rowClass: {
    type: String,
    default: ''
  },
  rowStyle: {
    type: Object as PropType<FormProps['rowStyle']>,
    default: () => ({})
  },
  span: {
    type: Number,
    default: 24
  },
  staticFields: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  debounce: {
    type: Number,
    default: 300
  }
} as const;

export type FormInstance = ExtractPublicPropTypes<typeof formProps>;

export interface YFormContext {
  span: Ref<number>;
}

export const Y_FORM_INJECTION_KEY: InjectionKey<YFormContext> = Symbol('yForm');

export * from './constants';
