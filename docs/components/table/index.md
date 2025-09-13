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

| 属性名           | 说明             | 类型                       | 默认值  |
| ---------------- | ---------------- | -------------------------- | ------- |
| loading          | 是否显示加载状态 | ^[boolean]                 | `false` |
| empty-props      | 空状态配置       | ^[object]`EmptyProps`      | —       |
| show-footer      | 是否显示底部区域 | ^[boolean]                 | `true`  |
| pagination-props | 分页配置         | ^[object]`PaginationProps` | —       |

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

| 名称           | 说明                   | 类型                                 |
| -------------- | ---------------------- | ------------------------------------ |
| tableRef      | el-table组件的ref      | ^[object]`Ref<ElTableInstance>`      |
| paginationRef | el-pagination组件的ref | ^[object]`Ref<ElPaginationInstance>` |
