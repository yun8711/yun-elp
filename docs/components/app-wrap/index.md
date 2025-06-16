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
| border-label | border-label全局配置                                                                    | [见下表](#border-label-attribute) |        |

#### border-label Attribute

| 参数   | 描述       | 类型   | 默认值 |
| ------ | ---------- | ------ | ------ |
| width  | 组件总宽度 | string | auto   |
| height | 组件高度   | string | 32px   |

### Slots

| 插槽名  | 说明                   |
| ------- | ---------------------- |
| default | 默认插槽，用于放置内容 |
