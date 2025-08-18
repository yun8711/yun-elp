---
title: GroupSelect 组选择器
description: GroupSelect 组选择器，基于 ElButtonGroup 组件封装的按钮组选择器
---

# GroupSelect 组选择器

GroupSelect 是基于 ElButtonGroup 组件封装的按钮组选择器，提供了一种简洁的方式来创建单选按钮组

## 基础用法

最基本的用法，通过 `v-model` 绑定选中值，通过 `options` 配置选项。

:::demo

group-select/test

:::

## API

### Attributes

| 属性名                | 说明                 | 类型                  | 默认值 |
| --------------------- | -------------------- | --------------------- | ------ |
| model-value / v-model | 绑定值               | `string \| number`    | `''`   |
| options               | 选项数组             | `GroupSelectOption[]` | `[]`   |
| item-class            | 按钮的自定义类名     | `string`              | `''`   |
| item-styles           | 按钮的自定义样式对象 | `Record<string, any>` | `{}`   |

### GroupSelectOption Properties

| 属性名   | 说明             | 类型               | 默认值  |
| -------- | ---------------- | ------------------ | ------- |
| label    | 选项的标签文本   | `string`           | —       |
| value    | 选项的值         | `string \| number` | —       |
| disabled | 是否禁用该选项   | `boolean`          | `false` |
| icon     | 选项的图标       | `string`           | —       |
| loading  | 是否显示加载状态 | `boolean`          | `false` |

### Events

| 事件名 | 说明           | 类型                                                                                               |
| ------ | -------------- | -------------------------------------------------------------------------------------------------- |
| change | 选择变化时触发 | ^[function]`(value: string \| number, item: GroupSelectOption, index: number, event:PointerEvent)` |

### Slots

| 插槽名  | 说明           | 参数                                         |
| ------- | -------------- | -------------------------------------------- |
| default | 自定义选项内容 | `{ item: GroupSelectOption, index: number }` |
| icon    | 自定义图标     | —                                            |
| loading | 自定义加载状态 | —                                            |
