import installer from './defaults';

export const install = installer.install;
export * from './src/index';

// 默认导出，用于全局注册组件:app.use(YunElp)
export default installer;
