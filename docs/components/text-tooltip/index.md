---
title: TextTooltip
description: 文本溢出时以tooltip提示
---

# TextTooltip 提示文本

## 说明

基于 `el-tooltip` 封装，用于文本超宽时以 `tooltip` 提示的组件

（1）支持单行和多行文本显示

（2）为了避免tooltip 弹出框的内容过多超出视窗（很少见，但不是没有），组件中内置的 el-tooltip 指定了样式名 `.y-text-tooltip__popper`，全局样式中通过 `--y-tooltip-popper-max-width`、`--y-tooltip-popper-max-height`指定最大宽度和最大高度，内容过多时会显示滚动条，样式与 `el-scrollbar` 一致。需要注意，如果内容过多并且指定了最大尺寸，这时需要配置`tooltipProps` 中 `enterable:true`，否则无法查看完整的内容

## 用法示例

### 基础用法

:::demo

text-tooltip/test

:::

## API

### Attributes

| 属性名              | 说明                                                                                                         | 类型                                                                                                                                                                        | 默认值                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| line-clamp          | 展示最大行数                                                                                                 | ^[number]                                                                                                                                                                   | `1`                        |
| width               | 文本容器宽度                                                                                                 | ^[string] / ^[number]                                                                                                                                                       | `'100%'`                   |
| model               | tooltip显示方式                                                                                              | ^[enum]`'auto' \| 'none' \| 'always'`                                                                                                                                       | `'auto'`                   |
| text-style          | 自定义文本样式                                                                                               | ^[object]`Record<string, any>`                                                                                                                                              | `{}`                       |
| effect              | Tooltip 主题，内置了 dark / light 两种                                                                       | ^[enum]`'dark' \| 'light'`                                                                                                                                                  | `dark`                     |
| content             | 显示的内容，也可被 `slot#content` 覆盖，默认为文本内容                                                       | ^[string]                                                                                                                                                                   |                            |
| raw-content         | content 中的内容是否作为 HTML 字符串处理                                                                     | ^[boolean]                                                                                                                                                                  | `false`                    |
| placement           | Tooltip 组件出现的位置                                                                                       | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'`                    |
| fallback-placements | Tooltip 可用的 positions 请查看[popper.js](https://popper.js.org/docs/v2/modifiers/flip/#fallbackplacements) | ^[array]`Placement[]`                                                                                                                                                       | —                          |
| offset              | 出现位置的偏移量                                                                                             | ^[number]                                                                                                                                                                   | `12`                       |
| transition          | 动画名称                                                                                                     | ^[string]                                                                                                                                                                   | —                          |
| popper-options      | [popper.js](https://popper.js.org/docs/v2/) 参数                                                             | ^[object]                                                                                                                                                                   | `{}`                       |
| arrow-offset        | 控制Tooltip的箭头相对于弹出窗口的偏移(添加)。                                                                | ^[number]                                                                                                                                                                   | `5`                        |
| show-after          | 延迟显示时间（以毫秒为单位），在受控模式下无效。                                                             | ^[number]                                                                                                                                                                   | `50`                       |
| show-arrow          | tooltip 的内容是否有箭头                                                                                     | ^[boolean]                                                                                                                                                                  | `true`                     |
| hide-after          | 消失延迟时间（以毫秒为单位），在受控模式下无效。                                                             | ^[number]                                                                                                                                                                   | `50`                       |
| auto-close          | 隐藏提示框的超时时间（以毫秒为单位），在受控模式下无效。                                                     | ^[number]                                                                                                                                                                   | `0`                        |
| popper-class        | 为 Tooltip 的 popper 添加类名                                                                                | ^[string]                                                                                                                                                                   | `'y-text-tooltip__popper'` |
| popper-style        | 为 Tooltip 的 popper 添加自定义样式                                                                          | ^[string] / ^[object]                                                                                                                                                       | —                          |
| enterable           | 鼠标是否可进入到 tooltip 中                                                                                  | ^[boolean]                                                                                                                                                                  | `false`                    |
| teleported          | 是否使用 teleport。设置成 true则会被追加到 append-to 的位置                                                  | ^[boolean]                                                                                                                                                                  | `false`                    |
| trigger             | 提示框的触发方式（用于显示），在受控模式下无效。                                                             | ^[enum]`'hover' \| 'click' \| 'focus' \| 'contextmenu'` / ^[object]`Array<'click' \| 'focus' \| 'hover' \| 'contextmenu'>`                                                  | `'hover'`                  |
| persistent          | 当tooltip未激活且 persistent 为 false 时，tooltip将被销毁。                                                  | ^[boolean]                                                                                                                                                                  | `false`                    |
| aria-label          | 和 aria-label 属性保持一致                                                                                   | ^[string]                                                                                                                                                                   | —                          |
| focus-on-target     | 当通过悬停触发提示时，是否聚焦触发元素，以提升可访问性                                                       | ^[boolean]                                                                                                                                                                  | `false`                    |

### Slots

| 名称    | 说明                                       | 参数 |
| ------- | ------------------------------------------ | ---- |
| default | 默认插槽，用于放置文本内容                 | —    |
| content | tooltip内容插槽，用于自定义tooltip显示内容 | —    |

### Exposes

| 名称                 | 说明                                             | 类型                                                |
| -------------------- | ------------------------------------------------ | --------------------------------------------------- |
| popperRef            | el-popper 组件实例                               | ^[object]`Ref<PopperInstance \| undefined>`         |
| contentRef           | el-tooltip-content 组件实例                      | ^[object]`Ref<TooltipContentInstance \| undefined>` |
| isFocusInsideContent | 验证当前焦点事件是否在 el-tooltip-content 中触发 | ^[Function]`() => boolean \| undefined`             |
| updatePopper         | 更新 el-popper组件实例                           | ^[Function]`() => void`                             |
| onOpen               | onOpen 方法控制 el-tooltip 显示状态              | ^[Function]`(event?: Event \| undefined) => void`   |
| onClose              | onClose 方法控制 el-tooltip 显示状态             | ^[Function]`(event?: Event \| undefined) => void`   |
| hide                 | 提供 hide 方法                                   | ^[Function]`(event?: Event \| undefined) => void`   |
