---
title: Table 表格
description: Table 表格
---

# Table 表格

基于 el-table + el-pagination 封装，内置了表格和分页组件，默认插槽与 el-table 的默认插槽相同

## 基础用法

:::demo

table/test

:::

## API

### Attributes

| 属性名           | 说明                                              | 类型                       | 默认值      |
| ---------------- | ------------------------------------------------- | -------------------------- | ----------- |
| loading          | 是否显示加载状态                                  | ^[boolean]                 | `false`     |
| empty-props      | 空状态配置                                        | ^[object]`EmptyProps`      | —           |
| show-footer      | 是否显示底部区域                                  | ^[boolean]                 | `true`      |
| pagination-props | 分页配置                                          | ^[object]`PaginationProps` | —           |
| formTableProp    | 在表单对象中嵌套的 table 数据的键名，用于绑定校验 | ^[string]                  | `tableData` |

### Slots

| 名称    | 说明             | 参数 |
| ------- | ---------------- | ---- |
| default | 表格内容插槽     | —    |
| empty   | 空状态插槽       | —    |
| footer  | 底部区域插槽     | —    |
| append  | 表格追加内容插槽 | —    |

### Events

| 事件名            | 说明           | 类型                                                                  |
| ----------------- | -------------- | --------------------------------------------------------------------- |
| pagination-change | 分页变化时触发 | ^[function]`(obj: { currentPage: number, pageSize: number }) => void` |

### Exposes

默认代理了 `el-table` 的所有方法

| 名称               | 说明                                                                                                  | 类型                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| clearSelection     | 用于多选表格，清空用户的选择 selection                                                                | ^[Function]`() => void`                                                      |
| getSelectionRows   | 返回当前选中的行 rows                                                                                 | ^[Function]`() => any[]`                                                     |
| toggleRowSelection | 用于多选表格，切换某一行的选中状态， 如果使用了第二个参数，则可直接设置这一行选中与否                 | ^[Function]`(row: any, selected?: boolean, ignoreSelectable = true) => void` |
| toggleAllSelection | 用于多选表格，切换全选和全不选all                                                                     | ^[Function]`() => void`                                                      |
| toggleRowExpansion | 用于可扩展的表格或树表格，如果某行被扩展，则切换。 使用第二个参数，您可以直接设置该行应该被扩展或折叠 | ^[Function]`(row: any, expanded?: boolean) => void`                          |
| setCurrentRow      | 用于单选表格，设定某一行为选中行， 如果调用时不加参数，则会取消目前高亮行的选中状态                   | ^[Function]`(row: any) => void`                                              |
| clearSort          | 用于清空排序条件，数据会恢复成未排序的状态 order                                                      | ^[Function]`() => void`                                                      |
| clearFilter        | 传入由columnKey 组成的数组以清除指定列的过滤条件。 如果没有参数，清除所有过滤器                       | ^[Function]`(columnKeys?: string[]) => void`                                 |
| doLayout           | 对 Table 进行重新布局。 当表格可见性变化时，您可能需要调用此方法以获得正确的布局                      | ^[Function]`() => void`                                                      |
| sort               | 手动排序表格。 参数 prop 属性指定排序列，order 指定排序顺序                                           | ^[Function]`(prop: string, order: string) => void`                           |
| scrollTo           | 滚动到一组特定坐标 coordinates                                                                        | ^[Function]`(options: number \| ScrollToOptions, yCoord?: number) => void`   |
| setScrollTop       | 设置垂直滚动位置                                                                                      | ^[Function]`(top?: number) => void`                                          |
| setScrollLeft      | 设置水平滚动位置                                                                                      | ^[Function]`(left?: number) => void`                                         |
| columns            | 获取表列的 context                                                                                    | ^[array]`TableColumnCtx<T>[]`                                                |
| updateKeyChildren  | 适用于 lazy Table, 需要设置 rowKey, 更新 key children                                                 | ^[Function]`(key: string, data: T[]) => void`                                |
