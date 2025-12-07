---
title: ColumnOperation
description: 单元格内展示操作按钮的列
---

# ColumnOperation 操作列

## 说明

基于 `el-table-column` 封装，主要用于为表格内行数据提供各种操作按钮，包括按钮禁用状态管理、tooltip提示、下拉菜单展示、确认对话框等常用功能。

（1）每个按钮都使用 `y-button` 组件，也就是默认支持防抖、节流、单击、双击等特性

（2）每个按钮都使用 `y-pop` 组件包裹，也就是默认支持 `el-tooltip` 和 `el-popover` 特性

## 用法示例

### 基础用法

:::demo

column-operation/test

:::

### 按钮禁用及tooltip提示

内部使用 `y-pop` 组件展示 `tooltip`

`disabled` 属性值可以是：`boolean`，`[boolean,string]`，`(scope,item)=>boolean | [boolean,string]`，当按钮禁用时，可以同时配置对应的 `tooltip`

- boolean值表示按钮是否禁用
- string值表示按钮禁用时的提示，未明确设置时会使用默认提示文本
- ColumnOperation 组件的 `disabledDefaultTip` 属性和 `appWrap` 组件的 `columnOpertaion.disabledDefaultTip` 都可以设置按钮禁用时的默认提示文本，前者优先级较高

:::demo

column-operation/disabled

:::

### 按钮popover

内部使用 `y-pop` 组件显示 `popover`

`popProps` 属性值用于配置按钮的 `popover` 弹框行为；默认情况下 `popProps.noPop === true`，即不展示 `popover`

:::demo

column-operation/popover

:::

## API

### Attributes

| 属性名                | 说明                                                           | 类型                                                                                                   | 默认值            |
| --------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------- |
| options               | 操作项配置数组或函数                                           | ^[array]`ColumnOperationItemType[]`/ ^[Function]`(scope: TableItemScope) => ColumnOperationItemType[]` | `[]`              |
| disabledDefaultTip    | 按钮禁用时的默认提示文本                                       | ^[string]                                                                                              | `''`              |
| label                 | 显示的列标题                                                   | ^[string]                                                                                              | —                 |
| prop                  | 列内容的字段名， 也可以使用 property属性                       | ^[string]                                                                                              | —                 |
| width                 | 列的宽度，固定的                                               | ^[string] / ^[number]                                                                                  | `'auto'`            |
| min-width             | 列的最小宽度，会把剩余宽度按比例分配给设置了 min-width 的列    | ^[string] / ^[number]                                                                                  | `100`             |
| fixed                 | 列是否固定在左侧或者右侧。 true 表示固定在左侧 `true`          | ^[enum]`'left' \| 'right'` / ^[boolean]                                                                | `'right'`           |
| render-header         | 列标题 Label 区域渲染的函数                                    | ^[Function]`(data: { column: any, $index: number }) => void`                                           | —                 |
| resizable             | 是否可以通过拖动改变宽度（需要在 el-table 上设置 border=true） | ^[boolean]                                                                                             | `true`            |
| show-overflow-tooltip | 当内容过长被隐藏时显示 tooltip                                 | ^[boolean] / [`object`](#table-attributes)                                                             | `false`           |
| align                 | 内容对齐方式                                                   | ^[enum]`'left' \| 'center' \| 'right'`                                                                 | `'left'`          |
| header-align          | 表头对齐方式， 若不设置该项，则使用表格的对齐方式              | ^[enum]`'left' \| 'center' \| 'right'`                                                                 | `'left'`          |
| class-name            | 列的 className                                                 | ^[string]                                                                                              | `'y-column-operation'` |
| label-class-name      | 当前列标题的自定义类名                                         | ^[string]                                                                                              | —                 |

### ColumnOperationItemType

| 属性     | 说明                                  | 类型                                                                                                                                                  | 默认值  |
| -------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| label    | 操作项的文本，可以是字符串或函数      | ^[string] / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => string)`                                                           | -       |
| prop     | 操作项的唯一标识                      | ^[string]                                                                                                                                             | -       |
| loading  | 按钮是否显示加载状态                  | ^[boolean]                                                                                                                                            | `false` |
| disabled | 按钮是否禁用，支持多种格式            | ^[boolean] / ^[array]`[boolean, string]` / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => ColumnOperationItemDisabledReturn)` | `false` |
| show     | 按钮是否显示                          | ^[boolean] / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => boolean)`                                                         | `true`  |
| dropdown | 是否以下拉菜单形式展示                | ^[boolean] / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => boolean)`                                                         | `false` |
| noPop    | 是否显示popover，默认不显示           | ^[boolean] / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => boolean)`                                                         | `true`  |
| popProps | popover的完整属性配置                 | ^[object]`Partial<PopProps>` / ^[Function]`((scope: TableItemScope, item: ColumnOperationItemType) => Partial<PopProps>)`                             | `{}`    |
| confirm  | 操作项的确认函数                      | ^[Function]`(scope: TableItemScope, item: ColumnOperationItemType, e: MouseEvent) => any`                                                             | -       |
| cancel   | 操作项的取消函数，在显示popover时生效 | ^[Function]`(scope: TableItemScope, item: ColumnOperationItemType, e: MouseEvent) => any`                                                             | -       |

### Slots

| 名称   | 说明                                   | 参数                            |
| ------ | -------------------------------------- | ------------------------------- |
| header | 自定义表头内容                         | ^[object]`{ column, index }`    |
| [prop] | 自定义操作项内容，prop为操作项的prop值 | ^[object]`{ scope, row, prop }` |
