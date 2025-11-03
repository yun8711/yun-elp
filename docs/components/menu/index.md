---
title: Menu 菜单
description: Menu 菜单
---

# Menu 菜单

基于el-menu 封装的菜单组件，主要增加了以下功能：

- 无限层级，配置简单、灵活
- 可自定义任意层级缩进
- 可自定义菜单文本及图标

注意：如果采用插槽方式自定义图标，勿必给它增加类名 `.y-menu-item__icon`

## 自定义缩进

:::demo 配置 `indent` 属性可以控制每个层级的缩进，它的值表示相对于上一级的缩进值。如果值为单个值，则会应用于每层级缩进值；如果值为数组，则表示具体每个层级的缩进值，如果某个层级未设置，则会使用第一层级的值。默认值为 20

menu/indent

:::

## 图标

:::demo 菜单图标的配置比较灵活，可以在配置项中配置图标组件、图片、svg图标、unocss图标等，也使用使用插槽来配置，`icon`插槽可以统一配置所有图标，`icon-[index]`可以精准配置某个菜单的图标

menu/icon

:::

## 插槽用法

:::demo 通过插槽可以自定义菜单项的内容，支持 `icon`、`label` 全局插槽，以及 `icon-{index}`、`label-{index}` 特定菜单项插槽

menu/slot

:::

## 菜单样式

y-menu在el-menu的css变量基础上扩展了一些css变量，详见[CSS Variables](#css-variables)

## API

### Attributes

继承 el-menu 的所有属性

| 属性名 | 说明                                                                                 | 类型                           | 默认值 |
| ------ | ------------------------------------------------------------------------------------ | ------------------------------ | ------ |
| data   | 菜单数据，必填                                                                       | `MenuItem[]`                   | —      |
| indent | 层级缩进距离(px)，数字表示所有层级相同，数组表示各层级不同，相对于顶级菜单的缩进距离 | ^[number] / ^[array]`number[]` | `20`   |

### MenuItem

| 属性名        | 说明         | 类型                                                                                                   | 默认值  |
| ------------- | ------------ | ------------------------------------------------------------------------------------------------------ | ------- |
| index         | 菜单唯一标识 | ^[string]                                                                                              | —       |
| route         | 路由地址     | ^[string] / ^[object]                                                                                  | —       |
| label         | 菜单显示文本 | ^[string]                                                                                              | —       |
| disabled      | 是否禁用     | ^[boolean]                                                                                             | `false` |
| icon          | 图标配置     | ^[object]`Component` / ^[function]`(params: RenderIconParams) => VNode \| Component \| string \| null` | —       |
| children      | 子菜单       | `MenuItem[]`                                                                                           | —       |
| [key: string] | 其他扩展属性 | ^[any]                                                                                                 | —       |

### RenderIconParams

| 属性名 | 说明       | 类型                | 默认值 |
| ------ | ---------- | ------------------- | ------ |
| item   | 当前菜单项 | ^[object]`MenuItem` | —      |
| level  | 当前层级   | ^[number]           | —      |

### Slots

| 名称          | 说明                                             | 参数                                         |
| ------------- | ------------------------------------------------ | -------------------------------------------- |
| icon          | 自定义所有菜单项的图标                           | ^[object]`{ item: MenuItem, level: number }` |
| label         | 自定义所有菜单项的文本                           | ^[object]`{ item: MenuItem, level: number }` |
| icon-[index]  | 自定义特定菜单项的图标，[index]为菜单项的index值 | ^[object]`{ item: MenuItem, level: number }` |
| label-[index] | 自定义特定菜单项的文本，[index]为菜单项的index值 | ^[object]`{ item: MenuItem, level: number }` |

### Events

继承el-menu的所有事件

### Exposes

暴露 el-menu 实例的所有方法和属性

### CSS Variables

| 变量名                        | 说明                                             | 默认值                        |
| ----------------------------- | ------------------------------------------------ | ----------------------------- |
| --y-menu-icon-margin-right    | 图标右边距                                       | `5px`                         |
| --y-menu-icon-size            | 图标尺寸，影响宽度、高度、line-height、font-size | `16px`                        |
| --y-menu-icon-color           | 图标默认颜色                                     | `var(--el-menu-text-color)`   |
| --y-menu-icon-active-color    | 菜单激活时的图标颜色                             | `var(--el-menu-active-color)` |
| --y-menu-item-active-bg-color | el-item 菜单激活时背景色                         | —                             |
| --y-menu-sub-active-bg-color  | 子菜单激活时el-subitem 的 title 的背景色         | —                             |
| --y-menu-collapse-width       | 菜单收起时的宽度                                 | —                             |
