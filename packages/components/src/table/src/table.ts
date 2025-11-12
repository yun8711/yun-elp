import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { PaginationProps } from 'element-plus';
import type { EmptyProps } from '../../empty/src/empty';

export type TableEmits = {
  (e: 'paginationChange', obj: { currentPage: number, pageSize: number }): void
}

export interface TableProps {
  // TODO: 定义属性
  loading?: boolean;
  emptyProps?: EmptyProps;
  showFooter?: boolean;
  paginationProps?: PaginationProps;
  // 在el-form中嵌套的table，需要传入该属性，指明表间中表格数据的字段名，用于绑定校验
  formTableProp?: string;
}

export const tableProps = {
  loading: {
    type: Boolean,
    default: false
  },
  emptyProps: {
    type: Object as PropType<EmptyProps>,
    default: () => ({})
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  paginationProps: {
    type: Object as PropType<PaginationProps>,
    default: () => ({})
  },
  formTableProp: {
    type: String,
    default: 'tableData'
  }
} as const;

export type tableInstance = ExtractPublicPropTypes<typeof tableProps>;
