---
title: ColumnForms 多表单列
description: ColumnForm 多表单列
---

# ColumnForms 多表单列

基于 el-table-column 组件封装，用于在表格列中展示多个表单项，支持表单验证、条件显示等功能。

该组件需要在 `y-table` 中使用，每个表单项通过动态插槽的方式自定义内容。插槽名称与 `options` 中每个表单项的 `prop` 属性对应。

## 基础用法

:::demo

column-forms/test

:::

## API

### Attributes

| 属性名      | 说明                              | 类型                                        | 默认值        |
| ----------- | --------------------------------- | ------------------------------------------- | ------------- |
| options     | 表单项配置数组                    | ^[object]`ColumnFormsItem[]`                | `[]`          |
| inline      | `flex-wrap` 行为来控制表单排列    | ^[boolean]                                  | `true`        |
| tName       | form中table字段名，用于绑定校验组 | ^[string]                                   | `'tableData'` |
| headerStyle | 自定义表头样式                    | ^[object]`Record<string, string \| number>` | `{}`          |

#### ColumnFormsItem

| 属性名       | 说明                  | 类型                                                                                                    | 默认值 |
| ------------ | --------------------- | ------------------------------------------------------------------------------------------------------- | ------ |
| prop         | 表单项的字段名，必填  | ^[string]                                                                                               | —      |
| label        | 表单项的标签          | ^[string]                                                                                               | —      |
| labelWidth   | 表单项标签宽度        | ^[string] / ^[number]                                                                                   | —      |
| rules        | 表单验证规则          | ^[object] / ^[Function]`(scope: any, prop: string) => any`                                              | —      |
| formAttrs    | 表单项的其他属性      | ^[object]`Partial<FormItemProps>` / ^[Function]`(scope: any, prop: string) => Partial<FormItemProps>`   | —      |
| show         | 是否显示表单项        | ^[boolean] / ^[Function]`(scope: any, prop: string) => boolean`                                         | `true` |
| width        | 表单项宽度            | ^[string] / ^[Function]`(scope: any, prop: string) => string`                                           | `auto` |
| tooltipAttrs | 错误提示tooltip的属性 | ^[object]`Partial<ElTooltipProps>` / ^[Function]`(scope: any, prop: string) => Partial<ElTooltipProps>` | —      |
| style        | 表单项样式            | ^[object]`Record<string, any>` / ^[Function]`(scope: any, prop: string) => Record<string, any>`         | —      |

### Slots

| 名称   | 说明                                                                      | 参数                                              |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------- |
| [prop] | 动态插槽，根据 options 中每个表单项的 prop 属性命名，用于自定义表单项内容 | ^[object]`{ scope: any, row: any, prop: string }` |
| header | 自定义表头内容                                                            | ^[object]`{ column: any, index: number }`         |
