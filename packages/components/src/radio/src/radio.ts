import type { ExtractPublicPropTypes, PropType } from 'vue';
import type { RadioGroupProps, RadioProps as ElRadioProps, RadioButtonProps } from 'element-plus';

// 选项类型
export type RadioOption =
  | string
  | number
  | boolean
  | Partial<ElRadioProps>
  | Partial<RadioButtonProps>;

// 组件的属性类型，继承RadioGroupProps，增加部分自定义属性
export type RadioProps = RadioGroupProps & {
  modelValue: string | number | boolean;
  options: RadioOption[];
  childType?: 'radio' | 'button';
  disabledMethod?: (option: RadioOption) => boolean;
};

export const radioProps = {
  modelValue: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: ''
  },
  options: {
    type: Array as PropType<RadioOption[]>,
    required: true,
    default: () => []
  },
  childType: {
    type: String as PropType<string>,
    default: 'radio'
  },
  disabledMethod: {
    type: Function as PropType<(option: RadioOption) => boolean>,
    default: () => false
  }
} as const;

export type RadioInstance = ExtractPublicPropTypes<typeof radioProps>;
