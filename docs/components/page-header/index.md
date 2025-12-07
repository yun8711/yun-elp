---
title: PageHeader
description: 展示页面标题
---

# Page Header 页面标题

## 说明

用于展示页面标题的组件，默认使用路由元数据的 route.meta.title

## 用法示例

### 基础用法

:::demo

page-header/test

:::

## API

### Attributes

| 属性名     | 说明                                | 类型                                  | 默认值   |
| ---------- | ----------------------------------- | ------------------------------------- | -------- |
| height     | 组件高度                            | ^[string] / ^[number]                 | `'40px'` |
| title      | 标题文本，默认取 `route.meta.title` | ^[string]                             | —        |
| border     | 是否显示下边框                      | ^[boolean]                            | `true`   |
| padding-x  | 左右内边距                          | ^[string] / ^[array]`[string,string]` | `'24px'` |
| titleStyle | 标题样式                            | ^[object]`CSSProperties`              | —        |

### Slots

| 名称    | 说明             | 参数 |
| ------- | ---------------- | ---- |
| default | 标题内容         | —    |
| extra   | 标题右侧附加内容 | —    |
| right   | 组件右侧区域     | —    |
