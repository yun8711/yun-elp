---
title: ColumnSelect
description: 表格选择列，支持多选和单选
---

# ColumnSelect 选择列

## 说明

基于 `el-table-column` 封装的表格选择列。

（1）默认使用官方 `type="selection"` 多选列能力，支持 `selectable`、`reserve-selection` 等选择列属性；

（2）开启 `single` 后使用当前行能力实现单选，适合业务表格只允许选择一行的场景。

（3）单选和多选的禁用状态都由 `selectable(row, index)` 决定。

## 用法示例

### 多选

:::demo

column-select/multiple

:::

### 单选

:::demo

column-select/single

:::

## API

### Attributes

| 属性名                | 说明                                                           | 类型                                                                     | 默认值                                                                       |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| single                | 是否为单选模式                                                 | ^[boolean]                                                               | `false`                                                                      |
| selectable            | 行是否可选，同 `el-table-column` 的 `selectable`               | ^[Function]`(row: any, index: number) => boolean`                        | `true`                                                                       |
| disabled-tip          | 禁用时的提示内容，返回空值时不显示；只负责提示，不决定禁用状态 | ^[Function]`(scope: ColumnSelectScope) => string \| number \| undefined` | —                                                                            |
| width                 | 列宽度                                                         | ^[string] / ^[number]                                                    | `55`                                                                         |
| min-width             | 列最小宽度                                                     | ^[string] / ^[number]                                                    | `55`                                                                         |
| tip-props             | 禁用提示 `el-tooltip` 属性                                     | ^[object]`Partial<ElTooltipProps>`                                       | `{placement: 'top',enterable: false,popperClass:'y-column-select__tooltip'}` |
| resizable             | 是否可以通过拖动改变宽度                                       | ^[boolean]                                                               | `false`                                                                      |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip                                 | ^[boolean] / ^[object]                                                   | `false`                                                                      |
| class-name            | 列的 className                                                 | ^[string]                                                                | `'y-column-select'`                                                          |

### Slots

| 名称    | 说明                 | 参数                                          |
| ------- | -------------------- | --------------------------------------------- |
| default | 自定义选择单元格内容 | ^[object]`{ scope, row, selected, disabled }` |
| header  | 单选模式表头内容     | ^[object]`{ table, column, index }`           |
