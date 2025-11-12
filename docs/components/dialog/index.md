---
title: Dialog 对话框
description: Dialog 对话框组件，基于 el-dialog 封装，提供更便捷的配置和事件处理
---

# Dialog 对话框

Dialog 对话框组件，基于 `el-dialog` 封装，footer 插槽默认内置了"确定"、"取消"按钮，并且默认都是防抖的

## 用法

:::demo

dialog/test

:::

## API

除下面的属性外，其他属性与 [el-dialog](https://element-plus.org/zh-CN/component/dialog#api) 一致

### Attributes

| 属性名        | 说明             | 类型                     | 默认值                                 |
| ------------- | ---------------- | ------------------------ | -------------------------------------- |
| modelValue    | 对话框显示状态   | ^[boolean]               | `false`                                |
| title         | 对话框标题       | ^[string]                | `''`                                   |
| titleStyle    | 标题样式         | ^[object]`CSSProperties` | `{}`                                   |
| showFooter    | 是否显示底部按钮 | ^[boolean]               | `true`                                 |
| noConfirm     | 是否隐藏确认按钮 | ^[boolean]               | `false`                                |
| confirmText   | 确认按钮文本     | ^[string]                | `'确定'`                               |
| confirmProps  | 确认按钮属性     | ^[object]`YButtonProps`  | `{ type: 'primary',model:'debounce' }` |
| noCancel      | 是否隐藏取消按钮 | ^[boolean]               | `false`                                |
| cancelText    | 取消按钮文本     | ^[string]                | `'取消'`                               |
| cancelProps   | 取消按钮属性     | ^[object]`YButtonProps`  | `{ type: 'default',model:'debounce' }` |
| bodyMaxHeight | body 区域最大高  | ^[string]                | `'50vh'`                               |

### Slots

| 名称    | 说明           | 参数 |
| ------- | -------------- | ---- |
| default | 对话框内容     | —    |
| header  | 自定义头部内容 | —    |
| title   | 自定义标题内容 | —    |
| footer  | 自定义底部内容 | —    |
| confirm | 自定义确认按钮 | —    |
| cancel  | 自定义取消按钮 | —    |

### Events

| 事件名            | 说明                     | 类型                                  |
| ----------------- | ------------------------ | ------------------------------------- |
| confirm           | 点击确认按钮时触发       | ^[Function]`() => void`               |
| cancel            | 点击取消按钮时触发       | ^[Function]`() => void`               |
| update:modelValue | 对话框显示状态变化时触发 | ^[Function]`(value: boolean) => void` |

### Exposes

| 名称      | 说明              | 类型                             |
| --------- | ----------------- | -------------------------------- |
| dialogRef | el-dialog组件实例 | ^[object]`Ref<ElDialogInstance>` |
