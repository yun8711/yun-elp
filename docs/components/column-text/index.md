---
title: ColumnText 文本列
description: ColumnText 文本列
---

# ColumnText 文本列

基于 `el-table-column` 的业务文本列封装，支持链接态、格式化显示、文本样式与溢出 Tooltip 等能力。

1、可用于 `el-table` 和 `y-table`

2、`show-overflow-tooltip` 属性被 `noTip` 代替，且默认值为 `false` ，即默认显示tooltip

3、`formatter` 函数参数顺序与 `el-table-column` 有所不同

## 综合示例

::::demo

column-text/test

::::

## API

### Attributes

继承 [el-table-column 的全部属性](https://element-plus.org/zh-CN/component/table.html#table-column-attributes)，除了 show-overflow-tooltip（被no-tip代替）

另外包含以下属性：

| 属性名       | 说明                                                                               | 类型                                                      | 默认值      |
| ------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| link         | 是否以链接样式展示，开启后点击会触发 `click` 事件                                  | ^[boolean]                                                | `false`     |
| formatter    | 自定义单元格文本格式化函数，作用同 el-table-column的 formatter，只是修改了参数顺序 | ^[function]`(value: any, row: any, scope: any) => string` | `undefined` |
| text-style   | 文本样式，透传到内部文本                                                           | ^[object]`CSSProperties`                                  | `-`         |
| header-style | 表头样式，透传到表头元素                                                           | ^[object]`CSSProperties`                                  | `undefined` |
| no-tip       | 是否禁用溢出 Tooltip，作用于 `show-overflow-tooltip`                               | ^[boolean]                                                | `false`     |
| tip-props    | Tooltip 配置对象；传入对象时将作为 `show-overflow-tooltip` 的配置                  | ^[object]`Partial<ElTooltipProps>`                        | `undefined` |

### Slots

| 名称    | 说明                                                        | 参数                |
| ------- | ----------------------------------------------------------- | ------------------- |
| default | 单元格内容插槽，如果设置了 `formatter`，则value是转换后的值 | `{ value, scope }`  |
| header  | el-table-column的表头插槽                                                    | `{ column, index }` |
| expand  | el-table-column的展开列插槽                                                    | `{ expanded }`      |

### Events

| 事件名 | 说明                               | 类型                                                                   |
| ------ | ---------------------------------- | ---------------------------------------------------------------------- |
| click  | 当 `link` 为 `true` 时点击文本触发 | ^[function]`(row: any,value:any, scope: any,event:MouseEvent) => void` |
