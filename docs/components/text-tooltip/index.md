---
title: TextTooltip 提示文本
description: 用于文本溢出时显示tooltip提示的组件
---

# TextTooltip 提示文本

TextTooltip 组件用于在文本内容溢出时自动显示tooltip提示，支持单行和多行文本截断。

## 基础用法

:::demo

text-tooltip/test

:::

## API

### Attributes

| 属性名       | 说明               | 类型                                                                                                                                                                        | 默认值   |
| ------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| lineClamp    | 展示最大行数       | ^[string] / ^[number]                                                                                                                                                       | `1`      |
| width        | 文本容器宽度       | ^[string] / ^[number]                                                                                                                                                       | `'100%'` |
| placement    | tooltip显示位置    | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`  |
| tooltip      | tooltip显示方式    | ^[enum]`'auto' \| 'none' \| 'always'`                                                                                                                                       | `'auto'` |
| tooltipProps | tooltip配置属性    | ^[object]`Partial<ElTooltipProps>`                                                                                                                                          | `{}`     |
| textStyle    | 文本容器自定义样式 | ^[object]`Record<string, any>`                                                                                                                                              | `{}`     |

### Slots

| 名称    | 说明                                       | 参数 |
| ------- | ------------------------------------------ | ---- |
| default | 默认插槽，用于放置文本内容                 | —    |
| content | tooltip内容插槽，用于自定义tooltip显示内容 | —    |

### Exposes

| 名称    | 说明              | 类型                   |
| ------- | ----------------- | ---------------------- |
| textRef | 文本容器的DOM引用 | ^[object]`HTMLElement` |
