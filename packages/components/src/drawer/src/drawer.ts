import type { ExtractPublicPropTypes } from '@vue/runtime-core';
import type { ButtonProps } from '../../button/src/button';

export interface DrawerProps {
  title?: string;
  titleStyle?: Record<string, any>;
  showFooter?: boolean;
  noConfirm?: boolean;
  confirmText?: string;
  confirmProps?: ButtonProps;
  noCancel?: boolean;
  cancelText?: string;
  cancelProps?: ButtonProps;
}

export const drawerProps = {
  title: {
    type: String,
    default: ''
  },
  titleStyle: {
    type: Object,
    default: () => {}
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  noConfirm: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  confirmProps: {
    type: Object,
    default: () => {}
  },
  noCancel: {
    type: Boolean,
    default: false
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  cancelProps: {
    type: Object,
    default: () => {}
  },
} as const;

export type drawerInstance = ExtractPublicPropTypes<typeof drawerProps>;
