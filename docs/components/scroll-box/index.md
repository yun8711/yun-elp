---
title: ScrollBox 可滚动盒容器
description: ScrollBox 可滚动盒容器
---

# ScrollBox 可滚动容器

基于 [el-scrollbar 组件](https://element-plus.org/zh-CN/component/scrollbar.html)封装，支持水平方向滚动的容器组件，内部包裹内容，并提供手动控制滚动的按钮。

> 垂直滚动一般不需要箭头，所以可以直接使用 el-scrollbar 组件

## 基础用法

:::demo 设置一个容器，宽度可自由调整，以此来展示自动显示左右箭头的功能。当内容超出容器宽度时，会自动显示左右箭头按钮。

scroll-box/basic

:::

## 滚轮功能

:::demo wheelScroll 属性控制是否开户鼠标滚轮触发水平滚动的功能

scroll-box/continuous

:::

## 高级用法 - 自定义箭头样式

:::demo 组件支持自定义箭头样式，内容部分可自由定义。

scroll-box/arrow

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
| step            | 单击滚动时的步进距离         | ^[number]                           | —                     | `30`           |
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
- **鼠标滚轮支持**：可配置是否支持鼠标滚轮触发水平滚动，已优化防止外层容器滚动问题
- **灵活配置**：可自定义滚动步长、箭头样式、节流参数等
- **响应式设计**：适配不同屏幕尺寸

## 注意事项

### 滚轮滚动优化

当启用 `wheel-scroll` 时，组件会自动处理滚轮事件以防止外层容器滚动：

- 使用 `event.preventDefault()` 阻止默认的垂直滚动行为
- 直接处理滚轮事件，确保响应性和流畅性
- 自动限制滚动范围，防止超出边界
- 支持自定义节流参数以优化其他滚动操作性能
