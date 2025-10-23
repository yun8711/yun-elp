---
title: Echarts 基础图表
description: 基于 ECharts 的 Vue 组件，支持动态按需导入，减少打包体积
---

# Echarts 基础图表

基于 ECharts 封装的 Vue 组件，**组件内部实现了动态按需加载**，支持通过 props 指定所需的图表类型、组件和渲染器，有效减少打包体积。

## 基础用法

:::demo

echarts/test

:::

## 高级用法

使用自定义模块加载功能，加载雷达图、热力图、仪表盘等特殊图表类型：

:::demo

echarts/advanced

:::

## 动态按需加载

组件支持通过 `config` 对象的 `chartTypes`、`components`、`renderers`、`features` 属性动态导入所需的 ECharts 模块，实现按需加载，减少打包体积。同时，组件也支持从 `AppWrap` 中读取全局配置，实现全局统一的模块管理。

### 默认加载模块

如果不指定任何模块配置，组件会自动加载以下常用模块：

- **图表类型**: `LineChart`、`BarChart`、`PieChart`
- **组件**: `GridComponent`、`TooltipComponent`、`LegendComponent`、`TitleComponent`
- **渲染器**: `CanvasRenderer`

### 自定义模块加载

如果需要使用其他图表类型或组件，可以通过 `config` 属性指定需要加载的模块：

```vue
<template>
  <y-echarts
    :option="chartOption"
    :config="{
      chartTypes: ['ScatterChart', 'RadarChart'],
      components: ['GridComponent', 'TooltipComponent', 'RadarComponent'],
      renderers: ['CanvasRenderer']
    }"
  />
</template>
```

### 支持的图表类型

- `LineChart` - 折线图
- `BarChart` - 柱状图
- `PieChart` - 饼图
- `ScatterChart` - 散点图
- `RadarChart` - 雷达图
- `MapChart` - 地图
- `TreeChart` - 树图
- `TreemapChart` - 矩形树图
- `GraphChart` - 关系图
- `ChordChart` - 和弦图
- `GaugeChart` - 仪表盘
- `FunnelChart` - 漏斗图
- `ParallelChart` - 平行坐标
- `SankeyChart` - 桑基图
- `BoxplotChart` - 箱线图
- `CandlestickChart` - K线图
- `EffectScatterChart` - 特效散点图
- `LinesChart` - 线图
- `HeatmapChart` - 热力图
- `PictorialBarChart` - 象形柱图
- `ThemeRiverChart` - 主题河流图
- `SunburstChart` - 旭日图
- `CustomChart` - 自定义图表

### 支持的组件类型

- `GridSimpleComponent` - 简化版网格
- `GridComponent` - 网格
- `PolarComponent` - 极坐标
- `RadarComponent` - 雷达坐标
- `GeoComponent` - 地理坐标
- `SingleAxisComponent` - 单轴
- `ParallelComponent` - 平行坐标
- `CalendarComponent` - 日历坐标
- `MatrixComponent` - 矩阵坐标
- `GraphicComponent` - 图形元素
- `ToolboxComponent` - 工具箱
- `TooltipComponent` - 提示框
- `AxisPointerComponent` - 坐标轴指示器
- `BrushComponent` - 区域选择
- `TitleComponent` - 标题
- `TimelineComponent` - 时间轴
- `MarkPointComponent` - 标记点
- `MarkLineComponent` - 标记线
- `MarkAreaComponent` - 标记区域
- `LegendComponent` - 图例
- `LegendScrollComponent` - 可滚动图例
- `LegendPlainComponent` - 普通图例
- `DataZoomComponent` - 数据缩放
- `DataZoomInsideComponent` - 内置型数据缩放
- `DataZoomSliderComponent` - 滑动条型数据缩放
- `VisualMapComponent` - 视觉映射
- `VisualMapContinuousComponent` - 连续型视觉映射
- `VisualMapPiecewiseComponent` - 分段型视觉映射
- `ThumbnailComponent` - 缩略图
- `AriaComponent` - 无障碍
- `TransformComponent` - 数据转换
- `DatasetComponent` - 数据集

### 支持的渲染器类型

- `CanvasRenderer` - Canvas 渲染器
- `SVGRenderer` - SVG 渲染器

### 支持的特性功能

- `LabelLayout` - 标签布局
- `UniversalTransition` - 通用过渡动画
- `AxisBreak` - 坐标轴断裂
- `ScatterJitter` - 散点抖动
- `LegacyGridContainLabel` - 旧版网格包含标签

## 使用说明

1. **独立使用**: 组件可以完全独立使用，不依赖 AppWrap 组件
2. **全局配置**: 可以在 AppWrap 中配置全局 echarts 模块，所有 y-echarts 组件共享
3. **组件配置**: 通过 `config` 属性在组件级别指定需要的模块
4. **配置合并**: 全局配置和组件配置会自动合并，组件配置会追加到全局配置
5. **智能去重**: 同一个模块多次加载时，组件内部会自动去重，避免重复加载
6. **默认兜底**: 如果既没有全局配置也没有组件配置，会自动加载常用的默认模块

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| option | 图表配置项 | `object` | `{}` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| theme | 图表主题（已废弃，请使用 config.theme） | `string \| object` | `undefined` |
| config | ECharts 配置对象 | `EchartsConfig` | `{}` |

#### EchartsConfig 配置项

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| theme | 图表主题 | `string \| object` | `undefined` |
| chartTypes | 需要动态导入的图表类型，如 `['LineChart', 'BarChart']` | `string[]` | 默认加载 `['LineChart', 'BarChart', 'PieChart']` |
| components | 需要动态导入的组件类型，如 `['GridComponent', 'TooltipComponent']` | `string[]` | 默认加载常用组件 |
| renderers | 需要动态导入的渲染器类型，如 `['CanvasRenderer']` | `string[]` | 默认 `['CanvasRenderer']` |
| features | 需要动态导入的特性功能，如 `['LabelLayout', 'UniversalTransition']` | `string[]` | `undefined` |
| initOpts | 初始化参数 | `object` | `{}` |

### Slots

| 名称 | 说明 | 参数 |
|--------|------|------------|
| — | — | — |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|----------|
| — | — | — |

### Exposes

| 名称 | 说明 | 类型 |
|--------|------|------------|
| getChartInstance | 获取图表实例 | `() => ECharts` |
| resize | 调整图表大小 | `() => void` |
| dispose | 销毁图表 | `() => void` |

### CSS Variables

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| — | — | — |
