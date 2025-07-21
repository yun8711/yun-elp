---
title: Label 标签
description: 用于展示键值对数据。
---

# Label 标签

Label 组件主要用于键值对数据的展示

## 基础用法

:::demo label组件主要用来进行数据展示

label/basic

:::

## 组件尺寸

:::demo label组件内部使用flex布局方式

label/size

:::

## 插槽

:::demo 提供了前后置插槽

label/slots

:::

## API

### Attributes

| 属性名       | 说明                              | 类型                                   | 默认值 |
| ------------ | --------------------------------- | -------------------------------------- | ------ |
| label        | 标签文本                          | ^[string]                              | —      |
| labelWidth   | 标签宽度                          | ^[string] / ^[number]                  | auto   |
| align        | 标签文本对齐方式                  | ^[enum]`'left' \| 'center' \| 'right'` | left   |
| height       | 组件高度                          | ^[string] / ^[number]                  | 32px   |
| border       | 是否显示边框                      | ^[boolean]                             | false  |
| colon        | 标签后分隔符，border为false时有效 | ^[string]                              | ''     |
| labelStyle   | 标签自定义样式                    | ^[object]`CSSProperties`               | —      |
| contentStyle | 内容区域自定义样式                | ^[object]`CSSProperties`               | —      |

### Slots

| 名称    | 说明                             | 参数 |
| ------- | -------------------------------- | ---- |
| default | 默认插槽，用于放置内容           | —    |
| prefix  | 前置插槽，用于放置图标等前置内容 | —    |
| suffix  | 后置插槽，用于放置图标等后置内容 | —    |
| label   | 标签文本插槽，用于自定义标签内容 | —    |
