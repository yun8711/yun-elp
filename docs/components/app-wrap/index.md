---
title: AppWrap 应用容器
description: 用于向子组件传递全局配置
---

# AppWrap 应用容器

AppWrap是一个应用容器，一般用在应用最外层，主要作用是：

- 向内部的后代组件传递默认配置，方便定制组件属性的默认值
- 设置组件库的语言选项

注意：
- AppWrap 向后代组件传递的配置参数只是为了从全局角度简化组件的配置和使用，所以它的优先级最低
- 对于使用了 element-plus 原生组件的组件，[el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) 也会影响组件属性

## API

### Attributes

| 属性名       | 说明                                                                                | 类型                                | 默认值  |
| ------------ | ----------------------------------------------------------------------------------- | ----------------------------------- | ------- |
| elpConfig    | [el-config-provider](https://element-plus.org/zh-CN/component/config-provider.html) | ^[object]`ElConfigProviderProps` | —       |
| locale       | yun-elp的语言配置                                                                   | ^[enum]`'zh-cn' \| 'en'`            | `zh-cn` |
| border-label | y-border-label组件全局配置，[见下表](#border-label-attribute)                       | ^[object]`Ref<record<string, any>>` | —       |
| page-header  | y-page-header组件全局配置，[见下表](#page-header-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| page-footer  | y-page-footer组件全局配置，[见下表](#page-footer-attribute)                         | ^[object]`Ref<record<string, any>>` | —       |
| button       | y-button组件全局配置，[见下表](#button-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| drawer       | y-drawer组件全局配置，[见下表](#drawer-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |
| dialog       | y-dialog组件全局配置，[见下表](#dialog-attribute)                                   | ^[object]`Ref<record<string, any>>` | —       |

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
| right  | 组件右侧距离，有效的css尺寸值 | ^[string] / ^[number] | `0`      |

#### button Attribute

继承 [el-button 的全部属性](https://element-plus.org/zh-CN/component/button.html#button-attributes) ，另外包含以下属性

| 参数         | 描述                 | 类型                                                                                                                                                                        | 默认值  |
| ------------ | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| delay        | 防抖间隔时间，单位ms | ^[string] / ^[number]                                                                                                                                                       | `300`   |
| maxWait      | 最大等待时间，单位ms | ^[string] / ^[number]                                                                                                                                                       | —       |
| placement    | el-tooltip显示位置   | ^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'` | `'top'` |
| tooltipProps | el-tooltip的属性     | ^[object]`ElTooltipProps`                                                                                                                                                   | —       |

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

### Slots

| 插槽名  | 说明                   | 参数 |
| ------- | ---------------------- | ---- |
| default | 默认插槽，用于放置内容 | —    |
