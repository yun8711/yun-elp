import { defineAsyncComponent, type AsyncComponentLoader } from 'vue';

const loadYEcharts: AsyncComponentLoader = () => import('./index').then(m => m.YEcharts);

/**
 * 创建异步 YEcharts，挂载后再加载图表实现与 ECharts 运行时。
 * 适合在 setup 中注册，或替代从主包 `yun-elp` 静态导入。
 */
export function defineAsyncYEcharts() {
  return defineAsyncComponent(loadYEcharts);
}

/** 默认异步 YEcharts，供 `yun-elp/echarts` 与 YunElpResolver 自动导入 */
export const YEcharts = defineAsyncYEcharts();
