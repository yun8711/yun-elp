---
title: PageProgress 页面进度条
description: PageProgress 页面进度条
---

# PageProgress 页面进度条

PageProgress 是一个页面级进度条组件，基于 `el-progress` 组件，借鉴 [NProgress](https://www.npmjs.com/package/nprogress) 库的实现。

## 基础用法

:::demo

page-progress/test

:::

## API

### Attributes

| 属性名      | 说明                                      | 类型       | 默认值                    |
| ----------- | ----------------------------------------- | ---------- | ------------------------- |
| modelValue  | 进度条开启/停止状态                       | ^[boolean] | `false`                   |
| step        | 步进距离 (0-100)                          | ^[number]  | `8`                       |
| spinner     | 是否显示右上角的加载图标                  | ^[boolean] | `true`                    |
| delay       | 完成后的延迟隐藏时间 (ms)                 | ^[number]  | `200`                     |
| speed       | 自动增量速度 (ms)，即间隔 speed 增长 step | ^[number]  | `200`                     |
| color       | 进度条颜色                                | ^[string]  | `var(--el-color-primary)` |
| strokeWidth | 进度条宽度                                | ^[number]  | `2`                       |

### Events

| 事件名                | 说明                            | 类型       |
| --------------------- | ------------------------------- | ---------- |
| model-value / v-model | 显示状态，true-开始，false-停止 | ^[boolean] |
