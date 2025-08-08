---
title: ScrollBox 可滚动容器
description: ScrollBox 可滚动容器
---

# ScrollBox 可滚动容器

一个支持水平/垂直方向滚动的容器组件，内部使用 Element Plus 的 scrollbar 组件包裹内容，并提供手动控制滚动的按钮。

## 基础用法

:::demo 使用 `scroll-box` 组件创建一个可滚动的容器，支持水平和垂直方向的滚动。

scroll-box/basic

:::

## API

### Attributes

| 属性名          | 说明                         | 类型                                | 可选值                | 默认值         |
| --------------- | ---------------------------- | ----------------------------------- | --------------------- | -------------- |
| height          | 容器高度                     | ^[string] / ^[number]               | —                     | `'100%'`       |
| width           | 容器宽度                     | ^[string] / ^[number]               | —                     | `'100%'`       |
| arrow-model     | 箭头显示模式                 | ^[enum]`'always' \| 'auto'`         | always / auto         | `'auto'`       |
| arrow-style     | 箭头样式                     | ^[object]`Record<string, any>`      | —                     | `{}`           |
| direction       | 滚动方向                     | ^[enum]`'horizontal' \| 'vertical'` | horizontal / vertical | `'horizontal'` |
| scrollbar-props | 滚动条配置                   | ^[object]`Partial<ScrollbarProps>`  | —                     | `{}`           |
| step            | 滚动步进距离                 | ^[number]                           | —                     | `30`           |
| continuous      | 是否支持连续滚动             | ^[boolean]                          | —                     | `false`        |
| wheel-scroll    | 是否支持鼠标滚轮触发水平滚动 | ^[boolean]                          | —                     | `false`        |

### Events

| 事件名 | 说明       | 回调参数                            |
| ------ | ---------- | ----------------------------------- |
| scroll | 滚动时触发 | ^[function]`(event: Event) => void` |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 滚动内容 | —    |

## 特性

- **双向滚动支持**：支持水平和垂直方向的滚动
- **智能箭头显示**：
  - 水平滚动：根据内容是否超出容器自动显示/隐藏控制按钮
  - 垂直滚动：auto模式下默认不显示箭头（可通过鼠标滚轮操作），always模式下始终显示
- **手动滚动控制**：提供左右/上下按钮来手动控制滚动行为
- **连续滚动**：支持按住按钮连续滚动
- **鼠标滚轮支持**：可配置是否支持鼠标滚轮触发水平滚动
- **灵活配置**：可自定义滚动步长、箭头样式等
- **响应式设计**：适配不同屏幕尺寸
