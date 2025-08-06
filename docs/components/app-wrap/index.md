---
title: AppWrap 应用容器
description: 用于向子组件传递全局配置
---

# AppWrap 应用容器

AppWrap是一个应用容器，一般用在应用最外层，主要作用是：1、向内部的后代组件传递默认配置，方便定制组件属性的默认值，2、设置语言选项

## API

### Attributes

| 属性名       | 说明                                                                                | 类型                                | 默认值  |
| ------------ | ----------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| elpConfig    | [el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) | ^[object]`Ref<record<string, any>>` | —       |
| locale       | yun-elp的语言配置                                                                   | ^[enum]`'zh-cn' \| 'en'`            | `zh-cn` |
| border-label | y-border-label组件全局配置，[见下表](#border-label-attribute)                       | ^[object]`Ref<record<string, any>>` | —       |
| page-header  | y-page-header组件全局配置，[见下表](#page-header-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| page-footer  | y-page-footer组件全局配置，[见下表](#page-footer-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| button       | y-button组件全局配置，[见下表](#button-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| drawer       | y-drawer组件全局配置，[见下表](#drawer-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |

#### border-label Attribute

| 参数   | 描述       | 类型      | 默认值 |
| ------ | ---------- | --------- | ------ |
| width  | 组件总宽度 | ^[string] | auto   |
| height | 组件高度   | ^[string] | 32px   |

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
| rifht  | 组件右侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |

#### button Attribute

| 参数      | 描述                 | 类型                                                                                                                                                                        | 默认值  |
| --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| delay     | 防抖间隔时间，单位ms | ^[string] / ^[number]                                                                                                                                                       | `300`   |
| maxWait   | 最大等待时间，单位ms | ^[string] / ^[number]                                                                                                                                                       | —       |
| placement | el-tooltip显示位置   | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |

#### drawer Attribute

| 参数        | 描述                   | 类型                     | 默认值    |
| ----------- | ---------------------- | ------------------------ | --------- |
| size        | 组件尺寸               | ^[string] / ^[number]    | `'640px'` |
| confirmText | 确认按钮文本           | ^[string]                | `'确定'`  |
| cancelText  | 取消按钮文本           | ^[string]                | `'取消'`  |
| titleStyle  | 组件默认是否显示下边框 | ^[object]`CSSProperties` | —         |

### Slots

| 插槽名  | 说明                   | 参数 |
| ------- | ---------------------- | ---- |
| default | 默认插槽，用于放置内容 | —    |
