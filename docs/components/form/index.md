---
title: Form
description: 基于 Element Plus Form 的布局与联动表单
---

# Form 表单

## 说明

基于 [el-form](https://element-plus.org/zh-CN/component/form.html)、[el-form-item](https://element-plus.org/zh-CN/component/form.html#formitem-attributes)、[el-row](https://element-plus.org/zh-CN/component/layout.html#row-attributes)、[el-col](https://element-plus.org/zh-CN/component/layout.html#col-attributes) 封装，整合栅格布局与表单数据联动能力。

（1）`y-form` 整合 `el-form` + `el-row`，作为外层容器

（2）`y-form-item` 整合 `el-form-item` + `el-col`，内置栅格布局，详见 [FormItem 表单项](/components/form-item/)

（3）除扩展属性外，其余 API 与 Element Plus 官方文档保持一致，可直接透传使用

注意：

- `y-form` 的 `span` 会作为所有 `y-form-item` 的默认栅格占位；单项可通过 `:span` 覆盖
- 属性会分发给内部的 `el-form` 或 `el-row`，无需手动嵌套

## 用法示例

### 布局用法

:::demo y-form 设置 `:span="12"` 时表单项默认两列；y-form-item 可通过 span 单独控制占位

form/basic

:::

### config 联动

:::demo config 在表单字段变化时触发，参数为 `(model, context)`，context 包含 field、prevValue、newValue；static-fields 中的字段变化不会触发 config

form/config

:::

### debounce 防抖

:::demo debounce 控制 config 队列处理的防抖时间（ms），0 表示不防抖、立即处理

form/debounce

:::

## API

### Attributes

支持 [el-form](https://element-plus.org/zh-CN/component/form.html#form-attributes) 的全部属性及 [el-row](https://element-plus.org/zh-CN/component/layout.html#row-attributes) 的布局属性，写在 `y-form` 上即可，内部分发给对应子组件。下表列出常用项；未列出的 el-form 属性同样支持透传。

| 属性名         | 说明                                                      | 类型                                                                                         | 默认值    |
| -------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------- |
| config         | 表单数据变化时的回调，参数见[FormConfigFn](#formconfigfn) | ^[function]`(model, context) => void`                                                        | —         |
| static-fields  | 静态字段，变化时不触发 config                             | ^[object]`string[]`                                                                          | `[]`      |
| debounce       | config 队列处理防抖时间（ms），0 表示不防抖               | ^[number]                                                                                    | `300`     |
| span           | y-form-item 默认栅格占位                                  | ^[number]                                                                                    | `24`      |
| row-class      | 行容器 class                                              | ^[string]                                                                                    | `''`      |
| row-style      | 行容器 style                                              | ^[object]`CSSProperties`                                                                     | `{}`      |
| model          | 表单数据对象，同 el-form                                  | ^[object]`Record<string, any>`                                                               | `{}`      |
| rules          | 表单校验规则，同 el-form                                  | ^[object]`FormRules`                                                                         | `{}`      |
| label-width    | 标签宽度，同 el-form                                      | ^[string] / ^[number]                                                                        | —         |
| label-position | 标签位置，同 el-form                                      | ^[enum]`'left' \| 'right' \| 'top'`                                                          | `'right'` |
| inline         | 行内表单模式，同 el-form                                  | ^[boolean]                                                                                   | `false`   |
| gutter         | 栅格间隔，同 el-row                                       | ^[number]                                                                                    | `0`       |
| justify        | 水平排列方式，同 el-row                                   | ^[enum]`'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | `'start'` |
| align          | 垂直排列方式，同 el-row                                   | ^[enum]`'top' \| 'middle' \| 'bottom'`                                                       | —         |
| tag            | 自定义元素标签，同 el-row                                 | ^[string]                                                                                    | `'div'`   |

### FormConfigFn

| 参数              | 说明         | 类型                           |
| ----------------- | ------------ | ------------------------------ |
| model             | 当前表单数据 | ^[object]`Record<string, any>` |
| context           | 变化上下文   | ^[object]`FormChangeContext`   |
| context.field     | 变化的字段名 | ^[string]                      |
| context.prevValue | 变化前的值   | ^[any]                         |
| context.newValue  | 变化后的值   | ^[any]                         |

### Events

| 事件名   | 说明                 | 类型                                                                         |
| -------- | -------------------- | ---------------------------------------------------------------------------- |
| validate | 任一表单项校验后触发 | ^[function]`(prop: FormItemProp, isValid: boolean, message: string) => void` |

### Exposes

| 名称             | 说明                                                           | 类型                                                                                                       |
| ---------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| validateSync     | 校验整个表单，通过 resolve(model)，失败 reject                 | ^[function]`() => Promise<Record<string, any>>`                                                            |
| validate         | 校验整个表单，支持传入 callback 或返回 Promise，同 el-form     | ^[function]`(callback?: FormValidateCallback) => Promise<boolean>`                                         |
| validateField    | 校验指定字段，同 el-form                                       | ^[function]`(props?: FormItemProp \| FormItemProp[], callback?: FormValidateCallback) => Promise<boolean>` |
| resetFields      | 重置指定字段为初始值并移除校验结果，不传则重置全部，同 el-form | ^[function]`(props?: FormItemProp \| FormItemProp[]) => void`                                              |
| clearValidate    | 移除指定字段的校验结果，不传则移除全部，同 el-form             | ^[function]`(props?: FormItemProp \| FormItemProp[]) => void`                                              |
| scrollToField    | 滚动到指定字段，同 el-form                                     | ^[function]`(prop: FormItemProp) => void`                                                                  |
| getField         | 获取指定字段的上下文，同 el-form                               | ^[function]`(prop: FormItemProp) => FormItemContext \| undefined`                                          |
| fields           | 所有表单项字段的上下文，同 el-form                             | ^[object]`Reactive<FormItemContext[]>`                                                                     |
| setInitialValues | 设置表单字段初始值，`resetFields` 时将重置到此值，同 el-form   | ^[function]`(initModel: Record<string, any>) => void`                                                      |

### Slots

| 名称    | 说明                       |
| ------- | -------------------------- |
| default | 表单内容，放置 y-form-item |
