/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module 'element-plus/es/components/table/src/tokens.mjs' {
  import type { InjectionKey } from 'vue';
  export const TABLE_INJECTION_KEY: InjectionKey<any>;
}
