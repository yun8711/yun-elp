import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { RadioButtonProps, RadioGroupProps, RadioProps } from 'element-plus';

// 选项类型
export type SimpleRadioOption = RadioProps | RadioButtonProps;

// 组件的属性类型，继承RadioGroupProps，增加部分自定义属性
export type SimpleRadioProps = RadioGroupProps & {
  modelValue: string | number | boolean;
  options: SimpleRadioOption[];
  childType?: 'radio' | 'button';
};

export const simpleRadioProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: ''
  },
  options: {
    type: Array as PropType<SimpleRadioOption[]>,
    required: true,
    default: () => []
  },
  childType: {
    type: String as PropType<string>,
    default: 'radio'
  },
} as const;

export type SimpleRadioInstance = ExtractPublicPropTypes<typeof simpleRadioProps>;
