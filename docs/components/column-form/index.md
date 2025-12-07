---
title: ColumnForm
description: 单元格内展示单个表单项的列
---

# ColumnForm 单表单列

## 说明

基于 `el-table-column` + `el-form-item` 封装，用于在表格单元格中展示单个表单项，支持表单验证、错误提示功能

## 用法示例

### 基础用法

:::demo

column-form/test

:::

## API

### Attributes

| 属性名                | 说明                                                                       | 类型                                                                        | 默认值                                                                         |
| --------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| no-from               | 是否不使用 `el-form-item` 包裹，仅作为普通表单列显示，无校验、错误提示功能 | ^[boolean]                                                                  | `false`                                                                        |
| t-name                | form中table字段名，用于数据绑定和校验                                      | ^[string]                                                                   | `'tableData'`                                                                  |
| rules                 | 表单验证规则                                                               | ^[object]`FormRules` / ^[Function]`(scope: any, prop: string) => FormRules` | —                                                                              |
| form-props            | 表单项的其他属性                                                           | ^[object]`Partial<FormItemProps>`                                           | `{label:'',labelWidth:'0px'}`                                                  |
| tip-props             | 错误提示tooltip的属性                                                      | ^[object]`Partial<ElTooltipProps>`                                          | `{popperClass:'y-column-form__error-tooltip',placement:'top',enterable:false}` |
| label                 | 显示的列标题                                                               | ^[string]                                                                   | —                                                                              |
| prop                  | 列内容的字段名， 也可以使用 property属性                                   | ^[string]                                                                   | —                                                                              |
| width                 | 列的宽度，固定的                                                           | ^[string] / ^[number]                                                       | `'auto'`                                                                         |
| min-width             | 列的最小宽度，会把剩余宽度按比例分配给设置了 min-width 的列                | ^[string] / ^[number]                                                       | `100`                                                                          |
| fixed                 | 列是否固定在左侧或者右侧。 true 表示固定在左侧 `true`                      | ^[enum]`'left' \| 'right'` / ^[boolean]                                     | `false`                                                                        |
| render-header         | 列标题 Label 区域渲染的函数                                                | ^[Function]`(data: { column: any, $index: number }) => void`                | —                                                                              |
| resizable             | 是否可以通过拖动改变宽度（需要在 el-table 上设置 border=true）             | ^[boolean]                                                                  | `true`                                                                         |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip                                             | ^[boolean] / [`object`](#table-attributes)                                  | `false`                                                                        |
| align                 | 内容对齐方式                                                               | ^[enum]`'left' \| 'center' \| 'right'`                                      | `'left'`                                                                       |
| header-align          | 表头对齐方式， 若不设置该项，则使用表格的对齐方式                          | ^[enum]`'left' \| 'center' \| 'right'`                                      | `'left'`                                                                       |
| class-name            | 列的 className                                                             | ^[string]                                                                   | `'y-column-form'`                                                              |
| label-class-name      | 当前列标题的自定义类名                                                     | ^[string]                                                                   | —                                                                              |

### Slots

| 名称    | 说明           | 参数                                               |
| ------- | -------------- | -------------------------------------------------- |
| default | 表单项内容插槽 | ^[object]`{ scope: any, row: any, prop: string }` |
| header  | 自定义表头内容 | ^[object]`{ column: any, index: number }`         |
