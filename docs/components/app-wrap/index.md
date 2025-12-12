---
title: AppWrap
description: 向后代组件传递全局配置
---

# AppWrap 应用容器

## 说明

AppWrap是一个应用容器，一般用在应用最外层，主要作用是：

（1）向内部的后代组件（`element-plus` 及 `yun-elp`）传递默认配置，方便设置组件属性的默认值，简化配置

（2）设置 `yun-elp` 及 `element-plus` 组件库的语言选项

注意：

向后代组件传递的配置参数只是为了从全局角度简化组件的配置和使用，所以它的优先级最低

## API

### Attributes

| 属性名          | 说明                                                                                | 类型                                | 默认值  |
| --------------- | ----------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| elpConfig       | [el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) | ^[object]`ElConfigProviderProps`    | —       |
| locale          | yun-elp的语言配置                                                                   | ^[enum]`'zh-cn' \| 'en'`            | `zh-cn` |
| borderLabel     | y-border-label组件全局配置，[见下表](#border-label-attribute)                       | ^[object]`Ref<record<string, any>>` | —       |
| pageHeader      | y-page-header组件全局配置，[见下表](#page-header-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| pageFooter      | y-page-footer组件全局配置，[见下表](#page-footer-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| button          | y-button组件全局配置，[见下表](#button-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| drawer          | y-drawer组件全局配置，[见下表](#drawer-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| dialog          | y-dialog组件全局配置，[见下表](#dialog-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| empty           | y-empty组件全局配置，[见下表](#empty-attribute)                                     | ^[object]`Ref<record<string, any>>` | —       |
| textTooltip     | y-text-tooltip组件全局配置，[见下表](#desc-attribute)                               | ^[object]`Ref<record<string, any>>` | —       |
| desc            | y-desc组件全局配置，[见下表](#desc-attribute)                                       | ^[object]`Ref<record<string, any>>` | —       |
| table           | y-table组件全局配置，[见下表](#table-attribute)                                     | ^[object]`Ref<record<string, any>>` | —       |
| columnForm      | y-column-form、y-column-forms 组件全局配置，[见下表](#column-form-attribute)        | ^[object]`Ref<record<string, any>>` | —       |
| columnOp | y-column-op 组件全局配置，[见下表](#column-op-attribute)              | ^[object]`Ref<record<string, any>>` | —       |
| echarts         | y-echarts 组件全局配置，[见下表](#echarts-attribute)                                | ^[object]`Ref<record<string, any>>` | —       |

#### border-label Attribute

| 参数   | 描述       | 类型      | 默认值 |
| ------ | ---------- | --------- | ------ |
| width  | 组件总宽度 | ^[string] | `'auto'`   |
| height | 组件高度   | ^[string] | `'32px'`   |

#### page-header Attribute

| 参数           | 描述                              | 类型                                   | 默认值 |
| -------------- | --------------------------------- | -------------------------------------- | ------ |
| height         | 组件高度                          | ^[string]                              | —      |
| titlePath      | 从路径元数据中获取title的取值路径 | ^[string]                              | —      |
| border         | 组件默认是否显示下边框            | ^[boolean]                             | —      |
| paddingX       | 组件水平内边距                    | ^[string] / ^[array]`[string, string]` | —      |
| titleTextStyle | 组件文本样式                      | ^[object]`CSSProperties`               | —      |

#### page-footer Attribute

| 参数   | 描述                          | 类型                  | 默认值   |
| ------ | ----------------------------- | --------------------- | -------- |
| height | 组件高度，有效的css尺寸值     | ^[string] / ^[number] | `'56px'` |
| left   | 组件左侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |
| right  | 组件右侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |

#### button Attribute

继承 [el-button 的全部属性](https://element-plus.org/zh-CN/component/button.html#button-attributes) ，另外包含以下属性

| 参数    | 描述                 | 类型                  | 默认值      |
| ------- | -------------------- | --------------------- | ----------- |
| delay   | 防抖间隔时间，单位ms | ^[string] / ^[number] | `300`       |
| maxWait | 最大等待时间，单位ms | ^[string] / ^[number] | — |

#### drawer Attribute

继承 [el-drawer 的全部属性](https://element-plus.org/zh-CN/component/drawer.html#%E5%B1%9E%E6%80%A7) ，另外包含以下属性

| 参数         | 描述                   | 类型                     | 默认值             |
| ------------ | ---------------------- | ------------------------ | ------------------ |
| confirmText  | 确认按钮文本           | ^[string]                | `'确定'`           |
| confirmProps | 确认按钮属性           | ^[object]`YButtonProps`  | `{type:'primary'}` |
| cancelText   | 取消按钮文本           | ^[string]                | `'取消'`           |
| cancelProps  | 取消按钮属性           | ^[object]`YButtonProps`  | `{type:'default'}` |
| titleStyle   | 组件默认是否显示下边框 | ^[object]`CSSProperties` | —                  |

#### dialog Attribute

继承 [el-dialog 的全部属性](https://element-plus.org/zh-CN/component/dialog.html#attributes) ，另外包含以下属性

| 参数         | 描述         | 类型                     | 默认值             |
| ------------ | ------------ | ------------------------ | ------------------ |
| confirmText  | 确认按钮文本 | ^[string]                | `'确定'`           |
| confirmProps | 确认按钮属性 | ^[object]`YButtonProps`  | `{type:'primary'}` |
| cancelText   | 取消按钮文本 | ^[string]                | `'取消'`           |
| cancelProps  | 取消按钮属性 | ^[object]`YButtonProps`  | `{type:'default'}` |
| titleStyle   | 标题文本样式 | ^[object]`CSSProperties` | —                  |

#### empty Attribute

继承 [el-empty 的全部属性](https://element-plus.org/zh-CN/component/empty.html#attributes) ，另外包含以下属性

| 参数        | 描述                                | 类型                     | 默认值       |
| ----------- | ----------------------------------- | ------------------------ | ------------ |
| style       | 组件样式，包括el-empty支持的css变量 | ^[object]`CSSProperties` | —            |
| image       | 自定义图片                          | ^[string]                | —            |
| imageSize   | 自定义图片大小                      | ^[number]                | `100`        |
| description | 自定义描述                          | ^[string]                | `'暂无数据'` |

#### text-tooltip Attribute

| 参数         | 描述                                                                                                | 类型                                                                                                                                                                        | 默认值  |
| ------------ | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| placement    | tooltip显示位置                                                                                     | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| tooltipProps | tooltip配置属性，详见[el-tooltip](https://element-plus.org/zh-CN/component/tooltip.html#attributes) | ^[object]`Partial<ElTooltipProps>`                                                                                                                                          | `{}`    |

#### desc Attribute

| 参数         | 描述                         | 类型                                   | 默认值   |
| ------------ | ---------------------------- | -------------------------------------- | -------- |
| labelWidth   | label 宽度                   | ^[string] / ^[number]                  | `'auto'` |
| labelStyle   | label 样式                   | ^[object]`CSSProperties`               | —        |
| contentStyle | content 样式                 | ^[object]`CSSProperties`               | —        |
| labelAlign   | label 文本对齐方式           | ^[enum]`'left' \| 'center' \| 'right'` | `'left'` |
| contentAlign | content 文本对齐方式         | ^[enum]`'left' \| 'center' \| 'right'` | `'left'` |
| emptyText    | content 内容为空时显示的内容 | ^[string]                              | `''`     |

#### table Attribute

| 参数            | 描述                  | 类型                         | 默认值   |
| --------------- | --------------------- | ---------------------------- | -------- |
| emptyProps      | 空数据时 y-empty 配置 | ^[object]`YEmptyProps`       | `'auto'` |
| paginationProps | label 样式            | ^[object]`ElPaginationProps` | `{}`     |

#### columnForm Attribute

| 参数        | 描述                           | 类型                                                                                                                                                                        | 默认值                           |
| ----------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| placement   | 错误提示tooltip弹出位置        | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'auto'`                         |
| popperClass | 错误提示tooltip 的 popper 类名 | ^[string]                                                                                                                                                                   | `'y-column-form__error-tooltip'` |

#### columnOperation Attribute

| 参数               | 描述                                | 类型      | 默认值 |
| ------------------ | ----------------------------------- | --------- | ------ |
| disabledDefaultTip | 按钮禁用状态时默认的tooltip提示文本 | ^[string] | —      |

#### echarts Attribute

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
