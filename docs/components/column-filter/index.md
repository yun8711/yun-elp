---
title: ColumnFilter 筛选列
description: ColumnFilter 筛选列
---

# ColumnFilter 筛选列

基于 `el-table-column` 封装的筛选+状态显示列，因为一般状态显示与筛选功能会同时使用，所以该组件主要是为了简化该场景下的配置。

1、可用于 `el-table` 和 `y-table`

2、使用 `config` 属性可以同时配置筛选、状态样式、formatter，同时可以使用自定义的 `filter`、`formatter`来覆盖

3、需要注意：如果使用了自定义的 `formatter` 配置，则需要注意 `filter` 中的 `text` 与显示的内容保持一致

4、`formatter` 属性支持三种配置：

- `true`（默认）：使用 `config` 中匹配项的 `text` 作为显示文本
- `false`：显示原始值，不进行格式化
- `function`：使用自定义格式化函数

5、筛选优先级：`attrs.filters` > `config`（当未设置 `noFilter` 时）

## 基础用法

:::demo

column-filter/test

:::

## API

### Attributes

| 属性名      | 说明                           | 类型                                                        | 默认值  |
| ----------- | ------------------------------ | ----------------------------------------------------------- | ------- |
| noStatus    | 是否不显示状态样式             | `boolean`                                                   | `false` |
| noFilter    | 是否不启用筛选功能             | `boolean`                                                   | `false` |
| formatter   | 值格式化函数                   | `boolean \| ((value: any, row: any, scope: any) => string)` | `true`  |
| config      | 配置筛选选项、状态样式和格式化 | `ColumnFilterConfig[]`                                      | `[]`    |
| headerStyle | 自定义表头样式                 | `Record<string, any>`                                       | `{}`    |
| textStyle   | 自定义文本样式                 | `Record<string, any>`                                       | —       |

### ColumnFilterConfig

| 属性名  | 说明                                           | 类型     | 默认值 |
| ------- | ---------------------------------------------- | -------- | ------ |
| text    | 同el-table-column filter配置的text，即显示文本 | `string` | —      |
| value   | 值                                             | `any`    | —      |
| color   | 文字颜色                                       | `string` | —      |
| bgColor | 背景颜色                                       | `string` | —      |

### Slots

| 名称        | 说明                       | 参数                |
| ----------- | -------------------------- | ------------------- |
| —           | 默认插槽，自定义单元格内容 | `{ scope, value }`  |
| header      | 自定义表头内容             | `{ column, index }` |
| expand      | 展开行插槽                 | `{ expanded }`      |
| filter-icon | 自定义筛选图标             | `{ filterOpened }`  |
