---
title: Dialog
description: 默认提供操作按钮的对话框组件
---

# Dialog 对话框

基于 `el-dialog` 封装，重置了内部样式，`footer` 插槽默认内置了"确定"、"取消"按钮，并且默认都是防抖的

## 用法

:::demo

dialog/test

:::

## API

### Attributes

| 属性名                | 说明                                                                                     | 类型                                            | 默认值                                 |
| --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| model-value / v-model | 对话框显示状态                                                                           | ^[boolean]                                      | `false`                                |
| title                 | 对话框标题                                                                               | ^[string]                                       | `''`                                   |
| title-style           | 标题样式                                                                                 | ^[object]`CSSProperties`                        | `{}`                                   |
| show-footer           | 是否显示底部区域                                                                         | ^[boolean]                                      | `true`                                 |
| no-confirm            | 是否隐藏确认按钮                                                                         | ^[boolean]                                      | `false`                                |
| confirm-text          | 确认按钮文本                                                                             | ^[string]                                       | `'确定'`                               |
| confirm-props         | 确认按钮属性                                                                             | ^[object]`YButtonProps`                         | `{ type: 'primary',model:'debounce' }` |
| no-cancel             | 是否隐藏取消按钮                                                                         | ^[boolean]                                      | `false`                                |
| cancel-text           | 取消按钮文本                                                                             | ^[string]                                       | `'取消'`                               |
| cancel-props          | 取消按钮属性                                                                             | ^[object]`YButtonProps`                         | `{ type: 'default',model:'debounce' }` |
| body-max-height       | body 区域最大高                                                                          | ^[string]                                       | `'50vh'`                               |
| width                 | 对话框的宽度，默认值为 50%                                                               | ^[string] / ^[number]                           | `'50%'`                                |
| fullscreen            | 是否为全屏                                                                               | ^[boolean]                                      | `false`                                |
| top                   | dialog CSS 中的 margin-top 值，默认为 15vh                                               | ^[string]                                       | `'15vh'`                               |
| modal                 | 是否需要遮罩层                                                                           | ^[boolean]                                      | `true`                                 |
| modal-penetrable      | 是否允许穿透遮罩层，modal 属性必须为 false                                               | ^[string]                                       | `false`                                |
| modal-class           | 遮罩的自定义类名                                                                         | ^[string]                                       | —                                      |
| header-class          | header 部分的自定义 class 名                                                             | ^[string]                                       | `'y-dialog__header'`                   |
| body-class            | body 部分的自定义 class 名                                                               | ^[string]                                       | `'y-dialog__body'`                     |
| footer-class          | footer 部分的自定义 class 名                                                             | ^[string]                                       | `'y-dialog__footer'`                   |
| append-to-body        | Dialog 自身是否插入至 body 元素上，嵌套的 Dialog 必须指定该属性并赋值为 true             | ^[boolean]                                      | `false`                                |
| append-to             | Dialog 挂载到哪个 DOM 元素 将覆盖 append-to-body                                         | ^[string]`CSSSelector` / ^[object]`HTMLElement` | `'body'`                               |
| lock-scroll           | 是否在 Dialog 出现时将 body 滚动锁定                                                     | ^[boolean]                                      | `true`                                 |
| open-delay            | dialog 打开的延时时间，单位ms                                                            | ^[number]                                       | `0`                                    |
| close-delay           | dialog 关闭的延时时间，单位ms                                                            | ^[number]                                       | `0`                                    |
| close-on-click-modal  | 是否可以通过点击 modal 关闭 Dialog                                                       | ^[boolean]                                      | `true`                                 |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Dialog                                                         | ^[boolean]                                      | `true`                                 |
| show-close            | 是否显示关闭按钮                                                                         | ^[boolean]                                      | `true`                                 |
| before-close          | 关闭前的回调，会暂停 Dialog 的关闭，回调函数内执行 done 参数方法的时候才会真正关闭对话框 | ^[Function]`(done: DoneFn) => void`             | —                                      |
| draggable             | 为 Dialog 启用可拖拽功能                                                                 | ^[boolean]                                      | `false`                                |
| overflow              | 拖动范围可以超出可视区                                                                   | ^[boolean]                                      | `false`                                |
| center                | 是否让 Dialog 的 header 和 footer 部分居中排列                                           | ^[boolean]                                      | `false`                                |
| align-center          | 是否水平垂直对齐对话框                                                                   | ^[boolean]                                      | `false`                                |
| destroy-on-close      | 当关闭 Dialog 时，销毁其中的元素                                                         | ^[boolean]                                      | `false`                                |
| close-icon            | 自定义关闭图标，默认 Close                                                               | ^[string] / ^[Component]                        | —                                      |
| z-index               | 和原生的 CSS 的 z-index 相同，改变 z 轴的顺序                                            | ^[number]                                       | —                                      |
| header-aria-level     | header 的 `aria-level` 属性                                                              | ^[string]                                       | `'2'`                                    |

### Slots

| 名称    | 说明                                                 | 参数 |
| ------- | ---------------------------------------------------- | ---- |
| default | 对话框的默认内容                                         | —    |
| header  | 对话框标题的内容；会替换标题部分，但不会移除关闭按钮 | —    |
| title   | 对话框标题的文本内容                                 | —    |
| footer  | 底部按钮操作区的内容                                 | —    |
| confirm | 自定义确认按钮                                       | —    |
| cancel  | 自定义取消按钮                                       | —    |

### Events

| 事件名  | 说明               | 类型                    |
| ------- | ------------------ | ----------------------- |
| confirm | 点击确认按钮时触发 | ^[Function]`() => void` |
| cancel  | 点击取消按钮时触发 | ^[Function]`() => void` |

### Exposes

| 名称      | 说明              | 类型                             |
| --------- | ----------------- | -------------------------------- |
| dialogRef | el-dialog组件实例 | ^[object]`Ref<ElDialogInstance>` |
