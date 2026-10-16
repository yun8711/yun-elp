---
title: OrderButton
description: 单字段排序按钮
---

# OrderButton 排序按钮

单字段的排序按钮。`v-model` 绑定方向：`asc` 升序（上图标高亮）、`desc` 降序（下图标高亮），空字符串表示未排序。

初次点击时，方向变为 `default-order`（默认 `asc`）。再次点击在升序、降序之间切换。`clearable` 为 `true` 时，降序后再点一次会取消排序。

`icon` 可选 `caret`（三角形，默认）或 `arrow`（箭头）。

## 用法示例

### 基础用法

:::demo

order-button/basic

:::

### 箭头图标

:::demo `icon` 设为 `arrow` 时使用箭头，默认 `caret` 为三角形。

order-button/icon

:::

### 按钮组

:::demo 每个按钮只负责一个字段。外层用当前字段决定哪个按钮带有方向。

order-button/group

:::

### 取消排序

:::demo `clearable` 为 `true` 时，升序 → 降序 → 取消。

order-button/clearable

:::

## API

### Attributes

| 属性名                | 说明                         | 类型                           | 默认值    |
| --------------------- | ---------------------------- | ------------------------------ | --------- |
| model-value / v-model | 当前方向，空字符串表示未排序 | ^[enum]`'asc' \| 'desc' \| ''` | `''`      |
| default-order         | 从未排序点下时的方向         | ^[enum]`'asc' \| 'desc'`       | `'asc'`   |
| clearable             | 降序后再点击是否取消排序     | ^[boolean]                     | `false`   |
| icon                  | 指示图标                     | ^[enum]`'caret' \| 'arrow'`    | `'caret'` |
| disabled              | 是否禁用                     | ^[boolean]                     | `false`   |

### Slots

| 名称    | 说明     | 参数 |
| ------- | -------- | ---- |
| default | 按钮文案 | —    |

### Events

| 事件名            | 说明           | 类型                                                |
| ----------------- | -------------- | --------------------------------------------------- |
| change            | 方向变化时触发 | ^[function]`(value: 'asc' \| 'desc' \| '') => void` |
| update:modelValue | 方向变化       | ^[function]`(value: 'asc' \| 'desc' \| '') => void` |

### CSS Variables

默认值取自默认尺寸的 `el-button`。覆盖 `--y-order-button-*` 即可，不写则跟随 Element Plus 按钮变量。

| 变量名                                 | 说明             | 默认值                              |
| -------------------------------------- | ---------------- | ----------------------------------- |
| --y-order-button-height                | 高度             | `--el-component-size`               |
| --y-order-button-padding-vertical      | 上下内边距       | `8px`                               |
| --y-order-button-padding-horizontal    | 左右内边距       | `15px`                              |
| --y-order-button-font-size             | 字号             | `--el-font-size-base`               |
| --y-order-button-font-weight           | 字重             | `--el-button-font-weight`           |
| --y-order-button-text-color            | 文字颜色         | `--el-button-text-color`            |
| --y-order-button-bg-color              | 背景色           | `--el-button-bg-color`              |
| --y-order-button-border                | 边框             | `--el-border`                       |
| --y-order-button-border-color          | 边框颜色         | `--el-button-border-color`          |
| --y-order-button-border-radius         | 圆角             | `--el-border-radius-base`           |
| --y-order-button-hover-text-color      | 悬停文字颜色     | `--el-button-hover-text-color`      |
| --y-order-button-hover-bg-color        | 悬停背景色       | `--el-button-hover-bg-color`        |
| --y-order-button-hover-border-color    | 悬停边框颜色     | `--el-button-hover-border-color`    |
| --y-order-button-active-text-color     | 按下文字颜色     | `--el-button-active-text-color`     |
| --y-order-button-active-bg-color       | 按下背景色       | `--el-button-active-bg-color`       |
| --y-order-button-active-border-color   | 按下边框颜色     | `--el-button-active-border-color`   |
| --y-order-button-disabled-text-color   | 禁用文字颜色     | `--el-button-disabled-text-color`   |
| --y-order-button-disabled-bg-color     | 禁用背景色       | `--el-button-disabled-bg-color`     |
| --y-order-button-disabled-border-color | 禁用边框颜色     | `--el-button-disabled-border-color` |
| --y-order-button-outline-color         | 焦点轮廓颜色     | `--el-button-outline-color`         |
| --y-order-button-icon-gap              | 文案与图标间距   | `6px`                               |
| --y-order-button-icon-color            | 图标颜色         | `--el-text-color-placeholder`       |
| --y-order-button-icon-active-color     | 当前方向图标颜色 | `--el-color-primary`                |
