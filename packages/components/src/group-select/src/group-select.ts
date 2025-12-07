import type { ExtractPublicPropTypes, PropType } from 'vue';

export interface GroupSelectOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

export interface GroupSelectProps {
  modelValue: string | number;
  options: GroupSelectOption[];
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
