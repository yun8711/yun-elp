---
title: Button 按钮
description: Button 按钮
---

# Button 按钮

基本 el-button 组件封装，主要是为 click 事件增加了防抖函数

## 基础用法

:::demo

button/test

:::

## API

### Attributes

| 属性名  | 说明                 | 类型                  | 默认值      |
| ------- | -------------------- | --------------------- | ----------- |
| delay   | 最大等待时间，单位ms | ^[string] / ^[number] | `300`       |
| maxWait | 最大等待时间，单位ms | ^[string] / ^[number] | `undefined` |

### Slots

与 [el-button](https://element-plus.org/zh-CN/component/button.html#button-slots) 相同

### Exposes

| 属性名 | 说明               | 类型                              |
| ------ | ------------------ | --------------------------------- |
| ref    | 内部el-button 元素 | ^[object]`Ref<HTMLButtonElement>` |
