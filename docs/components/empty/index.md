---
title: Empty
description: 展示空数据状态的组件
---

# Empty 空状态

## 说明

基于 `el-empty` 封装，用于展示空数据状态。主要功能是可以通过 y-app-wrap 传递默认值，提供全局统一配置

## 用法示例

### 基础用法

:::demo

empty/test

:::

## API

### Attributes

| 属性名      | 说明                            | 类型                     | 默认值       |
| ----------- | ------------------------------- | ------------------------ | ------------ |
| image       | 图片地址                        | ^[string]                | —            |
| image-size  | 图片尺寸                        | ^[number]                | `100`        |
| description | 描述文字                        | ^[string]                | `'暂无数据'` |
| style       | el-empty支持的样式，包括css变量 | ^[object]`CSSProperties` | —            |

### Slots

| 名称        | 说明           | 参数 |
| ----------- | -------------- | ---- |
| default     | 自定义底部内容 | —    |
| image       | 自定义图片内容 | —    |
| description | 自定义描述     | —    |

### CSS Variables

其他变量参考 [el-empty](https://element-plus.org/zh-CN/component/empty.html#%E9%BB%98%E8%AE%A4%E5%8F%98%E9%87%8F)
