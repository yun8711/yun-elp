import type { App, Component } from 'vue';

/**
 * 为组件添加install方法，实现组件的全局注册
 * @param component Vue组件
 * @param alias 组件别名
 * @returns 添加了install方法的组件
 */
export const withInstall = <T extends Component>(component: T, alias?: string) => {
  (component as T & { install: (app: App) => void }).install = (app: App) => {
    // 获取组件名称
    const name = component.name || 'Unknown';
    // 注册组件
    app.component(name, component);
    // 如果有别名，也注册别名
    if (alias) {
      app.component(alias, component);
    }
  };

  return component as T & { install: (app: App) => void };
};
