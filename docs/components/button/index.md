---
title: Button 按钮
description: Button 按钮
---

# Button 按钮

基本 el-button 组件封装：1、为 click 事件增加了防抖函数，2、整合了el-tooltip组件

## 防抖

:::demo 基于 [useDebounceFn](https://vueuse.org/shared/useDebounceFn/#usedebouncefn) 函数内置了click 的防抖行为，并且可以配置防抖时间及最大等待时间

button/click

:::

## tooltip

:::demo 组件内基于el-tooltip封装了tooltip功能。没有设置content属性或插槽时，不渲染el-tooltip

button/tooltip

:::

## API

### Attributes

| 属性名       | 说明                                                                               | 类型                                                                                                                                                                        | 默认值  |
| ------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| delay        | 防抖间隔时间，单位ms                                                               | ^[string] / ^[number]                                                                                                                                                       | `300`   |
| maxWait      | 最大等待时间，单位ms                                                               | ^[string] / ^[number]                                                                                                                                                       | —       |
| placement    | el-tooltip显示位置                                                                 | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| content      | el-tooltip内容                                                                     | ^[string]                                                                                                                                                                   | —       |
| tooltipProps | 优先级最高，参见[el-tooltip](https://element-plus.org/zh-CN/component/tooltip.html#attributes) | ^[object]`ElTooltipProps`                                                                                                                                                   | —       |

### Slots

与 [el-button](https://element-plus.org/zh-CN/component/button.html#button-slots) 相同

| 名称    | 说明                                          | 参数 |
| ------- | --------------------------------------------- | ---- |
| default | el-button的默认插槽                           | —    |
| loading | el-button的loading插槽                        | —    |
| icon    | el-button的icon插槽                           | —    |
| content | el-tooltip内容插槽，用于自定义tooltip显示内容 | —    |

### Exposes

| 属性名     | 说明                 | 类型                              |
| ---------- | -------------------- | --------------------------------- |
| buttonRef  | 内部 el-button 元素  | ^[object]`Ref<ElButtonInstance>` |
| tooltipRef | 内部 el-tooltip 元素 | ^[object]`Ref<ElTooltipInstance>` |
