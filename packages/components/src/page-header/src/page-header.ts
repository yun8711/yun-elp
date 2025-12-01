import type { ExtractPublicPropTypes, PropType } from 'vue';

export interface PageHeaderProps {
  height?: string;
  title?: string;
  border?: boolean;
  // 左右内边距
  paddingX?: string | [string, string];
  titleStyle?: Record<string, any>;
}

export const pageHeaderProps = {
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
    default: undefined
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

export type PageHeaderInstance = ExtractPublicPropTypes<typeof pageHeaderProps>;
