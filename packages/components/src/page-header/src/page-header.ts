import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface YPageHeaderProps {
  height?: string;
  title?: string;
  border?: boolean;
  // 左右内边距
  paddingX?: string | [string, string];
  titleStyle?: Record<string, any>;
}

export const YPageHeaderProps = {
  height: {
    type: String as PropType<string>,
    default: undefined
  },
  title: {
    type: String as PropType<string>,
    default: ''
  },
  border: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  paddingX: {
    type: [String, Array] as PropType<string | [string, string]>,
    default: undefined
  },
  titleStyle: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
} as const;

export type YPageHeaderInstance = ExtractPublicPropTypes<typeof YPageHeaderProps>;
