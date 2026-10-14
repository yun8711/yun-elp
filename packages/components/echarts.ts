/**
 * ECharts 组件异步入口：避免从 `yun-elp` 主包静态拉取 YEcharts 及 echarts 相关 chunk。
 */
export { defineAsyncYEcharts, YEcharts } from './src/echarts/async';
export { echartsProps } from './src/echarts/src/echarts';
export type { EchartsProps, echartsInstance } from './src/echarts/src/echarts';
