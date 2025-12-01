import type { ExtractPublicPropTypes, PropType } from 'vue';

// emits接口 - 包含我们新增的事件和透传的el-select事件
export interface SelectEmits {
  // 新增的事件
  'update:modelValue': [value: any];

  // 透传的el-select事件
  change: [value: any];
  'visible-change': [visible: boolean];
  'remove-tag': [tag: any];
  clear: [];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  'popup-scroll': [event: Event];
}

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

// 使用 Proxy 自动代理 el-select 的所有方法，无需预定义接口

export type SelectInstance = ExtractPublicPropTypes<typeof selectProps>;
