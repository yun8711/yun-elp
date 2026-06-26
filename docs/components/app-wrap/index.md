---
title: AppWrap
description: 向后代组件传递全局配置
---

# AppWrap 应用容器

## 说明

AppWrap 是一个应用容器，一般用在应用最外层，主要作用是：

（1）向内部的后代组件（`element-plus` 及 `yun-elp`）传递默认配置，方便设置组件属性的默认值，简化配置

（2）设置 `yun-elp` 及 `element-plus` 组件库的语言选项：只需配置 `locale`，即可同步切换 `y-app-wrap` 内部的 yun-elp 与 Element Plus 文案（详见 [语言配置](#语言配置-locale)）

注意：

向后代组件传递的配置参数只是为了从全局角度简化组件的配置和使用，所以它的优先级最低

## 语言配置（locale）

`locale` 用于指定 `y-app-wrap` 子树内的语言。配置为 `'zh-cn'`、`'en'`、`'ja'`、`'ar'` 之一时：

1. **yun-elp** 组件使用对应语言包（如 `y-pop` 确认文案、`y-table` 底部合计）
2. **Element Plus** 组件使用对应语言包（如 `el-pagination` 的「前往 / 条/页」、`el-date-picker` 文案）

未传 `locale` 时默认为 `'zh-cn'`，上述两类组件均显示简体中文。

`y-app-wrap` 内部已封装 `el-config-provider`。当 **未** 在 `elpConfig` 中设置 `locale` 时，会按 `locale` 自动注入 Element Plus 语言包，无需在业务里再维护一份 `elLocaleMap`。

```vue
<template>
  <y-app-wrap locale="zh-cn">
    <router-view />
  </y-app-wrap>
</template>
```

切换语言时只改 `locale` 即可：

```vue
<y-app-wrap :locale="currentLocale">
  <router-view />
</y-app-wrap>
```

### 限制与覆盖

- **语言码**：必须是 `'zh-cn' | 'en' | 'ja' | 'ar'`，不支持 `'zh-CN'`、`'fr'` 等任意字符串
- **作用范围**：仅对 `y-app-wrap` **内部** 的 `y-*` 与 `el-*` 生效；外部的 Element Plus 组件需自行配置 `el-config-provider` 的 `locale`
- **单独指定 EP 语言**：传入 `elpConfig.locale` 后，不再按 `locale` 自动映射，以 `elpConfig.locale` 为准

```vue
<script setup lang="ts">
import en from 'element-plus/dist/locale/en.mjs';
</script>

<template>
  <!-- yun-elp 仍为 zh-cn，EP 强制为英文 -->
  <y-app-wrap locale="zh-cn" :elp-config="{ locale: en }">
    <router-view />
  </y-app-wrap>
</template>
```

排版方向（RTL）由 `direction` 控制，与 `locale` 独立；详见 [国际化](/guide/i18n#排版方向-rtl)。

## API

### Attributes

| 属性名      | 说明                                                                                                          | 类型                                     | 默认值  |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------- |
| elpConfig   | [el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html)                           | ^[object]`ElConfigProviderProps`         | —       |
| locale      | 语言配置；同步 `y-app-wrap` 内 yun-elp 与 Element Plus 文案（未设置 `elpConfig.locale` 时自动映射 EP 语言包） | ^[enum]`'zh-cn' \| 'en' \| 'ja' \| 'ar'` | `zh-cn` |
| direction   | 排版方向；`auto` 时阿拉伯语自动 RTL                                                                           | ^[enum]`'ltr' \| 'rtl' \| 'auto'`        | `auto`  |
| borderLabel | y-border-label 组件全局配置，[见下表](#border-label-properties)                                               | ^[object]                                | —       |
| pageHeader  | y-page-header 组件全局配置，[见下表](#page-header-properties)                                                 | ^[object]                                | —       |
| pageFooter  | y-page-footer 组件全局配置，[见下表](#page-footer-properties)                                                 | ^[object]                                | —       |
| button      | y-button 组件全局配置，[见下表](#button-properties)                                                           | ^[object]                                | —       |
| drawer      | y-drawer 组件全局配置，[见下表](#drawer-properties)                                                           | ^[object]                                | —       |
| dialog      | y-dialog 组件全局配置，[见下表](#dialog-properties)                                                           | ^[object]                                | —       |
| empty       | y-empty 组件全局配置，[见下表](#empty-properties)                                                             | ^[object]                                | —       |
| textTooltip | y-text-tooltip 组件全局配置，[见下表](#text-tooltip-properties)                                               | ^[object]                                | —       |
| desc        | y-desc 组件全局配置，[见下表](#desc-properties)                                                               | ^[object]                                | —       |
| pop         | y-pop 组件全局配置，[见下表](#pop-properties)                                                                 | ^[object]                                | —       |
| table       | y-table 组件全局配置，[见下表](#table-properties)                                                             | ^[object]                                | —       |
| columnForm  | y-column-form、y-column-forms 组件全局配置，[见下表](#column-form-properties)                                 | ^[object]                                | —       |
| columnOp    | y-column-op 组件全局配置，[见下表](#column-op-properties)                                                     | ^[object]                                | —       |
| echarts     | y-echarts 组件全局配置，[见下表](#echarts-properties)                                                         | ^[object]                                | —       |

#### border-label Properties

| 参数   | 描述       | 类型      | 默认值   |
| ------ | ---------- | --------- | -------- |
| width  | 组件总宽度 | ^[string] | `'auto'` |
| height | 组件高度   | ^[string] | `'32px'` |

#### page-header Properties

| 参数      | 描述                              | 类型                                   | 默认值 |
| --------- | --------------------------------- | -------------------------------------- | ------ |
| height    | 组件高度                          | ^[string]                              | —      |
| titlePath | 从路径元数据中获取title的取值路径 | ^[string]                              | —      |
| border    | 组件默认是否显示下边框            | ^[boolean]                             | —      |
| paddingX  | 组件水平内边距                    | ^[string] / ^[array]`[string, string]` | —      |
| textStyle | 标题文本样式                      | ^[object]`CSSProperties`               | —      |

#### page-footer Properties

| 参数   | 描述                          | 类型                  | 默认值   |
| ------ | ----------------------------- | --------------------- | -------- |
| height | 组件高度，有效的css尺寸值     | ^[string] / ^[number] | `'56px'` |
| left   | 组件左侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |
| right  | 组件右侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |

#### button Properties

继承 [el-button 的全部属性](https://element-plus.org/zh-CN/component/button.html#button-attributes) ，另外包含以下属性

| 参数    | 描述                 | 类型                  | 默认值 |
| ------- | -------------------- | --------------------- | ------ |
| delay   | 防抖间隔时间，单位ms | ^[string] / ^[number] | `300`  |
| maxWait | 最大等待时间，单位ms | ^[string] / ^[number] | —      |

#### drawer Properties

继承 [el-drawer 的全部属性](https://element-plus.org/zh-CN/component/drawer.html#%E5%B1%9E%E6%80%A7) ，另外包含以下属性

| 参数         | 描述         | 类型                     | 默认值             |
| ------------ | ------------ | ------------------------ | ------------------ |
| confirmText  | 确认按钮文本 | ^[string]                | `'确定'`           |
| confirmProps | 确认按钮属性 | ^[object]`YButtonProps`  | `{type:'primary'}` |
| cancelText   | 取消按钮文本 | ^[string]                | `'取消'`           |
| cancelProps  | 取消按钮属性 | ^[object]`YButtonProps`  | `{type:'default'}` |
| titleStyle   | 标题文本样式 | ^[object]`CSSProperties` | —                  |

#### dialog Properties

继承 [el-dialog 的全部属性](https://element-plus.org/zh-CN/component/dialog.html#attributes) ，另外包含以下属性

| 参数         | 描述         | 类型                     | 默认值             |
| ------------ | ------------ | ------------------------ | ------------------ |
| confirmText  | 确认按钮文本 | ^[string]                | `'确定'`           |
| confirmProps | 确认按钮属性 | ^[object]`YButtonProps`  | `{type:'primary'}` |
| cancelText   | 取消按钮文本 | ^[string]                | `'取消'`           |
| cancelProps  | 取消按钮属性 | ^[object]`YButtonProps`  | `{type:'default'}` |
| titleStyle   | 标题文本样式 | ^[object]`CSSProperties` | —                  |

#### empty Properties

继承 [el-empty 的全部属性](https://element-plus.org/zh-CN/component/empty.html#attributes) ，另外包含以下属性

| 参数        | 描述                                | 类型                     | 默认值       |
| ----------- | ----------------------------------- | ------------------------ | ------------ |
| style       | 组件样式，包括el-empty支持的css变量 | ^[object]`CSSProperties` | —            |
| image       | 自定义图片                          | ^[string]                | —            |
| imageSize   | 自定义图片大小                      | ^[number]                | `100`        |
| description | 自定义描述                          | ^[string]                | `'暂无数据'` |

#### text-tooltip Properties

| 参数         | 描述                                                                                                | 类型                                                                                                                                                                        | 默认值  |
| ------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| placement    | tooltip显示位置                                                                                     | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| tooltipProps | tooltip配置属性，详见[el-tooltip](https://element-plus.org/zh-CN/component/tooltip.html#attributes) | ^[object]`Partial<ElTooltipProps>`                                                                                                                                          | `{}`    |

#### desc Properties

| 参数         | 描述                         | 类型                                   | 默认值   |
| ------------ | ---------------------------- | -------------------------------------- | -------- |
| labelWidth   | label 宽度                   | ^[string] / ^[number]                  | `'auto'` |
| labelStyle   | label 样式                   | ^[object]`CSSProperties`               | —        |
| contentStyle | content 样式                 | ^[object]`CSSProperties`               | —        |
| labelAlign   | label 文本对齐方式           | ^[enum]`'left' \| 'center' \| 'right'` | `'left'` |
| contentAlign | content 文本对齐方式         | ^[enum]`'left' \| 'center' \| 'right'` | `'left'` |
| emptyText    | content 内容为空时显示的内容 | ^[string]                              | `''`     |

#### pop Properties

| 参数         | 描述                                                                                                  | 类型                                                                                                                                                                        | 默认值 |
| ------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| confirmText  | 确认按钮文本                                                                                          | ^[string]                                                                                                                                                                   | —      |
| confirmProps | 确认按钮属性                                                                                          | ^[object]`YButtonProps`                                                                                                                                                     | —      |
| cancelText   | 取消按钮文本                                                                                          | ^[string]                                                                                                                                                                   | —      |
| cancelProps  | 取消按钮属性                                                                                          | ^[object]`YButtonProps`                                                                                                                                                     | —      |
| tipPlacement | tooltip 显示位置                                                                                      | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | —      |
| tipProps     | tooltip 配置属性，详见 [el-tooltip](https://element-plus.org/zh-CN/component/tooltip.html#attributes) | ^[object]`Partial<ElTooltipProps>`                                                                                                                                          | —      |
| popWidth     | popover 宽度                                                                                          | ^[number]                                                                                                                                                                   | —      |
| popTitle     | popover 标题                                                                                          | ^[string]                                                                                                                                                                   | —      |
| popPlacement | popover 显示位置                                                                                      | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | —      |
| popContent   | popover 内容                                                                                          | ^[string]                                                                                                                                                                   | —      |
| popProps     | popover 配置属性，详见 [el-popover](https://element-plus.org/zh-CN/component/popover.html#attributes) | ^[object]`Partial<PopoverProps>`                                                                                                                                            | —      |

#### table Properties

| 参数            | 描述                  | 类型                         | 默认值   |
| --------------- | --------------------- | ---------------------------- | -------- |
| emptyProps      | 空数据时 y-empty 配置 | ^[object]`YEmptyProps`       | `'auto'` |
| paginationProps | 分页配置              | ^[object]`ElPaginationProps` | `{}`     |

#### column-form Properties

| 参数        | 描述                           | 类型                                                                                                                                                                        | 默认值                           |
| ----------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| placement   | 错误提示tooltip弹出位置        | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'auto'`                         |
| popperClass | 错误提示tooltip 的 popper 类名 | ^[string]                                                                                                                                                                   | `'y-column-form__error-tooltip'` |

#### column-op Properties

| 参数               | 描述                                | 类型      | 默认值 |
| ------------------ | ----------------------------------- | --------- | ------ |
| disabledDefaultTip | 按钮禁用状态时默认的tooltip提示文本 | ^[string] | —      |

#### echarts Properties

| 参数       | 描述                                                                                        | 类型                  | 默认值               |
| ---------- | ------------------------------------------------------------------------------------------- | --------------------- | -------------------- |
| theme      | 图表主题，参见[ECharts 中的样式简介](https://echarts.apache.org/handbook/zh/concepts/style) | ^[string] / ^[object] | —                    |
| chartTypes | 需要动态导入的图表类型，如 `['LineChart', 'BarChart']`                                      | ^[array]`string[]`    | `[]`                 |
| components | 需要动态导入的组件类型，如 `['GridComponent', 'TooltipComponent']`                          | ^[array]`string[]`    | `[]`                 |
| renderers  | 需要动态导入的渲染器类型，如 `['CanvasRenderer']`                                           | ^[array]`string[]`    | `['CanvasRenderer']` |
| features   | 需要动态导入的特性功能，如 `['LabelLayout', 'UniversalTransition']`                         | ^[array]`string[]`    | `[]`                 |
| initOpts   | 初始化参数，参见[echarts init](https://echarts.apache.org/zh/api.html#echarts.init)         | ^[object]             | `{}`                 |

### Slots

| 插槽名  | 说明                   | 参数 |
| ------- | ---------------------- | ---- |
| default | 默认插槽，用于放置内容 | —    |
