import type { LocaleType } from '../../../locale';
import type { ConfigProviderProps } from 'element-plus';
import type { PropType, ExtractPublicPropTypes, InjectionKey } from '@vue/runtime-core';

// export const elpConfigProviderContextKey:InjectionKey<Ref<

// 定义扩展的属性
export interface AppWrapProps {
  // el-config-provider的配置
  elpConfig?: ConfigProviderProps;
  locale?: LocaleType;
  // border-label、label的配置
  label?: {
    width?: string;
    height?: string;
  };
}

// 定义 props 对象
export const appWrapProps = {
  elpConfig: {
    type: Object as PropType<ConfigProviderProps>,
    default: () => ({})
  },
  locale: {
    type: String as PropType<LocaleType>,
    default: 'zh-CN'
  },
  label: {
    type: Object as PropType<AppWrapProps['label']>,
    default: () => ({})
  }
} as const;

export type AppWrapInstance = ExtractPublicPropTypes<typeof appWrapProps>;
