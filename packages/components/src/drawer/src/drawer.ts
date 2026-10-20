import type { ExtractPublicPropTypes } from 'vue';
import type { ButtonProps } from '../../button/src/button';
// import type { DrawerProps as ElDrawerProps } from 'element-plus';

export type DrawerEmits = {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:modelValue', value: boolean): void;
};

export interface DrawerProps {
  modelValue?: boolean;
  title?: string;
  titleStyle?: Record<string, any>;
  /** 内容区内边距，数字按 px 处理 */
  bodyPadding?: string | number;
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
  bodyPadding: {
    type: [String, Number],
    default: undefined
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
  }
} as const;

export type drawerInstance = ExtractPublicPropTypes<typeof drawerProps>;
