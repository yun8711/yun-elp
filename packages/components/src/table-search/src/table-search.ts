import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { BorderLabelProps } from '../../border-label/src/border-label';
import type { Component } from '@vue/runtime-core';

// 定义动态属性函数的参数类型
export interface DynamicPropsParams {
  form: Record<string, any>;
  isFold: boolean;
  prop: string;
  value: any;
}

// 定义函数式options的参数类型
export interface OptionsFunctionParams {
  form: Record<string, any>;
  isFold: boolean;
}

// 定义 emits 的类型
export interface TableSearchEmits {
  (e: 'search', form: Record<string, any>): void;
  (e: 'reset', form: Record<string, any>): void;
  (e: 'change', form: Record<string, any>): void;
  (e: 'fold', params: { isFold: boolean; form: Record<string, any> }): void;
}

export interface TableSearchOption {
  // 字段名，也是表单的key
  prop: string;
  // 字段标签
  label?: string;
  // 是否是展示在第一行，如模糊搜索，如果某个选项是模糊搜索，则需要展示在第一行，其他选项展示在展开后才展示
  first?: boolean;
  // 字段组件类型，即y-border-label支持的组件类型
  comp?: Component;
  // 字段初始值
  value?: any;
  // 是否隐藏
  hidden?: boolean | ((params: DynamicPropsParams) => boolean);
  // 是否禁用
  disabled?: boolean | ((params: DynamicPropsParams) => boolean);
  // 值格式化函数，在值更新时对值进行处理，可以返回单个值或对象（对象会被合并到form中）
  valueFormat?: ((value: any, prop: string, form: Record<string, any>) => any | Record<string, any>) | undefined;
  // y-border-label支持的属性及其他属性，如style等
  borderAttrs?:
    | (BorderLabelProps & Record<string, any>)
    | ((params: DynamicPropsParams) => BorderLabelProps & Record<string, any>);
  // 给内部组件的属性，支持事件（以 on 开头的属性会被当作事件处理）
  innerAttrs?: Record<string, any> | ((params: DynamicPropsParams) => Record<string, any>);
  // 是否自定义组件，即使用slot
  custom?: boolean;
}

export interface TableSearchItem {
  prop: string;
  label: string;
  first: boolean;
  custom: boolean;
  value: any;
  hidden: boolean;
  valueFormat: ((value: any, prop: string, form: Record<string, any>) => any | Record<string, any>) | undefined;
  borderAttrs: BorderLabelProps;
  comp: Component;
  innerAttrs: {
    disabled: boolean;
    [key: string]: any;
  };
}

export interface TableSearchProps {
  // 字段配置
  options: TableSearchOption[] | ((params: OptionsFunctionParams) => TableSearchOption[]);
  // 收起按钮文本
  foldText?: string;
  // 展开按钮文本
  unFoldText?: string;
  // 默认是否折叠
  defaultFold?: boolean;
  // 折叠过渡时间
  duration?: number;
  // 多行模式下，展开时是否自动禁用第一行
  disabledFirst?: boolean;
  // 多行模式下，折叠状态改变时是否自动清空数据
  clearOnFold?: boolean;
}

export const tableSearchProps = {
  options: {
    type: [Array, Function] as PropType<
      TableSearchOption[] | ((params: OptionsFunctionParams) => TableSearchOption[])
    >,
    default: () => []
  },
  foldText: {
    type: String,
    default: '收起'
  },
  unFoldText: {
    type: String,
    default: '展开'
  },
  defaultFold: {
    type: Boolean,
    default: true
  },
  duration: {
    type: Number,
    default: 0.2
  },
  disabledFirst: {
    type: Boolean,
    default: true
  },
  clearOnFold: {
    type: Boolean,
    default: true
  }
} as const;

export type TableSearchInstance = ExtractPublicPropTypes<typeof tableSearchProps>;
