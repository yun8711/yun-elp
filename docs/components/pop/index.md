---
title: Pop
description: 集成el-tooltip和el-popover的弹出框容器
---

# Pop 弹出框容器

基于 `el-tooltip` 和 `el-popover` 封装，可以用于复杂交互操作场景

（1）默认插槽可以放置任何内容，与基本组件可以完美配合使用

（2）支持 `el-tooltip` 和 `el-popover` 组件的完整配置

（3）popover弹出框默认使用 `y-button` 显示“取消”、“确定”按钮，也就是支持防抖、节流等特性

## 基础用法

:::demo

pop/basic

:::

## tooltip 用法

:::demo 默认情况下，只有配置了 `tipContent` 才会启用内部的 el-tooltip；`tipProps` 支持完整的 el-tooltip 配置

pop/tip

:::

## popover 用法

:::demo 组件内的el-popover主要是为了满足二次确认的场景，但是也支持完全自定义；设置 `no-pop` 则会隐藏内部的 el-popover；`popProps` 支持完整的 el-popover 配置；popover中的操作按钮使用了 y-button，也就是默认支持防抖

pop/pop

:::

## API

### Attributes

| 属性名        | 说明                                                                    | 类型                               | 默认值                                                                                       |
| ------------- | ----------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------- |
| tip-content   | tooltip 显示的内容                                                      | ^[string]                          | `''`                                                                                         |
| tip-placement | tooltip 出现位置                                                        | ^[enum]`PlacementType`             | `'top'`                                                                                      |
| tip-props     | [el-tooltip](https://element-plus.org/zh-CN/component/tooltip) 完整配置 | ^[object]`Partial<ElTooltipProps>` | `{placement:'top',effect: 'dark',popperClass: 'y-pop__tooltip',trigger: 'hover'}`            |
| no-pop        | 是否禁用 popover                                                        | ^[boolean]                         | `false`                                                                                      |
| pop-title     | popover 标题                                                            | ^[string] / ^[number]              | `'提示'`                                                                                     |
| pop-content   | popover 内容                                                            | ^[string]                          | `'是否执行该操作？'`                                                                         |
| pop-placement | popover 出现位置                                                        | ^[enum]`PlacementType`             | `'bottom'`                                                                                   |
| pop-width     | popover 宽度                                                            | ^[number]                          | `226`                                                                                        |
| pop-props     | [el-popover](https://element-plus.org/zh-CN/component/popover) 完整配置 | ^[object]`Partial<PopoverProps>`   | `{titel:'提示',placement:'bottom',width:226,popperClass: 'y-pop__popover',trigger: 'click'}` |
| no-footer     | 是否隐藏底部操作区域                                                    | ^[boolean]                         | `false`                                                                                      |
| no-confirm    | 是否隐藏确认按钮                                                        | ^[boolean]                         | `false`                                                                                      |
| confirm-text  | 确认按钮文本                                                            | ^[string]                          | `'确认'`                                                                                     |
| confirm-props | 确认按钮属性配置                                                        | ^[object]`Partial<YButtonProps>`   | `{type: 'primary',size: 'small',model: 'debounce'}`                                          |
| no-cancel     | 是否隐藏取消按钮                                                        | ^[boolean]                         | `false`                                                                                      |
| cancel-text   | 取消按钮文本                                                            | ^[string]                          | `'取消'`                                                                                     |
| cancel-props  | 取消按钮属性配置                                                        | ^[object]`Partial<YButtonProps>`   | `{type: 'default',size: 'small',model: 'debounce'}`                                          |

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

| 名称   | 说明                         | 类型                                           |
| ------ | ---------------------------- | ---------------------------------------------- |
| tipRef | 组件内的 el-tooltip 组件实例 | ^[object]`Ref<ElTooltipInstance \| undefined>` |
| popRef | 组件内的 el-popover 组件实例 | ^[object]`Ref<ElPopoverInstance \| undefined>` |
