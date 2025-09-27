---
title: ColumnForm 表单列
description: ColumnForm 表单列
---

# ColumnForm 表单列

基于 el-table-column 组件封装，用于在表格列中展示表单项，支持表单验证、错误提示等功能。与 column-forms 组件不同，该组件用于单列表单项。

## 基础用法

:::demo

column-form/test

:::

## API

### Attributes

| 属性名      | 说明                                           | 类型                                                                        | 默认值        |
| ----------- | ---------------------------------------------- | --------------------------------------------------------------------------- | ------------- |
| noFrom      | 是否不使用 el-form-item 包裹，仅作为普通列显示 | ^[boolean]                                                                  | `false`       |
| tName       | form中table字段名，用于绑定校验组              | ^[string]                                                                   | `'tableData'` |
| rules       | 表单验证规则                                   | ^[object]`FormRules` / ^[Function]`(scope: any, prop: string) => FormRules` | —             |
| formProps   | 表单项的其他属性                               | ^[object]`Partial<FormItemProps>`                                           | —             |
| tipProps    | 错误提示tooltip的属性                          | ^[object]`Partial<ElTooltipProps>`                                          | —             |
| headerStyle | 自定义表头样式                                 | ^[object]`Record<string, string \| number>`                                 | —             |

### Slots

| 名称    | 说明           | 参数                                     |
| ------- | -------------- | ---------------------------------------- |
| default | 表单项内容插槽 | `{ scope: any, row: any, prop: string }` |
| header  | 自定义表头内容 | `{ column: any, index: number }`         |

### Events

与 [el-table-column](https://element-plus.org/zh-CN/component/table.html#table-column-attributes) 相同
