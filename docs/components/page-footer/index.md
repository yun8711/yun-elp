---
title: PageFooter
description: 页面或区域吸底组件
---

# PageFooter 页脚

## 说明

主要用于页面底部（吸底）区域内容展示，比如编辑页面的操作按钮等。model=fixed 表示相对于页面吸底，model=absolute 表示相对于父元素（需要position:relative）吸底

## 用法示例

### 基础用法

:::demo

page-footer/test

:::

## API

### Attributes

| 属性名 | 说明                           | 类型                           | 默认值    |
| ------ | ------------------------------ | ------------------------------ | --------- |
| height | 组件高度，有效的css尺寸值      | ^[string] / ^[number]          | `'56px'`  |
| left   | 组件左侧距离，有效的css尺寸值  | ^[string] / ^[number]          | `0`       |
| rifht  | 组件右侧距离，有效的css尺寸值  | ^[string] / ^[number]          | `0`       |
| model  | 组件固定时相对于页面或者父元素 | ^[enum]`'fixed' \| 'absolute'` | `'fixed'` |

### Slots

| 名称    | 说明 | 参数                       |
| ------- | ---- | -------------------------- |
| default | 内容 | ^[object]`{height:string}` |
