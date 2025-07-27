---
title: BorderLabel 边框标签
description: 用于展示表单的标签
---

# BorderLabel 边框标签

BorderLabel 是一个容器组件，主要用于与 Element Plus 中的各种表单组件进行组合使用。它提供了一个带有边框的标签容器，可以包含前缀、标签、内容和后缀等部分。

## 基础用法

:::demo

border-label/form

:::

## 无边框

:::demo 通过 no-border 属性可以隐藏边框。

border-label/border

:::

## 插槽用法

:::demo 组件提供了 prefix 和 suffix 插槽，可以用于添加前置和后置内容，如图标等。

border-label/slot

:::

## API

### Attributes

| 属性名   | 说明           | 类型                  | 默认值  |
| -------- | -------------- | --------------------- | ------- |
| label    | 标签文本       | ^[string]             |         |
| width    | 组件总宽度     | ^[string] / ^[number] | `auto`  |
| height   | 组件高度       | ^[string] / ^[number] | `32px`  |
| noBorder | 是否不显示边框 | ^[boolean]            | `false` |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 默认内容 | —    |
| prefix  | 前置内容 | —    |
| label   | 标签内容 | —    |
| suffix  | 后置内容 | —    |
