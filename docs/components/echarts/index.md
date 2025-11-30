---
title: Echarts
description: 基于 ECharts 的基础图表组件
---

# Echarts 基础图表

基于 `ECharts^6.0.0` 封装，组件内部实现了动态按需加载，通过 `config` 指定要加载的图表类型、组件、特性、渲染器、主题、init参数，也可以通过 `appWrap` 的配置项进行全局设置

- 对于简单图表场景，可以直接通过 `option` 属性传递图表配置及异步加载的数据
- 对于项目中有大量复用图表的场景，可以先基于 `y-echarts` 封装某个类型的图表，在异步加载数据时时只需要传入必要的配置项即可
- 使用时需要单独安装 `echarts` 依赖

## 基础用法

:::demo 该示例展示不进行二次封装，直接使用 `y-echarts` 的用法

echarts/basic

:::

## 二次封装

:::demo 该示例使用 `y-echarts` 封装一个柱状图组件，避免每次创建图表时编写大量配置，提升复用性。在使用该组件时，只需要像上面示例的 `getLineChartOption` 方法一样，只传入必要的配置即可

echarts/bar

:::

## API

### Attributes

| 属性名  | 说明                                                                  | 类型                     | 默认值                           |
| ------- | --------------------------------------------------------------------- | ------------------------ | -------------------------------- |
| option  | [Echarts 图表配置项](https://echarts.apache.org/zh/option.html#title) | ^[object]                | `{}`                             |
| loading | 是否显示加载状态                                                      | ^[boolean]               | `false`                          |
| config  | 按需加载的模块配置                                                    | ^[object]`EchartsConfig` | `{renderers:['CanvasRenderer']}` |

#### EchartsConfig 配置项

| 属性名     | 说明                                                                                        | 类型                  | 默认值               |
| ---------- | ------------------------------------------------------------------------------------------- | --------------------- | -------------------- |
| theme      | 图表主题，参见[ECharts 中的样式简介](https://echarts.apache.org/handbook/zh/concepts/style) | ^[string] / ^[object] | —                    |
| chartTypes | 需要动态导入的图表类型，如 `['LineChart', 'BarChart']`                                      | ^[array]`string[]`    | `[]`                 |
| components | 需要动态导入的组件类型，如 `['GridComponent', 'TooltipComponent']`                          | ^[array]`string[]`    | `[]`                 |
| renderers  | 需要动态导入的渲染器类型，如 `['CanvasRenderer']`                                           | ^[array]`string[]`    | `['CanvasRenderer']` |
| features   | 需要动态导入的特性功能，如 `['LabelLayout', 'UniversalTransition']`                         | ^[array]`string[]`    | `[]`                 |
| initOpts   | 初始化参数，参见[echarts init](https://echarts.apache.org/zh/api.html#echarts.init)         | ^[object]             | `{}`                 |

### Exposes

| 名称             | 说明         | 类型                               |
| ---------------- | ------------ | ---------------------------------- |
| getChartInstance | 获取图表实例 | ^[function]`() => ECharts \| null` |
