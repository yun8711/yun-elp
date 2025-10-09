import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { TableColumnCtx } from 'element-plus';

// 表格项的scope
export type TableItemScope = {
  row: any;
  column: TableColumnCtx<Record<PropertyKey, any>>;
  $index: number;
};
// disabled的返回值：
// 如果只有1个boolean，则只表示是否禁用；
// 如果有2个参数，则第一个参数表示是否禁用，第二个参数表示禁用原因；
// 如果有多个[boolean, string]参数，则表示多个禁用条件和原因
export type ColumnOperationItemDisabledReturn =
  | boolean
  | [boolean, string]
  | Array<[boolean, string]>;

// 操作项的配置
export interface ColumnOperationItemType {
  // 操作项的文本
  label: string | ((scope: TableItemScope, item: ColumnOperationItemType) => string);
  // 操作项的prop，作用同key，唯一标识
  prop: string;
  // 按钮是否禁用
  disabled?:
    | ColumnOperationItemDisabledReturn
    | ((scope: TableItemScope, item: ColumnOperationItemType) => ColumnOperationItemDisabledReturn);
  // 按钮是否显示，但是仍会占位
  show?: boolean | ((scope: TableItemScope, item: ColumnOperationItemType) => boolean);
  // 按钮是否隐藏
  hide?: boolean | ((scope: TableItemScope, item: ColumnOperationItemType) => boolean);
  // 是否以dropdown的形式展示
  dropdown?: boolean | ((scope: TableItemScope, item: ColumnOperationItemType) => boolean);
}

// 操作列的配置
export interface ColumnOperationProps {
  options: ColumnOperationItemType[] | ((scope: TableItemScope) => ColumnOperationItemType[]);
  // 表头样式
  headerStyle?: Record<string, string | number>;
}

export const columnOperationProps = {
  headerStyle: {
    type: Object as PropType<Record<string, string | number>>,
    default: () => ({})
  },
  options: {
    type: Array as PropType<ColumnOperationItemType[]>,
    default: () => []
  }
} as const;

export type columnOperationInstance = ExtractPublicPropTypes<typeof columnOperationProps>;
