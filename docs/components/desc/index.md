---
title: Desc
description: 描述列表
---

# Desc 描述列表

## 说明

感觉 el-descriptions 组件用起来不够方便且不够灵活，所以模仿编写了 y-desc 组件，实现了它的大部分功能，也摒弃了一些不太常用的功能，主要特点：

- 一定程度上简化了组件的使用，使用Lodash的get方法获取值，外部提供数据及配置即可
- 使用 grid 优化了布局，支持响应式（根据组件宽度动态调整列数）
- 默认支持内容展示超宽省略及tooltip功能

注意：

在默认只展示内容时，组件内部使用配置项的 path 属性或 index 作为key值

但是如果使用插槽展示表单等场景下，需要提供 prop 属性，并且在配置中要唯一

## 用法示例

### 基础用法

:::demo 默认3列，各列是等宽的，支持 border 属性

desc/basic

:::

### 响应式列数

:::demo column 属性支持使用函数来根据组件宽度动态调整，可以手动调整页面宽度来查看效果

desc/column

:::

### 默认插槽用法

:::demo 当不指定具体的 prop 插槽时，可以使用默认的 `label` 和 `content` 插槽来统一自定义所有项的显示；

desc/default-slot

:::

### 具名插槽用法

:::demo 对于需要使用插槽的配置项，需要提供 prop 属性，`<prop>-label` 是每列中 label 的插槽名，`<prop>-content` 是每列中 content 的插槽名；

desc/slot

:::

## API

### Attributes

| 属性名        | 说明                         | 类型                                               | 默认值         |
| ------------- | ---------------------------- | -------------------------------------------------- | -------------- |
| config        | 配置项数组                   | ^[object]`DescItem[]`                              | —              |
| data          | 数据对象                     | ^[object]`Record<string, any>`                     | —              |
| direction     | 布局方向，同 el-descriptions | ^[enum]`'horizontal' \| 'vertical'`                | `'horizontal'` |
| column        | 列数                         | ^[number] / ^[function]`(width: number) => number` | `3`            |
| labelWidth    | label 宽度                   | ^[string] / ^[number]                              | `'auto'`       |
| label-style   | label 样式                   | ^[object]`CSSProperties`                           | —              |
| content-style | content 样式                 | ^[object]`CSSProperties`                           | —              |
| label-align   | label 文本对齐方式           | ^[enum]`'left' \| 'center' \| 'right'`             | `'left'`       |
| content-align | content 文本对齐方式         | ^[enum]`'left' \| 'center' \| 'right'`             | `'left'`       |
| empty-text    | content 内容为空时显示的内容 | ^[string]                                          | `''`           |

### DescItem Properties

| 属性名       | 说明                                                                               | 类型                                          | 默认值   |
| ------------ | ---------------------------------------------------------------------------------- | --------------------------------------------- | -------- |
| label        | 标签文本                                                                           | ^[string]                                     | `''`     |
| content      | 显示的内容，一般用于显示固定内容，优先级最高                                       | ^[any]                                        | —        |
| path         | 取值路径，即 lodase 的 get 方法的 path 参数；如果未指定，则使用 label 作为取值路径 | ^[string]                                     | —        |
| prop         | 选项key                                                                            | ^[string]                                     | —        |
| noTooltip    | 是否禁用tooltip功能                                                                | ^[boolean]                                    | `false`  |
| labelStyle   | label 样式                                                                         | ^[object]`CSSProperties`                      | —        |
| contentStyle | content 样式                                                                       | ^[object]`CSSProperties`                      | —        |
| labelWidth   | label 宽度                                                                         | ^[string] / ^[number]                         | `'auto'` |
| labelAlign   | label 文本对齐方式                                                                 | ^[enum]`'left' \| 'center' \| 'right'`        | `'left'` |
| contentAlign | content 文本对齐方式                                                               | ^[enum]`'left' \| 'center' \| 'right'`        | `'left'` |
| span         | 列的数量；'column'表示占据整行，最好只在响应式列数时使用                           | ^[number] / `'column'`                        | `1`      |
| format       | 内容格式化函数                                                                     | ^[function]`(value:any,item:DescItem) => any` | —        |
| textTooltip  | y-text-tooltip组件的tooltip配置                                                    | ^[object]`Record<string, any>`                | —        |

### Slots

| 名称           | 说明                                           | 参数                                                          |
| -------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| [prop]-label   | 具名插槽，每一项的自定义标签内容（优先级最高） | ^[object]`{ item: DescItem, index: number }`                  |
| [prop]-content | 具名插槽，每一项的自定义内容（优先级最高）     | ^[object]`{ item: DescItem, content: string, index: number }` |
| label          | 默认标签插槽，当未指定 `[prop]-label` 时使用   | ^[object]`{ item: DescItem, index: number }`                  |
| content        | 默认内容插槽，当未指定 `[prop]-content` 时使用 | ^[object]`{ item: DescItem, content: string, index: number }` |
