---
title: Sidebar
description: 可折叠的侧边菜单
---

# Sidebar 侧边菜单

## 说明

基于 `el-menu` 封装的垂直侧边菜单，行为保持一致，并扩展了更多功能；支持树形数据、展开/折叠/隐藏三种宽度。

（1）`menuList` 的 `icon` 支持 CSS 类名或 Vue 组件；也可用 `icon` 插槽完全自定义

（2）点击菜单仅触发 `select`（`index` 为菜单项索引：`prop` 未设置时为 `path`，第二参数为对应 `SidebarMenuItem`）；路由跳转等由业务在 `@select` 中自行处理。内部 `el-menu` 的 `router` 固定为 `false`，`menu-props.router` 不会生效，避免与业务侧跳转重复

（3）组件高度继承父容器，请为父级设置明确高度

## 与路由 / 布局集成

- **高亮**：仅用 `active-menu` 控制当前项（对应菜单 index：`prop ?? path`）。建议与路由同步，例如 `const activeMenu = computed(() => resolveMenuIndex(route))`，不要只在 `onMounted` 或仅在 `@select` 里赋值，否则 `router.push`、浏览器前进/后退时高亮会滞后。
- **跳转**：业务层在 `@select` 事件中根据 `index` / `item.path` 自行 `router.push` 或打开外链；组件不内置路由。
- **异步菜单**：`menuList` 晚于首屏到达时，请保证 `active-menu` 的 index 在树中存在；必要时在数据就绪后再渲染侧栏，或对 `el-menu` 使用 `:key` 触发重建（仅在遇到展开/高亮异常时使用）。
- **初始展开**：`menu-props.default-openeds` 只影响子菜单初始展开；激活项父级是否展开仍由 `el-menu` 根据 `active-menu` 在挂载后处理。二者职责不同，勿混用。
- **开发校验**：开发环境下同级 `index` 重复会在控制台告警，请为冲突项设置唯一 `prop`。

## 用法示例

### 基础用法

:::demo 传入树形 `menuList`，用 `active-menu` 标记当前项；`#header` 为顶部插槽； `show-footer` 控制是否显示默认底部，`#footer` 可以自定义底部；

sidebar/test

:::

### 显示 / 折叠 / 隐藏

:::demo `collapsed` 与 `visible` 对应展开、折叠、隐藏三种宽度；底部折叠条默认不显示；`show-footer` 开启后交互与样式与内置一致，也可用 `footer` 插槽自定义

sidebar/status

:::

### 层级缩进

:::demo 默认情况下，子级菜单会与上级菜单图标与文本自动对齐；`indent` 为一级菜单缩进，它是各级菜单缩进的基础，未设置时子级菜单会在上级菜单的基础上按`indent` 增加缩进；通过`indent-map`可对各级缩进进行配置；也可以通过菜单项的 `indent` 进行配置。

sidebar/indent

:::

### 角标与标题附加

:::demo 角标基于 `el-badge`实现，绑定在图标上，折叠后仍可保留；通过 `extra` / `#extra` 可在在标题末尾添加自定义内容，折叠时隐藏；`extra-style` 控制 extra 区域样式

sidebar/badge

:::

### 标题 Tooltip

:::demo `title-prop` 配置标题省略与溢出提示，基于 [Text Tooltip](/components/text-tooltip/)；折叠时内置将 `model` 置为 `none`，避免与 `el-menu` 折叠提示重复

sidebar/title

:::

### 颜色

:::demo 通过 CSS 变量控制背景、文字、激活、悬停与边框色

sidebar/color

:::

## API

### Attributes

| 属性名              | 说明                                                                                                                                       | 类型                                   | 默认值                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | --------------------------------------- |
| menu-list           | 菜单数据                                                                                                                                   | ^[object]`SidebarMenuItem[]`           | `[]`                                    |
| active-menu         | 当前激活项（菜单 index：`prop` 未设时为 `path`），唯一控制高亮；同步到 `el-menu` 的 `default-active`，**覆盖** `menu-props.default-active` | ^[string]                              | `''`                                    |
| collapsed           | 是否折叠，支持 `v-model:collapsed`                                                                                                         | ^[boolean]                             | `false`                                 |
| visible             | 是否可见，支持 `v-model:visible`                                                                                                           | ^[boolean]                             | `true`                                  |
| width-map           | 展开 / 折叠 / 隐藏宽度，单位 px                                                                                                            | ^[object]`SidebarWidthMap`             | `{ default: 184, fold: 54, hidden: 0 }` |
| indent              | 一级基础缩进（px）                                                                                                                         | ^[number]                              | `16`                                    |
| indent-map          | 按层级覆盖自动缩进                                                                                                                         | ^[object]`Record<number, number>`      | `{}`                                    |
| icon-max-width      | 图标最大宽度（px）                                                                                                                         | ^[number]                              | `16`                                    |
| icon-gap            | 图标与文本间距（px）                                                                                                                       | ^[number]                              | `8`                                     |
| item-height         | 菜单项高度（px）                                                                                                                           | ^[number]                              | `50`                                    |
| unique-opened       | 是否只保持一个子菜单展开                                                                                                                   | ^[boolean]                             | `false`                                 |
| collapse-transition | 是否开启折叠动画                                                                                                                           | ^[boolean]                             | `false`                                 |
| show-footer         | 是否显示底部折叠条                                                                                                                         | ^[boolean]                             | `false`                                 |
| extra-style         | extra 区域默认样式，可被 `menuList[].extraStyle` 覆盖                                                                                      | ^[object]`CSSProperties`               | `{}`                                    |
| title-prop          | 菜单项标题 `YTextTooltip` 配置，见 [Text Tooltip](/components/text-tooltip/)                                                               | ^[object]`Partial<SidebarTitleConfig>` | 见下方默认                              |
| menu-props          | 透传给 `el-menu`（不含 `router`、`default-active`；高亮用 `active-menu`，跳转用 `@select`）                                                | ^[object]`SidebarMenuProps`            | `{}`                                    |

`title-prop` 默认等价于：`enabled: true`、`lineClamp: 1`、`width: '100%'`、`model: 'auto'`、`placement: 'right'`、`showAfter: 300`（其余 `YTextTooltip` / `el-tooltip` 项未设则由组件或 `YAppWrap.textTooltip` 决定）

### SidebarMenuItem

| 属性名     | 说明                                                                    | 类型                                                               | 默认值 |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| path       | 路由或业务路径                                                          | ^[string]                                                          | —      |
| prop       | 菜单唯一索引，未设时等同 `path`                                         | ^[string]                                                          | —      |
| title      | 标题                                                                    | ^[string]                                                          | —      |
| extra      | 标题文本末尾附加文案（LTR 右侧 / RTL 左侧）；有 `#extra` 时以插槽为准   | ^[string]                                                          | —      |
| extraStyle | 该项 extra 区域样式，覆盖组件 `extra-style`                             | ^[object]`CSSProperties`                                           | —      |
| icon       | 图标，CSS 类名或组件                                                    | ^[string] / ^[Component]                                           | —      |
| badge      | 图标角标。`true` 为圆点；字符串/数字为内容；对象见 `SidebarBadgeConfig` | ^[boolean] / ^[string] / ^[number] / ^[object]`SidebarBadgeConfig` | —      |
| indent     | 该项缩进（px），优先于自动计算与 indent-map                             | ^[number]                                                          | —      |
| disabled   | 是否禁用                                                                | ^[boolean]                                                         | —      |
| children   | 子菜单                                                                  | ^[object]`SidebarMenuItem[]`                                       | —      |

### SidebarBadgeConfig

除 `placement` 外透传 [`el-badge`](https://element-plus.org/zh-CN/component/badge#attributes)。

| 属性名     | 说明                                                 | 类型                                                               | 默认值     |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| value      | 显示值                                               | ^[string] / ^[number]                                              | `''`       |
| max        | 最大值，超过后显示 `{max}+`，仅 `value` 为数字时生效 | ^[number]                                                          | `99`       |
| isDot      | 是否显示小圆点                                       | ^[boolean]                                                         | `false`    |
| hidden     | 是否隐藏                                             | ^[boolean]                                                         | `false`    |
| type       | 类型                                                 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` |
| showZero   | `value` 为 `0` 时是否显示                            | ^[boolean]                                                         | `true`     |
| color      | 背景色                                               | ^[string]                                                          | —          |
| offset     | 偏移，`[left, top]`                                  | ^[array]`[number, number]`                                         | `[0, 0]`   |
| badgeStyle | 自定义样式                                           | ^[object]`CSSProperties`                                           | —          |
| badgeClass | 自定义类名                                           | ^[string]                                                          | —          |
| placement  | 相对图标的左右位置；RTL 下自动对调                   | ^[enum]`'left' \| 'right'`                                         | `'right'`  |

### Slots

| 名称   | 说明                                              | 参数                                                |
| ------ | ------------------------------------------------- | --------------------------------------------------- |
| header | 顶部区域                                          | —                                                   |
| footer | 底部折叠区，传入后即使未开 `show-footer` 也会显示 | ^[object]`{ collapsed: boolean }`                   |
| icon   | 菜单图标                                          | ^[object]`{ item: SidebarMenuItem, level: number }` |
| title  | 菜单标题                                          | ^[object]`{ item: SidebarMenuItem, level: number }` |
| extra  | 标题文本末尾，优先于 `item.extra`                 | ^[object]`{ item: SidebarMenuItem, level: number }` |

### Events

| 事件名           | 说明         | 类型                                                         |
| ---------------- | ------------ | ------------------------------------------------------------ |
| update:collapsed | 折叠状态变化 | ^[function]`(value: boolean) => void`                        |
| update:visible   | 显隐状态变化 | ^[function]`(value: boolean) => void`                        |
| select           | 选中菜单项   | ^[function]`(index: string, item?: SidebarMenuItem) => void` |

### Exposes

| 名称     | 说明     | 类型                    |
| -------- | -------- | ----------------------- |
| toggle   | 切换折叠 | ^[function]`() => void` |
| collapse | 折叠     | ^[function]`() => void` |
| expand   | 展开     | ^[function]`() => void` |
| hide     | 隐藏     | ^[function]`() => void` |
| show     | 显示     | ^[function]`() => void` |

### CSS Variables

| 变量名                     | 说明           | 默认值                       |
| -------------------------- | -------------- | ---------------------------- |
| --y-sidebar-border         | 边框颜色       | `--el-border-color-light`    |
| --y-sidebar-hover          | 菜单项悬停背景 | `rgb(255 255 255 / 6%)`      |
| --y-sidebar-icon-max-width | 图标最大宽度   | `16px`                       |
| --y-sidebar-icon-gap       | 图标与文本间距 | `8px`                        |
| --y-sidebar-item-height    | 菜单项高度     | `50px`                       |
| --y-sidebar-footer-height  | 内置底部高度   | `56px`                       |
| --el-menu-bg-color         | 菜单背景       | `--el-fill-color-blank`      |
| --el-menu-text-color       | 菜单文字       | `--el-text-color-primary`    |
| --el-menu-hover-text-color | 菜单悬停文字   | `--el-color-primary`         |
| --el-menu-active-color     | 菜单激活文字   | `--el-color-primary`         |
| --el-menu-hover-bg-color   | 菜单悬停背景   | `--el-color-primary-light-9` |
| --el-menu-border-color     | 菜单边框       | `--el-border-color`          |
