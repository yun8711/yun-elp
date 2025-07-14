import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { SelectProps } from 'element-plus';

// 选项接口，与 el-option 的属性保持一致
export interface SimpleSelectOption {
  label?: string;
  value?: any;
  disabled?: boolean;
  [key: string]: any;
}

// 选项分组接口
export interface SimpleSelectOptionGroup {
  label?: string;
  disabled?: boolean;
  options?: SimpleSelectOption[];
  [key: string]: any;
}

// 继承 el-select 的所有属性，并添加 options
export interface SimpleSelectProps extends SelectProps {
  options?: SimpleSelectOption[];
  optionGroups?: SimpleSelectOptionGroup[];
}

// 只定义我们新增的 props，其他属性通过 $attrs 传递
export const simpleSelectProps = {
  options: {
    type: Array as PropType<SimpleSelectOption[]>,
    default: () => []
  },
  optionGroups: {
    type: Array as PropType<SimpleSelectOptionGroup[]>,
    default: () => []
  }
} as const;

// 暴露的方法类型
export interface SimpleSelectExposes {
  focus: () => void;
  blur: () => void;
  getSelectedLabel: () => string;
  getSelectInstance: () => any;
}

export type SimpleSelectInstance = ExtractPublicPropTypes<typeof simpleSelectProps>;
