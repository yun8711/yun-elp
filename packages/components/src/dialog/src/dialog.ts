import type { ExtractPublicPropTypes } from 'vue';
import type { ButtonProps } from '../../button/src/button';

export type DialogEmits = {
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:modelValue', value: boolean): void;
};

export interface DialogProps {
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
  bodyMaxHeight?: string | number;
}

export const dialogProps = {
  modelValue: {
    type: Boolean,
    default: false
  },
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
  },
  bodyMaxHeight: {
    type: String,
    default: '50vh'
  }
} as const;

export type dialogInstance = ExtractPublicPropTypes<typeof dialogProps>;
