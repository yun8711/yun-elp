import type { LocaleType } from '../../../locale';
import type { ConfigProviderProps } from 'element-plus';
import type { PropType, ExtractPublicPropTypes } from '@vue/runtime-core';

// 定义扩展的属性
export interface AppWrapProps {
  // el-config-provider的配置
  elpConfig?: ConfigProviderProps;
  locale?: LocaleType;
  // border-label、label的配置
  borderLabel?: {
    width?: string;
    height?: string;
  };
  // page-title的配置
  pageTitle?: {
    height?: string | number;
    // 从route中获取title的路径
    titlePath?: string;
    border?: boolean;
    paddingX?: string | [string, string];
    // 标题的样式，只作用于文本
    titleTextStyle?: Record<string, any>;
  };
  // page-footer的配置
  pageFooter?: {
    height?: string | number;
    left?: string | number;
    right?: string | number;
  };
  // button的配置
  button?: {
    delay?: string | number | undefined;
    maxWait?: string | number | undefined;
    placement?:
      | 'top'
      | 'top-start'
      | 'top-end'
      | 'bottom'
      | 'bottom-start'
      | 'bottom-end'
      | 'left'
      | 'left-start'
      | 'left-end'
      | 'right'
      | 'right-start'
      | 'right-end';
  };
  // drawer的配置
  drawer?: {
    size?: string | number;
    confirmText?: string;
    cancelText?: string;
    titleStyle?: Record<string, any>;
  };
  [key: string]: any;
}

// 定义 props 对象
export const appWrapProps = {
  elpConfig: {
    type: Object as PropType<ConfigProviderProps>,
    default: () => ({})
  },
  locale: {
    type: String as PropType<LocaleType>,
    default: 'zh-cn'
  },
  borderLabel: {
    type: Object as PropType<AppWrapProps['borderLabel']>,
    default: () => ({})
  },
  pageTitle: {
    type: Object as PropType<AppWrapProps['pageTitle']>,
    default: () => ({})
  },
  pageFooter: {
    type: Object as PropType<AppWrapProps['pageFooter']>,
    default: () => ({})
  },
  button: {
    type: Object as PropType<AppWrapProps['button']>,
    default: () => ({})
  },
  drawer: {
    type: Object as PropType<AppWrapProps['drawer']>,
    default: () => ({})
  }
} as const;

export type AppWrapInstance = ExtractPublicPropTypes<typeof appWrapProps>;
