---
title: ColumnFilter
description: 表格筛选及状态标签显示的列
---

# ColumnFilter 筛选列

基于 `el-table-column` 封装的筛选+状态显示列，因为一般状态显示与筛选功能会同时使用，所以该组件主要是为了简化该场景下的配置。

（1）可用于 `el-table` 和 `y-table`

（2）使用 `config` 属性可以同时配置筛选、状态样式、formatter，同时可以使用自定义的 `filter`、`formatter`来覆盖

（3）需要注意：如果使用了自定义的 `formatter` 配置，则需要注意 `filter` 中的 `text` 与显示的内容保持一致

（4）`formatter` 属性支持三种配置：

- `true`（默认）：使用 `config` 中匹配项的 `text` 作为显示文本
- `false`：显示原始值，不进行格式化
- `function`：使用自定义格式化函数

（5）筛选优先级：`attrs.filters` > `config`（当未设置 `noFilter` 时）

## 基础用法

:::demo

column-filter/test

:::

## API

### Attributes

| 属性名                | 说明                                                                                        | 类型                                                                                                                                                                        | 默认值              |
| --------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| no-status             | 是否不显示状态样式，默认显示                                                                | ^[boolean]                                                                                                                                                                  | `false`             |
| no-filter             | 是否不启用筛选功能，默认显示                                                                | ^[boolean]                                                                                                                                                                  | `false`             |
| formatter             | 值格式化函数                                                                                | ^[boolean] / ^[function]`(value: any, row: any, scope: any) => string`                                                                                                      | `true`              |
| config                | 配置筛选选项、状态样式和格式化                                                              | ^[array]`ColumnFilterConfig[]`                                                                                                                                              | `[]`                |
| text-style            | 自定义文本样式                                                                              | ^[object]`Record<string, any>`                                                                                                                                              | —                   |
| label                 | 显示的列标题                                                                                | ^[string]                                                                                                                                                                   | —                   |
| column-key            | column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件    | ^[string]                                                                                                                                                                   | —                   |
| prop                  | 列内容的字段名， 也可以使用 property属性                                                    | ^[string]                                                                                                                                                                   | —                   |
| width                 | 列的宽度，固定的                                                                            | ^[string] / ^[number]                                                                                                                                                       | 'auto'                  |
| min-width             | 列的最小宽度，会把剩余宽度按比例分配给设置了 min-width 的列                                 | ^[string] / ^[number]                                                                                                                                                       | `100`                  |
| fixed                 | 列是否固定在左侧或者右侧。 true 表示固定在左侧 `true`                                       | ^[enum]`'left' \| 'right'` / ^[boolean]                                                                                                                                     | `false`               |
| render-header         | 列标题 Label 区域渲染使用的 Function                                                        | ^[Function]`(data: { column: any, $index: number }) => void`                                                                                                                | —                   |
| resizable             | 是否可以通过拖动改变宽度（需要在 el-table 上设置 border=true）                              | ^[boolean]                                                                                                                                                                  | `true`              |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip                                                              | ^[boolean] / [`object`](#table-attributes)                                                                                                                                  | `undefined`         |
| align                 | 内容对齐方式                                                                                | ^[enum]`'left' \| 'center' \| 'right'`                                                                                                                                      | `'left'`            |
| header-align          | 表头对齐方式， 若不设置该项，则使用表格的对齐方式                                           | ^[enum]`'left' \| 'center' \| 'right'`                                                                                                                                      | `'left'`            |
| class-name            | 列的 className                                                                              | ^[string]                                                                                                                                                                   | `'y-column-filter'` |
| label-class-name      | 当前列标题的自定义类名                                                                      | ^[string]                                                                                                                                                                   | —                   |
| filters               | 数据过滤的选项， 数组格式，每个元素都需要有 text 和 value 属性                              | ^[array]`Array<{text: string, value: string}>`                                                                                                                              | —                   |
| filter-placement      | 过滤弹出框的定位                                                                            | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | —                   |
| filter-class-name     | 过滤弹出框的 className                                                                      | ^[string]                                                                                                                                                                   | —                   |
| filter-multiple       | 数据过滤的选项是否多选                                                                      | ^[boolean]                                                                                                                                                                  | `true`              |
| filter-method         | 数据过滤使用的方法， 如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示 | ^[function]`(value: any, row: any, column: any) => void`                                                                                                                    | —                   |
| filtered-value        | 选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性                        | ^[object]`string[]`                                                                                                                                                         | —                   |
| tooltip-formatter     | 使用 show-overflow-tooltip 时自定义 tooltip 内容                                            | ^[function]`(data: { row: any, column: any, cellValue: any }) => VNode \| string`                                                                                           | —                   |

### ColumnFilterConfig

| 属性名  | 说明                                           | 类型       | 默认值 |
| ------- | ---------------------------------------------- | ---------- | ------ |
| text    | 同el-table-column filter配置的text，即显示文本 | ^[string]  | —      |
| value   | 值                                             | ^[any]     | —      |
| color   | 文字颜色                                       | ^[string]` | —      |
| bgColor | 背景颜色                                       | ^[string]  | —      |

### Slots

| 名称        | 说明                       | 参数                                                    |
| ----------- | -------------------------- | ------------------------------------------------------- |
| default     | 默认插槽，自定义单元格内容 | ^[object]`{ scope, value }`                             |
| header      | 自定义表头内容             | ^[object]`{ column: TableColumnCtx<T>, index: number }` |
| expand      | 展开行插槽                 | ^[object]`{ expanded: boolean }`                        |
| filter-icon | 自定义筛选图标             | ^[object]`{ filterOpened: boolean }`                    |
