---
title: Pop 弹出框容器
description: Pop 弹出框容器
---

# PopButton 弹出框容器

1、该组件整合了 el-tooltip 和 el-popover 两个组件，可以用于复杂交互操作场景

2、默认插槽可以放置任何内容，与基本组件可以完美配合使用

3、el-tooltip 和 el-popover 组件都可以进行完整的配置

## 基础用法

:::demo

pop/basic

:::

## tooltip 用法

:::demo 默认情况下，只有配置了 `tip-content` 才会启用内部的 el-tooltip；设置 `no-pop` 则会隐藏内部的 el-popover；`tipProps` 支持完整的 el-tooltip 配置

pop/tip

:::

## popover 用法

:::demo 组件内的el-popover主要是为了满足二次确认的场景，但是也支持完全自定义；`popProps` 支持完整的 el-popover 配置；popover中的操作按钮使用了 y-button，也就是默认支持防抖

pop/pop

:::

## API

### Attributes

| 属性名       | 说明                 | 类型                               | 默认值               |
| ------------ | -------------------- | ---------------------------------- | -------------------- |
| tipContent   | tooltip 显示的内容   | ^[string]                          | `''`                 |
| tipPlacement | tooltip 出现位置     | ^[enum]`PlacementType`             | `'top'`              |
| tipProps     | tooltip 完整属性配置 | ^[object]`Partial<ElTooltipProps>` | `{}`                 |
| noPop        | 是否禁用 popover     | ^[boolean]                         | `false`              |
| popTitle     | popover 标题         | ^[string] / ^[number]              | `'提示'`             |
| popContent   | popover 内容         | ^[string]                          | `'是否执行该操作？'` |
| popPlacement | popover 出现位置     | ^[enum]`PlacementType`             | `'bottom'`           |
| popWidth     | popover 宽度         | ^[number]                          | `226`                |
| popProps     | popover 完整属性配置 | ^[object]`Partial<PopoverProps>`   | `{}`                 |
| noFooter     | 是否隐藏底部操作区域 | ^[boolean]                         | `false`              |
| noConfirm    | 是否隐藏确认按钮     | ^[boolean]                         | `false`              |
| confirmText  | 确认按钮文本         | ^[string]                          | `'确认'`             |
| confirmProps | 确认按钮属性配置     | ^[object]`Partial<YButtonProps>`    | `{}`                 |
| noCancel     | 是否隐藏取消按钮     | ^[boolean]                         | `false`              |
| cancelText   | 取消按钮文本         | ^[string]                          | `'取消'`             |
| cancelProps  | 取消按钮属性配置     | ^[object]`Partial<YButtonProps>`    | `{}`                 |

### Slots

| 名称        | 说明                       | 参数 |
| ----------- | -------------------------- | ---- |
| default     | 默认插槽，通常放置触发元素 | —    |
| tip-content | el-tooltip 自定义内容      | —    |
| pop-content | el-popover 自定义内容      | —    |
| pop-footer  | el-popover 底部自定义内容  | —    |

### Events

| 事件名  | 说明               | 类型                    |
| ------- | ------------------ | ----------------------- |
| confirm | 点击确认按钮时触发 | ^[function]`() => void` |
| cancel  | 点击取消按钮时触发 | ^[function]`() => void` |

### Exposes

| 名称   | 说明                         | 类型                            |
| ------ | ---------------------------- | ------------------------------- | ----------- |
| tipRef | 组件内的 el-tooltip 组件实例 | ^[object]`Ref<ElTooltipInstance | undefined>` |
| popRef | 组件内的 el-popover 组件实例 | ^[object]`Ref<ElPopoverInstance | undefined>` |
