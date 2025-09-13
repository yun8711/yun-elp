import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';
import type { PaginationProps } from 'element-plus';
import type { EmptyProps } from '../../empty/src/empty';

export interface TableProps {
  // TODO: 定义属性
  loading?: boolean;
  emptyProps?: EmptyProps;
  showFooter?: boolean;
  paginationProps?: PaginationProps;
};

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
  }
} as const;

export type tableInstance = ExtractPublicPropTypes<typeof tableProps>;
