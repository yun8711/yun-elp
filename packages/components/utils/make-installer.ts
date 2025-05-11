// 全局安装器，用于全局注册组件
// 组件库安装标识，用于全局注册组件时，避免重复注册
import { INSTALLED_KEY } from '../constants/key';
// import { provideGlobalConfig } from '@element-plus/components/config-provider'
// import { version } from './version'

import type { App, Plugin } from '@vue/runtime-core';
// import type { ConfigProviderContext } from '@element-plus/components/config-provider'

// 全局安装器，用于全局注册组件
export const makeInstaller = (components: Plugin[] = []) => {
  // const install = (app: App, options?: ConfigProviderContext) => {
  const install = (app: App) => {
    if ((app as any)[INSTALLED_KEY]) return;

    (app as any)[INSTALLED_KEY] = true;
    components.forEach(c => app.use(c));

    // if (options) provideGlobalConfig(options, app, true)
  };

  return {
    // version,
    install
  };
};
