import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

// 选项:如果为对象则与 el-option 的属性保持一致，也支持其他简单类型，会自动转换为对象
export type SelectOption =
  | any
  | {
      label?: string;
      value?: any;
      disabled?: boolean;
      [key: string]: any;
    };

// 选项分组接口
export interface SelectOptionGroup {
  label?: string;
  disabled?: boolean;
  options?: SelectOption[];
  [key: string]: any;
}

// 继承 el-select 的所有属性，并添加 options
export interface YSelectProps {
  options?: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  disabledMethod?: (option: SelectOption) => boolean;
}

// 只定义我们新增的 props，其他属性通过 $attrs 传递
export const selectProps = {
  options: {
    type: Array as PropType<SelectOption[]>,
    default: () => []
  },
  optionGroups: {
    type: Array as PropType<SelectOptionGroup[]>,
    default: () => []
  },
  disabledMethod: {
    type: Function as PropType<(option: SelectOption) => boolean>,
    default: () => () => false
  }
} as const;

// 暴露的方法类型
export interface SelectExposes {
  focus: () => void;
  blur: () => void;
  getSelectedLabel: () => string;
  getSelectInstance: () => any;
}

export type SelectInstance = ExtractPublicPropTypes<typeof selectProps>;
