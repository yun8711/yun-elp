---
title: ScrollBox 可滚动容器
description: ScrollBox 可滚动容器
---

# ScrollBox 可滚动容器

基于 [el-scrollbar 组件](https://element-plus.org/zh-CN/component/scrollbar.html)封装的可水平方向滚动的容器组件。

> 垂直滚动一般不需要箭头，所以可以直接使用 el-scrollbar 组件

## 基础用法

:::demo 默认情况下，组件会根据内容是否超出容器宽度，自动显示左右箭头按钮。通过 arrowModel=always 可以强制箭头按钮总是显示

scroll-box/basic

:::

## 滚轮功能和连续滚动

:::demo wheelScroll 属性控制是否开启鼠标滚轮触发水平滚动的功能；continuous 属性控制是否启用连续滚动功能，长按箭头按钮可以连续滚动内容；出于性能考虑，这两个功能默认都是关闭的

scroll-box/continuous

:::

## 自定义箭头样式和内容

:::demo 组件支持自定义箭头样式，内容部分可自由定义。

scroll-box/arrow

:::

## API

### Attributes

| 属性名          | 说明                                   | 类型                        | 默认值   |
| --------------- | -------------------------------------- | --------------------------- | -------- |
| height          | 容器高度                               | ^[string] / ^[number]       | `'100%'` |
| width           | 容器宽度                               | ^[string] / ^[number]       | `'100%'` |
| arrow-model     | 箭头显示模式                           | ^[enum]`'always' \| 'auto'` | `'auto'` |
| arrow-style     | 箭头样式                               | ^[object]`CSSProperties`    | `{}`     |
| scrollbar-props | el-scroll滚动条组件配置                | ^[object]`ElScrollbarProps` | `{}`     |
| step            | 单击滚动时的步进距离                   | ^[number]                   | `30`     |
| wheel-scroll    | 是否开启鼠标滚轮触发水平滚动           | ^[boolean]                  | `false`  |
| continuous      | 是否启用连续滚动功能，即长按会持续滚动 | ^[boolean]                  | `false`  |
| continuous-time | 鼠标按下后多长时间触发连续滚动         | ^[number]                   | `200`    |
| continuous-step | 连续滚动时的步进距离                   | ^[number]                   | `30`     |

### Slots

| 插槽名  | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 内容区域 | —    |

### Events

| 事件名 | 说明       | 回调参数                                 |
| ------ | ---------- | ---------------------------------------- |
| scroll | 滚动时触发 | ^[Function]`(scrollLeft:number) => void` |

### Exposes

| 名称          | 说明                           | 类型                                                                       |
| ------------- | ------------------------------ | -------------------------------------------------------------------------- |
| scrollbarRef  | el-scrollbar组件实例           | ^[object]`ElScrollbarInstance`                                             |
| scrollTo      | 滚动到某个位置（距左侧的距离） | ^[Function]`(scrollLeft: undefined \| number \| 'start' \| 'end') => void` |
| scrollToStart | 滚动到最左侧位置               | ^[Function]`() => void`                                                    |
| scrollToEnd   | 滚动到最右侧位置               | ^[Function]`() => void`                                                    |
