---
title: AppWrap 应用容器
description: 用于向子组件传递全局配置
---

# AppWrap 应用容器

AppWrap是一个应用容器

## API

### Attributes

| 属性名       | 说明                                                                                | 类型                                | 默认值  |
| ------------ | ----------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| elpConfig    | [el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) | ^[object]`Ref<record<string, any>>` | —       |
| locale       | yun-elp的语言配置                                                                   | ^[enum]`'zh-cn' \| 'en'`            | `zh-cn` |
| border-label | border-label组件全局配置，[见下表](#border-label-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| page-title   | page-title组件全局配置，[见下表](#page-title-attribute)                             | ^[object]`Ref<record<string, any>>` | —       |

#### border-label Attribute

| 参数   | 描述       | 类型      | 默认值 |
| ------ | ---------- | --------- | ------ |
| width  | 组件总宽度 | ^[string] | auto   |
| height | 组件高度   | ^[string] | 32px   |

#### page-title Attribute

| 参数           | 描述                              | 类型                                   | 默认值 |
| -------------- | --------------------------------- | -------------------------------------- | ------ |
| height         | 组件高度                          | ^[string]                              | —      |
| titlePath      | 从路径元数据中获取title的取值路径 | ^[string]                              | —      |
| border         | 组件默认是否显示下边框            | ^[boolean]                             | —      |
| paddingX       | 组件水平内边距                    | ^[string] / ^[array]`[string, string]` | —      |
| titleTextStyle | 组件文本样式                      | ^[object]`CSSProperties`               | —      |

### Slots

| 插槽名  | 说明                   | 参数 |
| ------- | ---------------------- | ---- |
| default | 默认插槽，用于放置内容 | —    |
