import type { KdElpLocale, LocaleType } from '../../../locale';
import type { ConfigProviderProps } from 'element-plus';
import type { PropType, ExtractPublicPropTypes } from '@vue/runtime-core';

// 定义扩展的属性
export interface ExtendedAppWrapProps {
  locale?: LocaleType | KdElpLocale;
  size?: 'default' | 'large' | 'small';
  button?: {
    autoInsertSpace?: boolean;
  };
  message?: {
    max?: number;
    grouping?: boolean;
    duration?: number;
    showClose?: boolean;
    offset?: number;
  };
  zIndex?: number;
}

// 合并 Element Plus 的属性和扩展的属性
export type AppWrapProps = Omit<ConfigProviderProps, 'locale'> & ExtendedAppWrapProps;

// 定义 props 对象
export const appWrapProps = {
  namespace: {
    type: String,
    default: 'el'
  },
  locale: {
    type: [String, Object] as PropType<LocaleType | KdElpLocale>,
    default: undefined
  },
  size: {
    type: String as PropType<'default' | 'large' | 'small'>,
    default: 'default'
  },
  button: {
    type: Object as PropType<ExtendedAppWrapProps['button']>,
    default: () => ({})
  },
  message: {
    type: Object as PropType<ExtendedAppWrapProps['message']>,
    default: () => ({})
  },
  zIndex: {
    type: Number,
    default: undefined
  }
} as const;

export type AppWrapInstance = ExtractPublicPropTypes<typeof appWrapProps>;
