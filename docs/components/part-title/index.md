---
title: PartTitle
description: 用于展示页面局部区域的标题，支持左侧装饰块和右侧操作区域。
---

# PartTitle 分区标题

## 说明

用于在局部区域展示分区小标题，具有左侧装饰块和灵活的插槽配置。常用于页面分区、表单分组、列表标题等场景。

文本样式、左侧竖条样式和间距可通过组件属性调整，也可在 `y-app-wrap` 的 `partTitle` 上全局配置。`textStyle`、`barStyle` 按字段合并，优先级：组件属性 > `partTitle` > 下表默认样式。`gap`、`extraGap` 传入数字时按 px 处理。

## 用法示例

### 基础用法

:::demo 通过 title 属性设置标题文本

part-title/base

:::

### 插槽

:::demo

part-title/slots

:::

### 样式配置

:::demo 组件属性与 `y-app-wrap` 的 `partTitle` 字段相同，用于单独覆盖某一处分区标题

part-title/style

:::

## API

### Attributes

| 属性名    | 说明                           | 类型                     | 默认值                                                                                           |
| --------- | ------------------------------ | ------------------------ | ------------------------------------------------------------------------------------------------ |
| title     | 标题文本                       | ^[string]                | `''`                                                                                             |
| textStyle | 标题文本样式，只覆盖传入的字段 | ^[object]`CSSProperties` | `{ color: 'var(--el-text-color-primary)', fontSize: 'var(--el-font-size-base)', lineHeight: 1 }` |
| barStyle  | 左侧竖条样式，只覆盖传入的字段 | ^[object]`CSSProperties` | `{ width: '2px', height: '1em', backgroundColor: 'var(--el-color-primary)' }`                    |
| gap       | 竖条与标题的间距               | ^[string] / ^[number]    | `var(--gap-base, 8px)`                                                                           |
| extraGap  | 标题与 extra 插槽的间距        | ^[string] / ^[number]    | `var(--gap-small)`                                                                               |

### Slots

| 名称    | 说明                                            | 类型 |
| ------- | ----------------------------------------------- | ---- |
| default | 默认插槽，用于自定义标题内容，会覆盖 title 属性 | —    |
| extra   | 左侧额外内容插槽，用于在标题后添加标签、图标等  | —    |
| right   | 右侧内容插槽，用于放置操作按钮、链接等          | —    |
