---
title: Drawer 抽屉
description: Drawer 抽屉
---

# Drawer 抽屉

主要是修改了 el-drawer 组件内置样式，footer插槽默认内置了"确定"、"取消"按钮

## 用法

:::demo

drawer/test

:::

## API

除下面的属性外，其他属性同 [el-drawer](https://element-plus.org/zh-CN/component/drawer.html#api)

### Attributes

| 属性名       | 说明                         | 类型                           | 默认值                      |
| ------------ | ---------------------------- | ------------------------------ | --------------------------- |
| size         | 抽屉尺寸                     | ^[string] / ^[number]          | `'640px'`                   |
| headerClass  | header 部分的自定义 class 名 | ^[string]                      | `'y-drawer__header'`        |
| bodyClass    | body 部分的自定义 class 名   | ^[string]                      | `'y-drawer__body'`          |
| footerClass  | footer 部分的自定义 class 名 | ^[string]                      | `'y-drawer__footer'`        |
| titleStyle   | 标题样式                     | ^[object]`Record<string, any>` | —                           |
| showFooter   | 是否显示底部按钮区域         | ^[boolean]                     | `true`                      |
| noConfirm    | 是否隐藏确认按钮             | ^[boolean]                     | `false`                     |
| confirmText  | 确认按钮文本                 | ^[string]                      | `'确定'`                    |
| confirmProps | 确认按钮属性                 | ^[object]`YButtonProps`        | ^[object]`{type:'primary'}` |
| noCancel     | 是否隐藏取消按钮             | ^[boolean]                     | `false`                     |
| cancelText   | 取消按钮文本                 | ^[string]                      | `'取消'`                    |
| cancelProps  | 取消按钮属性                 | ^[object]`YButtonProps`        | ^[object]`{type:'default'}` |

### Slots

| 名称    | 说明                                | 参数 |
| ------- | ----------------------------------- | ---- |
| default | 抽屉内容，同el-drawer的default      | —    |
| header  | 自定义头部内容，同el-drawer的header | —    |
| title   | 自定义标题内容                      | —    |
| footer  | 自定义底部内容，同el-drawer的footer | —    |
| confirm | 自定义确认按钮                      | —    |
| cancel  | 自定义取消按钮                      | —    |

### Events

| 事件名  | 说明               | 类型                    |
| ------- | ------------------ | ----------------------- |
| confirm | 点击确认按钮时触发 | ^[function]`() => void` |
| cancel  | 点击取消按钮时触发 | ^[function]`() => void` |

### Exposes

| 名称  | 说明     | 类型                    |
| ----- | -------- | ----------------------- |
| open  | 打开抽屉 | ^[function]`() => void` |
| close | 关闭抽屉 | ^[function]`() => void` |
