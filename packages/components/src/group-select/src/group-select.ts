import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

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
};

export interface GroupSelectEmits {
  change: [value: string | number, item: GroupSelectOption, index: number];
}

export const groupSelectProps = {
  modelValue: {
    type: [String, Number],
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
