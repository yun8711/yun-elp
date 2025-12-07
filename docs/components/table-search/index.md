---
title: TableSearch
description: 表格查询组件，支持多种搜索字段类型、动态属性和自定义组件
---

# TableSearch 表格查询

## 说明

一般与表格组件配合使用，用于处理查询条件，支持多种搜索字段类型、动态属性、自定义组件和函数式配置。

（1）每一个表单项都使用y-border-label组件包裹，兼容现有的所有的element-plus 表单组件，同时也允许通过插槽自定义

（2）组件内部会自动根据配置项的组件类型和 label 自动生成placeholder（使用slot的自定义表单项除外）

（3）需要注意的是：配置项的 comp 属性接收一个组件，但是需要使用 [`markRaw()`](https://cn.vuejs.org/api/reactivity-advanced.html#markraw) 包装

## 用法示例

### 多行模式

:::demo 通常用于首行为模糊搜索，例如关键词，更多精准的搜索条件需要通过展开操作才展示。需要展示在首行的配置项设置 first:true 即可

table-search/basic

:::

### 单行模式

:::demo 当options配置项中没有配置项为 first:true 时，即为单行模式，所有表单项平铺展示，且没有展开/收起操作

table-search/multi-row

:::

### 动态属性和值格式化

:::demo 支持根据表单状态和组件状态动态调整字段的显示、禁用等属性。同时支持值格式化，可以在值更新时对值进行处理

table-search/dynamic

:::

## API

### Attributes

| 参数           | 说明                                     | 类型                                                                                              | 默认值   |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------- | -------- |
| options        | 字段配置                                 | ^[object]`TableSearchOption[]` / ^[Function]`(params: DynamicPropsParams) => TableSearchOption[]` | `[]`       |
| fold-text      | 收起按钮文本                             | ^[string]                                                                                         | `'收起'`     |
| un-fold-text   | 展开按钮文本                             | ^[string]                                                                                         | `'高级搜索'` |
| default-fold   | 默认是否折叠                             | ^[boolean]                                                                                        | `false`    |
| duration       | 折叠过渡时间                             | ^[number]                                                                                         | `0.2`      |
| disabled-first | 多行模式下，展开时是否自动禁用第一行     | ^[boolean]                                                                                        | `true`     |
| clear-on-fold  | 多行模式下，展开、收起时是否自动清空数据 | ^[boolean]                                                                                        | `true`     |

### TableSearchOption Attribute

| 参数        | 说明                                                                                     | 类型                                                                                                                                    | 默认值  |
| ----------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| prop        | 字段的key                                                                                | ^[string]                                                                                                                               | —       |
| label       | 字段标签                                                                                 | ^[string]                                                                                                                               | —       |
| first       | 是否展示在第一行                                                                         | ^[boolean]                                                                                                                              | `false`   |
| comp        | 字段组件类型                                                                             | ^[object]`Component`                                                                                                                    | `ElInput` |
| value       | 字段初始值                                                                               | `any`                                                                                                                                   | `""`    |
| hidden      | 是否隐藏                                                                                 | ^[boolean] / ^[Function]`(params: DynamicPropsParams) => boolean`                                                                       | `false`   |
| disabled    | 是否禁用                                                                                 | ^[boolean] / ^[Function]`(params: DynamicPropsParams) => boolean`                                                                       | `false`   |
| valueFormat | 值格式化函数，在值更新时对值进行处理，可以返回单个值或对象（对象会被合并到formatForm中） | ^[object]`Record<string, any>` / ^[Function]`(value: any, prop: string, form: Record<string, any>) => any`                              | —       |
| borderAttrs | y-border-label支持的属性                                                                 | ^[object]`BorderLabelProps & Record<string, any>` / ^[Function]`(params: DynamicPropsParams) => BorderLabelProps & Record<string, any>` | —       |
| innerAttrs  | 给内部组件的属性                                                                         | ^[object]`Record<string, any>` / ^[Function]`(params: DynamicPropsParams) => Record<string, any>`                                       | —       |
| custom      | 是否自定义组件，即使用slot                                                               | ^[boolean]                                                                                                                              | `false`   |

### DynamicPropsParams Attribute

| 参数   | 说明             | 类型                           |
| ------ | ---------------- | ------------------------------ |
| form   | 当前表单的所有值 | ^[object]`Record<string, any>` |
| isFold | 是否折叠状态     | ^[boolean]                     |
| prop   | 当前字段名       | ^[string]                      |
| value  | 当前字段的值     | `any`                          |

### Events

| 事件名 | 说明               | 类型                                                        |
| ------ | ------------------ | ----------------------------------------------------------- |
| search | 点击搜索按钮时触发 | ^[Function]`()=>{form: Record<string, any>}`                |
| reset  | 点击重置按钮时触发 | ^[Function]`()=>{form: Record<string, any>}`                |
| change | 表单值变化时触发   | ^[Function]`()=>{form: Record<string, any>}`                |
| fold   | 折叠状态变化时触发 | ^[Function]`()=>{isFold: boolean,form:Record<string, any>}` |

### Slots

| 名称   | 说明                            | 参数                                                                                      |
| ------ | ------------------------------- | ----------------------------------------------------------------------------------------- |
| right  | 右侧内容                        | —                                                                                         |
| [prop] | 自定义字段组件，{prop} 为字段名 | ^[object]`{ prop: string, value: any, item: TableSearchItem, form: Record<string, any> }` |

### TableSearchItem Attribute

| 参数        | 说明                                                                                     | 类型                                                                                                            | 默认值  |
| ----------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------- |
| prop        | 字段的key                                                                                | ^[string]                                                                                                       | —       |
| label       | 字段标签                                                                                 | ^[string]                                                                                                       | —       |
| first       | 是否展示在第一行                                                                         | ^[boolean]                                                                                                      | `false`   |
| comp        | 字段组件类型                                                                             | ^[object]`Component`                                                                                            | `ElInput` |
| value       | 字段初始值                                                                               | `any`                                                                                                           | ""      |
| hidden      | 是否隐藏                                                                                 | ^[boolean]                                                                                                      | `false`   |
| valueFormat | 值格式化函数，在值更新时对值进行处理，可以返回单个值或对象（对象会被合并到formatForm中） | ^[Function]`(value: any, prop: string, form: Record<string, any>) => any \| Record<string, any>` / ^[undefined] | —       |
| borderAttrs | y-border-label支持的属性                                                                 | ^[object]`BorderLabelProps`                                                                                     | —       |
| innerAttrs  | 给内部组件的属性                                                                         | ^[object]`Record<string, any>`                                                                                  | —       |
| custom      | 是否自定义组件，即使用slot                                                               | ^[boolean]                                                                                                      | `false`   |
