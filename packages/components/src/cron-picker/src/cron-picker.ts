import type { ExtractPublicPropTypes } from '@vue/runtime-core';

export interface CronPickerProps {
  /**
   * Cron表达式值
   */
  modelValue?: string;
  /**
   * 禁止下拉周期选项
   */
  disabledPeriod?: string[];
  /**
   * 修改默认值，例如切换到年时默认选中的时间
   */
  editDefaultValue?: Record<string, any>;
  /**
   * 默认调度周期
   */
  defaultPeriod?: string;
  /**
   * 占位符
   */
  placeholder?: string;
}

export const cronPickerProps = {
  modelValue: {
    type: String,
    default: ''
  },
  disabledPeriod: {
    type: Array,
    default: () => []
  },
  editDefaultValue: {
    type: Object,
    default: () => ({})
  },
  defaultPeriod: {
    type: String,
    default: 'MINUTE'
  },
  placeholder: {
    type: String,
    default: undefined
  },
} as const;

export type cronPickerInstance = ExtractPublicPropTypes<typeof cronPickerProps>;

export interface CronPickerEmits {
  'update:modelValue': [value: string];
  'change': [value: string];
}
