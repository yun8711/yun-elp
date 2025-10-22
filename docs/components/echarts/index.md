---
title: Echarts 基础图表
description: 基于 ECharts 的 Vue 组件，支持动态按需导入，减少打包体积
---

# Echarts 基础图表

基于 ECharts 封装的 Vue 组件，支持动态按需导入图表类型、组件和渲染器，有效减少打包体积。

## 基础用法

:::demo

echarts/test

:::

## 动态按需导入

组件支持通过 `chartTypes`、`components`、`renderers` 属性动态导入所需的 ECharts 模块，实现按需加载，减少打包体积。

### 支持的图表类型

- `BarChart` - 柱状图
- `LineChart` - 折线图  
- `PieChart` - 饼图
- `ScatterChart` - 散点图
- `RadarChart` - 雷达图
- `MapChart` - 地图
- `TreeChart` - 树图
- `TreemapChart` - 矩形树图
- `GraphChart` - 关系图
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

- `GridComponent` - 网格
- `PolarComponent` - 极坐标
- `RadarComponent` - 雷达坐标
- `GeoComponent` - 地理坐标
- `SingleAxisComponent` - 单轴
- `ParallelComponent` - 平行坐标
- `CalendarComponent` - 日历坐标
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
- `DataZoomComponent` - 数据缩放
- `DataZoomInsideComponent` - 内置型数据缩放
- `DataZoomSliderComponent` - 滑动条型数据缩放
- `VisualMapComponent` - 视觉映射
- `VisualMapContinuousComponent` - 连续型视觉映射
- `VisualMapPiecewiseComponent` - 分段型视觉映射
- `AriaComponent` - 无障碍
- `TransformComponent` - 数据转换

### 支持的渲染器类型

- `CanvasRenderer` - Canvas 渲染器
- `SVGRenderer` - SVG 渲染器

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| option | 图表配置项 | `object` | `{}` |
| width | 图表宽度 | `number \| string` | `'100%'` |
| height | 图表高度 | `number \| string` | `'400px'` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| chartTypes | 需要动态导入的图表类型 | `string[]` | `[]` |
| components | 需要动态导入的组件类型 | `string[]` | `[]` |
| renderers | 需要动态导入的渲染器类型 | `string[]` | `[]` |
| autoResize | 是否自动调整大小 | `boolean` | `true` |
| theme | 图表主题 | `string \| object` | `undefined` |
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
