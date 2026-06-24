import { inject, type InjectionKey } from 'vue';
import type { AppWrapProps } from './app-wrap';

export const appConfigKey: InjectionKey<AppWrapProps> = Symbol('yun-elp-app-config');
export const namespaceConfigKey: InjectionKey<{ el: string; y: string }> = Symbol(
  'yun-elp-namespace-config'
);

export function useAppConfig(attr?: keyof AppWrapProps): Record<string, any> {
  const config = inject(appConfigKey, {});

  return attr ? config[attr] : config;
}

export function useNamespaceConfig() {
  return inject(namespaceConfigKey, {
    el: 'el',
    y: 'y'
  });
}
