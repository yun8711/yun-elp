---
title: ColumnText
description: 单元格内展示各种自定义文本的列
---

# ColumnText 文本列

## 说明

基于 `el-table-column` 的封装，支持单元格内文本链接形式、格式化显示、自定义样式、文本溢出 Tooltip 等能力。

（1）可用于 `el-table` 和 `y-table`

（2）`show-overflow-tooltip` 属性被 `noTip` 代替，且默认值为 `false` ，即默认显示tooltip

（3）`formatter` 函数参数顺序与 `el-table-column` 有所不同

## 用法示例

### 基础用法

::::demo

column-text/test

::::

## API

### Attributes

| 属性名           | 说明                                                                               | 类型                                                         | 默认值                                   |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| link             | 是否以链接样式展示，开启后点击会触发 `click` 事件                                  | ^[boolean]                                                   | `false`                                  |
| formatter        | 自定义单元格文本格式化函数，作用同 el-table-column的 formatter，只是修改了参数顺序 | ^[function]`(value: any, row: any, scope: any) => string`    | `undefined`                              |
| text-style       | 单元格内文本样式                                                                   | ^[object]`CSSProperties`                                     | `-`                                      |
| no-tip           | 是否禁用溢出 Tooltip 提示，代替 `show-overflow-tooltip`                            | ^[boolean]                                                   | `false`                                  |
| tip-props        | Tooltip 配置对象；传入对象时将作为 `show-overflow-tooltip` 的配置                  | ^[object]`Partial<ElTooltipProps>`                           | `{popperClass:'y-column-text__tooltip'}` |
| label            | 显示的列标题                                                                       | ^[string]                                                    | —                                        |
| prop             | 列内容的字段名， 也可以使用 property属性                                           | ^[string]                                                    | —                                        |
| width            | 列的宽度，固定的                                                                   | ^[string] / ^[number]                                        | 'auto'                                   |
| min-width        | 列的最小宽度，会把剩余宽度按比例分配给设置了 min-width 的列                        | ^[string] / ^[number]                                        | `100`                                    |
| fixed            | 列是否固定在左侧或者右侧。 true 表示固定在左侧 `true`                              | ^[enum]`'left' \| 'right'` / ^[boolean]                      | `false`                                  |
| render-header    | 列标题 Label 区域渲染的函数                                                        | ^[Function]`(data: { column: any, $index: number }) => void` | —                                        |
| resizable        | 是否可以通过拖动改变宽度（需要在 el-table 上设置 border=true）                     | ^[boolean]                                                   | `true`                                   |
| align            | 内容对齐方式                                                                       | ^[enum]`'left' \| 'center' \| 'right'`                       | `'left'`                                 |
| header-align     | 表头对齐方式， 若不设置该项，则使用表格的对齐方式                                  | ^[enum]`'left' \| 'center' \| 'right'`                       | `'left'`                                 |
| class-name       | 列的 className                                                                     | ^[string]                                                    | `'y-column-text'`                        |
| label-class-name | 当前列标题的自定义类名                                                             | ^[string]                                                    | —                                        |

### Slots

| 名称    | 说明                                                        | 参数                                                    |
| ------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| default | 单元格内容插槽，如果设置了 `formatter`，则value是转换后的值 | ^[object]`{ value, scope }`                             |
| header  | 自定义表头内容                                              | ^[object]`{ column: TableColumnCtx<T>, index: number }` |
| expand  | 展开列的自定义内容                                          | ^[object]`{ expanded: boolean }`                        |

### Events

| 事件名 | 说明                               | 类型                                                                   |
| ------ | ---------------------------------- | ---------------------------------------------------------------------- |
| click  | 当 `link` 为 `true` 时点击文本触发 | ^[function]`(row: any,value:any, scope: any,event:MouseEvent) => void` |
