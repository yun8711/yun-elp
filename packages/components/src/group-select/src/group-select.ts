import type { ExtractPublicPropTypes, PropType } from 'vue';

export interface GroupSelectOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

/** primary：实心主色；plain：白底，文本和边框为主题色 */
export type GroupSelectActiveType = 'primary' | 'plain';

export interface GroupSelectProps {
  modelValue: string | number;
  options: GroupSelectOption[];
  activeType?: GroupSelectActiveType;
  itemClass?: string;
  itemStyles?: Record<string, any>;
}

export interface GroupSelectEmits {
  'update:modelValue': [value: string | number];
  change: [
    payload: { value: string | number; item: GroupSelectOption; index: number; event: MouseEvent }
  ];
}

export const groupSelectProps = {
  modelValue: {
    type: [String, Number] as PropType<string | number>,
    default: ''
  },
  options: {
    type: Array as PropType<GroupSelectOption[]>,
    default: () => []
  },
  activeType: {
    type: String as PropType<GroupSelectActiveType>,
    default: 'primary',
    validator: (value: string) => value === 'primary' || value === 'plain'
  },
  itemClass: {
    type: String,
    default: ''
  },
  itemStyles: {
    type: Object,
    default: () => ({})
  }
} as const;

export type groupSelectInstance = ExtractPublicPropTypes<typeof groupSelectProps>;
