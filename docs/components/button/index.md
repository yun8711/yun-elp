---
title: Button 防抖按钮
description: Button 防抖按钮
---

# Button 防抖按钮

基于 el-button 组件和 [useDebounceFn](https://vueuse.org/shared/useDebounceFn/#usedebouncefn) 函数封装，内置了click 的防抖行为，可以配置防抖时间及最大等待时间

## 用法

:::demo

button/click

:::

## API

### Attributes

| 属性名  | 说明                 | 类型                  | 默认值 |
| ------- | -------------------- | --------------------- | ------ |
| delay   | 防抖间隔时间，单位ms | ^[string] / ^[number] | `300`  |
| maxWait | 最大等待时间，单位ms | ^[string] / ^[number] | —      |

### Slots

与 [el-button](https://element-plus.org/zh-CN/component/button.html#button-slots) 相同

| 名称    | 说明                   | 参数 |
| ------- | ---------------------- | ---- |
| default | el-button的默认插槽    | —    |
| loading | el-button的loading插槽 | —    |
| icon    | el-button的icon插槽    | —    |

### Exposes

| 名称      | 说明                | 类型                             |
| --------- | ------------------- | -------------------------------- |
| buttonRef | 内部 el-button 元素 | ^[object]`Ref<ElButtonInstance>` |

