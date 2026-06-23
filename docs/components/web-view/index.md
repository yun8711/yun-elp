---
title: WebView
description: 网页容器组件
---

# WebView 网页容器

## 说明

基于 `iframe` 封装的网页容器组件，简化内嵌页面的传入方式，并自动管理 `postMessage` 的双向通信。

- 自动适配容器宽高，默认 `100%`
- 支持通过 `attrs` 透传原生 `<iframe>` 属性（`allow`、`referrerpolicy`、`sandbox` 等）
- 内置 `postMessage` 发送与 `message` 事件接收，自动按 `event.source` 过滤非本 iframe 的消息
- 支持 `reload` 刷新（同源用 `location.reload`，跨域自动回退到 `src` 重设）

## 用法示例

### 基础用法

:::demo

web-view/test

:::

## API

### Attributes

| 属性名 | 说明            | 类型      | 默认值   |
| ------ | --------------- | --------- | -------- |
| src    | 内嵌页面地址    | ^[string] | —        |
| width  | 容器宽度        | ^[string] | `'100%'` |
| height | 容器高度        | ^[string] | `'100%'` |
| border | iframe 边框样式 | ^[string] | `'0'`    |

除以上属性外，其他原生 `<iframe>` 属性和事件见 [iframe：内嵌框架元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/iframe)，均可通过 attrs 透传。

### Slots

该组件不含插槽。

### Events

| 事件名  | 说明                                          | 类型                                       |
| ------- | --------------------------------------------- | ------------------------------------------ |
| message | 接收到来自内嵌页面的 `postMessage` 消息时触发 | ^[Function]`(event: MessageEvent) => void` |

### Exposes

| 名称        | 说明                | 类型                                                       |
| ----------- | ------------------- | ---------------------------------------------------------- |
| iframeRef   | iframe DOM 元素引用 | ^[object]`Readonly<ShallowRef<HTMLIFrameElement \| null>>` |
| postMessage | 向内嵌页面发送消息  | ^[Function]`(message: any, targetOrigin: string) => void`  |
| reload      | 刷新内嵌页面        | ^[Function]`() => void`                                    |
