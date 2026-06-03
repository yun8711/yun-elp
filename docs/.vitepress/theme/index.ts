import DefaultTheme from 'vitepress/theme';
import ElementPlus, { ElMessage, ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus';
import 'element-plus/dist/index.css';
import YunElp from '../../../packages/components';
import '../../../packages/theme-chalk/src/index.scss';
import { globals } from '../vitepress';
// 判断当前代码是否在浏览器客户端环境中运行
import { isClient } from '@vueuse/core';
import 'uno.css';
import './styles/index.scss';
import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css';
import 'virtual:group-icons.css';
import type { Theme } from 'vitepress';

export default {
  extends: DefaultTheme,
  enhanceApp: async ({ app, router }) => {
    app.use(ElementPlus);
    app.use(YunElp);
    // 提供ID_INJECTION_KEY，用于生成唯一的ID
    app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 });
    // 提供ZINDEX_INJECTION_KEY，用于管理z-index
    app.provide(ZINDEX_INJECTION_KEY, { current: 2000 });

    // 注册全局组件
    globals.forEach(([name, comp]) => {
      app.component(name, comp);
    });

    // 如果当前代码不在浏览器客户端环境中运行，则返回
    if (!isClient) return;
    // 导入nprogress库
    const nprogress = await import('nprogress');
    // 监听页面路由变化，显示进度条
    router.onBeforePageLoad = () => {
      nprogress.start();
    };
    // 监听页面路由变化，隐藏进度条
    router.onAfterRouteChanged = () => {
      nprogress.done();
    };
    // 用于测试web-view组件的message事件
    if (window.self !== window.top) {
      window.addEventListener('message', event => {
        if (event.origin !== 'http://localhost:5173') return;
        console.log('yun-elp[iframen]接收到消息：', event);
        ElMessage.info(`yun-elp[iframen]接收到来自${event.origin}的消息：${event.data}`);
      });
    }
  }
} satisfies Theme;
