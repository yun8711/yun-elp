---
title: Button
description: 功能增强的按钮
---

# Button 增强按钮

## 说明

基于 el-button 组件和 [useDebounceFn](https://vueuse.org/shared/useDebounceFn/#usedebouncefn) / [useThrottleFn](https://vueuse.org/shared/useThrottleFn/#usethrottlefn) 函数封装，支持 `click`、`dblclick`及防抖、节流控制：

（1）通过 `model` 属性可以设置启动防抖或节流，此时 `delay` 默认为300ms

（2）仅绑定单击事件：不设置 `delay` 时立即响应，与普通按钮行为一致；设置 `delay` 时根据 `model` 决定是否应用防抖或节流

（3）同时绑定单击和双击事件：经过双击检测时间（`dbl-delay`）后响应，然后根据 `delay` 和 `model` 设置决定是否应用防抖或节流

组件内部实现了单击和双击的智能区分机制，双击时不会触发单击事件，确保交互体验的准确性。`dbl-delay` 参数仅在绑定双击事件时生效，用于控制双击检测时间阈值，必须大于等于 `delay` 参数

## 用法示例

### 单、双击

:::demo

button/dblclick

:::

### 防抖

:::demo

button/debounce

:::

### 节流

:::demo

button/throttle

:::

## API

### Attributes

| 属性名            | 说明                                                                      | 类型                                                                                      | 默认值  |
| ----------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------- |
| model             | 模式选择：debounce（防抖）或 throttle（节流），不设置时不启用防抖或节流   | ^[enum]`'debounce' \| 'throttle'`                                                         | —       |
| delay             | 防抖/节流间隔时间，单位ms，不设置时如果设置了model则默认为300ms           | ^[number]                                                                                 | `300`   |
| max-wait          | 最大等待时间，单位ms，仅在防抖模式下生效                                  | ^[number]                                                                                 | —       |
| dbl-delay         | 双击检测时间阈值，单位ms，用于区分单击和双击，必须大于等于delay           | ^[number]                                                                                 | `300`   |
| size              | 尺寸                                                                      | ^[enum]`'large' \| 'default' \| 'small'`                                                  | —       |
| type              | 按钮类型；color 属性优先级更高                                            | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'text' (deprecated)` | —       |
| plain             | 是否为朴素按钮，即无背景颜色                                              | ^[boolean]                                                                                | `false`   |
| text              | 是否为文字按钮                                                            | ^[boolean]                                                                                | `false`   |
| bg                | 是否显示文字按钮背景颜色                                                  | ^[boolean]                                                                                | `false`   |
| link              | 是否为链接按钮                                                            | ^[boolean]                                                                                | `false`   |
| round             | 是否为圆角按钮                                                            | ^[boolean]                                                                                | `false`   |
| circle            | 是否为圆形按钮                                                            | ^[boolean]                                                                                | `false`   |
| loading           | 是否为加载中状态                                                          | ^[boolean]                                                                                | `false`   |
| loading-icon      | 自定义加载中状态图标组件                                                  | ^[string] / ^[Component]                                                                  | `'Loading'` |
| disabled          | 按钮是否为禁用状态                                                        | ^[boolean]                                                                                | `false`   |
| icon              | 图标组件                                                                  | ^[string] / ^[Component]                                                                  | —       |
| autofocus         | 原生 `autofocus` 属性                                                     | ^[boolean]                                                                                | `false`   |
| native-type       | 原生 `type` 属性                                                          | ^[enum]`'button' \| 'submit' \| 'reset'`                                                  | `'button'`  |
| auto-insert-space | 两个中文字符之间自动插入空格(仅当文本长度为 2 且所有字符均为中文时才生效) | ^[boolean]                                                                                | `false`   |
| color             | 自定义按钮颜色, 并自动计算 `hover` 和 `active` 触发后的颜色               | ^[string]                                                                                 | —       |
| dark              | dark 模式, 意味着自动设置 color 为 dark 模式的颜色                        | ^[boolean]                                                                                | `false`   |
| tag               | 自定义元素标签                                                            | ^[string] / ^[Component]                                                                  | `'button'`  |

### Slots

| 名称    | 说明             | 参数 |
| ------- | ---------------- | ---- |
| default | 自定义默认内容   | —    |
| loading | 自定义加载中组件 | —    |
| icon    | 自定义图标组件   | —    |

### Exposes

| 名称           | 说明                       | 类型                                                                                                           |
| -------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ref            | 按钮 html 元素             | ^[object]`Ref<HTMLButtonElement>`                                                                              |
| size           | 按钮尺寸                   | ^[object]`ComputedRef<'' \| 'small' \| 'default' \| 'large'>`                                                  |
| type           | 按钮类型                   | ^[object]`ComputedRef<'' \| 'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| 'text'>` |
| disabled       | 按钮已禁用                 | ^[object]`ComputedRef<boolean>`                                                                                |
| shouldAddSpace | 是否在两个字符之间插入空格 | ^[object]`ComputedRef<boolean>`                                                                                |
