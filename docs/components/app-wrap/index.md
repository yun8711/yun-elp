---
title: AppWrap 应用容器
description: 用于向子组件传递全局配置
---

# AppWrap 应用容器

AppWrap是一个应用容器

## API

### Attributes

| 属性名       | 说明                                                                                    | 类型                              | 默认值 |
| ------------ | --------------------------------------------------------------------------------------- | --------------------------------- | ------ |
| elpConfig    | 参见[el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) |                                   |        |
| locale       | yun-elp的语言配置                                                                       | zh-cn\|en                         | zh-cn  |
| border-label | border-label组件全局配置                                                                | [见下表](#border-label-attribute) |        |
| page-title   | page-title组件全局配置                                                                  | [见下表](#page-title-attribute)   |        |

#### border-label Attribute

| 参数   | 描述       | 类型   | 默认值 |
| ------ | ---------- | ------ | ------ |
| width  | 组件总宽度 | string | auto   |
| height | 组件高度   | string | 32px   |

#### page-title Attribute

| 参数           | 描述                              | 类型                       | 默认值 |
| -------------- | --------------------------------- | -------------------------- | ------ |
| height         | 组件高度                          | string                     | -      |
| titlePath      | 从路径元数据中获取title的取值路径 | string                     | -      |
| border         | 组件默认是否显示下边框            | boolean                    | -      |
| paddingX       | 组件水平内边距                    | string \| [string, string] | -      |
| titleTextStyle | 组件文本样式                      | object                     | -      |

### Slots

| 插槽名  | 说明                   |
| ------- | ---------------------- |
| default | 默认插槽，用于放置内容 |
