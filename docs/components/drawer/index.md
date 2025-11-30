---
title: Drawer
description: 默认提供footer区域及操作按钮的抽屉组件
---

# Drawer 抽屉

基于 `el-drawer` 封装，重置了内部样式，`footer` 插槽默认内置了"确定"、"取消"按钮，并且默认都是防抖的

## 用法

:::demo

drawer/test

:::

## API

### Attributes

| 属性名                | 说明                                                                                           | 类型                                            | 默认值                                       |
| --------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| model-value / v-model | 是否显示 Drawer                                                                                | ^[boolean]                                      | `false`                                      |
| size                  | 抽屉尺寸                                                                                       | ^[string] / ^[number]                           | `'640px'`                                    |
| title                 | 对话框标题                                                                                     | ^[string]                                       | `''`                                         |
| title-style           | 标题样式                                                                                       | ^[object]`CSSProperties`                        | —                                            |
| show-footer           | 是否显示底部按钮区域                                                                           | ^[boolean]                                      | `true`                                       |
| no-fonfirm            | 是否隐藏确认按钮                                                                               | ^[boolean]                                      | `false`                                      |
| confirm-text          | 确认按钮文本                                                                                   | ^[string]                                       | `'确定'`                                     |
| confirm-props         | 确认按钮属性                                                                                   | ^[object]`YButtonProps`                         | ^[object]`{type:'primary',model:'debounce'}` |
| no-cancel             | 是否隐藏取消按钮                                                                               | ^[boolean]                                      | `false`                                      |
| cancel-text           | 取消按钮文本                                                                                   | ^[string]                                       | `'取消'`                                     |
| cancel-props          | 取消按钮属性                                                                                   | ^[object]`YButtonProps`                         | ^[object]`{type:'default',model:'debounce'}` |
| append-to-body        | Drawer 自身是否插入至 body 元素上，嵌套的 Drawer 必须指定该属性并赋值为 true                   | ^[boolean]                                      | `false`                                      |
| append-to             | Drawer 挂载到哪个 DOM 元素 将覆盖 append-to-body                                               | ^[string]`CSSSelector` / ^[object]`HTMLElement` | `'body'`                                     |
| lock-scroll           | 是否在 Drawer 出现时将 body 滚动锁定                                                           | ^[boolean]                                      | `true`                                       |
| before-close          | 关闭前的回调，会暂停 Drawer 的关闭，回调函数内执行 done 参数方法的时候才会真正关闭对话框       | ^[Function]`(done: DoneFn) => void`             | —                                            |
| close-on-click-modal  | 是否可以通过点击 modal 关闭 Drawer                                                             | ^[boolean]                                      | `true`                                       |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Drawer                                                               | ^[boolean]                                      | `true`                                       |
| open-delay            | Drawer 打开的延时时间，单位ms                                                                  | ^[number]                                       | `0`                                          |
| close-delay           | Drawer 关闭的延时时间，单位ms                                                                  | ^[number]                                       | `0`                                          |
| destroy-on-close      | 当关闭 Drawer 时，销毁其中的元素                                                               | ^[boolean]                                      | `false`                                      |
| modal                 | 是否需要遮罩层                                                                                 | ^[boolean]                                      | `true`                                       |
| modal-penetrable      | 是否允许穿透遮罩层，modal 属性必须为 false                                                     | ^[string]                                       | `false`                                      |
| direction             | Drawer 打开的方向                                                                              | ^[enum]`'rtl' \| 'ltr' \| 'ttb' \| 'btt'`       | `'rtl'`                                      |
| resizable             | 为抽屉启用可调整大小的功能                                                                     | ^[boolean]                                      | `false`                                      |
| show-close            | 是否显示关闭按钮                                                                               | ^[boolean]                                      | `true`                                       |
| with-header           | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 | ^[boolean]                                      | `true`                                       |
| modal-class           | 遮罩的自定义类名                                                                               | ^[string]                                       | —                                            |
| header-class          | header 部分的自定义 class 名                                                                   | ^[string]                                       | `'y-drawer__header'`                         |
| body-class            | body 部分的自定义 class 名                                                                     | ^[string]                                       | `'y-drawer__body'`                           |
| footer-class          | footer 部分的自定义 class 名                                                                   | ^[string]                                       | `'y-drawer__footer'`                         |
| z-index               | 和原生的 CSS 的 z-index 相同，改变 z 轴的顺序                                                  | ^[number]                                       | —                                            |
| header-aria-level     | header 的 `aria-level` 属性                                                                    | ^[string]                                       | `'2'`                                        |

### Slots

| 名称    | 说明                                                 | 参数 |
| ------- | ---------------------------------------------------- | ---- |
| default | 抽屉默认内容                                         | —    |
| header  | 自定义标题的内容；会替换标题部分，但不会移除关闭按钮 | —    |
| title   | 对话框标题的文本内容                                 | —    |
| footer  | Drawer 页脚部分                                      | —    |
| confirm | 自定义确认按钮                                       | —    |
| cancel  | 自定义取消按钮                                       | —    |

### Events

| 事件名  | 说明               | 类型                    |
| ------- | ------------------ | ----------------------- |
| confirm | 点击确认按钮时触发 | ^[function]`() => void` |
| cancel  | 点击取消按钮时触发 | ^[function]`() => void` |

### Exposes

| 名称  | 说明     | 类型                    |
| ----- | -------- | ----------------------- |
| open  | 打开抽屉 | ^[function]`() => void` |
| close | 关闭抽屉 | ^[function]`() => void` |
