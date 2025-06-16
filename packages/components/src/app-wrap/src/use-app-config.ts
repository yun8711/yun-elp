import { inject, type InjectionKey } from '@vue/runtime-core';
import type { AppWrapProps } from './app-wrap';

export const appConfigKey: InjectionKey<AppWrapProps> = Symbol('yun-elp-app-config');

export function useAppConfig(attr?: keyof AppWrapProps) {
  const config = inject(appConfigKey);

  if (!config) {
    console.warn('useAppConfig must be used within YAppWrap component');
    return {};
  }

  return attr ? config[attr] : config;
}
