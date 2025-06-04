import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';
import DefaultTheme from 'vitepress/theme';
import YunElp from '@yun-elp/components';
import { globals } from '../vitepress';
// 判断当前代码是否在浏览器客户端环境中运行
import { isClient } from '@vueuse/core';
import 'uno.css';
import './styles/index.scss';
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css';
import 'virtual:group-icons.css';
import type { Theme } from 'vitepress';
// import 'element-plus/dist/index.css';

export default {
  extends: DefaultTheme,
  enhanceApp: async ({ app, router }) => {
    app.use(ElementPlus);
    app.use(YunElp);
    // 提供ID_INJECTION_KEY，用于生成唯一的ID
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 });
    // 提供ZINDEX_INJECTION_KEY，用于生成唯一的Z-index
    app.provide(ZINDEX_INJECTION_KEY, { current: 0 });

    // 注册全局组件
    globals.forEach(([name, Comp]) => {
      app.component(name, Comp);
    });

    // 如果当前代码不在浏览器客户端环境中运行，则返回
    if (!isClient) return;
    // 导入nprogress库
    const nprogress = await import('nprogress');
    // 监听页面路由变化，显示进度条
    router.onBeforeRouteChange = to => {
      nprogress.start();
      return true;
    };
    // 监听页面路由变化，隐藏进度条
    router.onAfterRouteChange = to => {
      nprogress.done();
    };
  }
} satisfies Theme;
