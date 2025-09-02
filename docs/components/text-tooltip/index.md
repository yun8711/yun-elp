---
title: TextTooltip 提示文本
description: 用于文本溢出时显示tooltip提示的组件
---

# TextTooltip 提示文本

1、组件内置了el-tooltip，用于在文本内容超宽时显示tooltip提示，支持多种模式，支持单行和多行文本显示。

2、为了避免tooltip 弹出框的内容过多超出视窗（很少见，但不是没有），组件中内置的 el-tooltip 指定了样式名 `.y-text-tooltip__popper`，全局样式中通过 `--y-tooltip-popper-max-width`、`--y-tooltip-popper-max-height`指定最大宽度和最大高度，内容过多时会显示滚动条，样式与 `el-scrollbar` 一致。需要注意，如果内容过多并且指定了最大尺寸，这时需要配置`tooltipProps` 中 `enterable:true`，否则用户无法查看完整的内容

## 基础用法

:::demo

text-tooltip/test

:::

## API

### Attributes

| 属性名       | 说明                                                                                                | 类型                                                                                                                                                                        | 默认值                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| lineClamp    | 展示最大行数                                                                                        | ^[string] / ^[number]                                                                                                                                                       | `1`                                                                                                     |
| width        | 文本容器宽度                                                                                        | ^[string] / ^[number]                                                                                                                                                       | `'100%'`                                                                                                |
| placement    | tooltip显示位置，同 el-tooltip 的 placement                                                         | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`                                                                                                 |
| model        | tooltip显示方式                                                                                     | ^[enum]`'auto' \| 'none' \| 'always'`                                                                                                                                       | `'auto'`                                                                                                |
| tooltipProps | tooltip配置属性，详见[el-tooltip](https://element-plus.org/zh-CN/component/tooltip.html#attributes) | ^[object]`Partial<ElTooltipProps>`                                                                                                                                          | `{placement: 'top',showAfter: 50,hideAfter: 50,enterable: false,popperClass: 'y-text-tooltip__popper'}` |
| textStyle    | 自定义文本样式                                                                                      | ^[object]`Record<string, any>`                                                                                                                                              | `{}`                                                                                                    |

### Slots

| 名称    | 说明                                       | 参数 |
| ------- | ------------------------------------------ | ---- |
| default | 默认插槽，用于放置文本内容                 | —    |
| content | tooltip内容插槽，用于自定义tooltip显示内容 | —    |

### Exposes

| 名称    | 说明              | 类型                   |
| ------- | ----------------- | ---------------------- |
| textRef | 文本容器的DOM引用 | ^[object]`HTMLElement` |
