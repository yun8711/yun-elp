---
title: FormItem
description: 基于 Element Plus FormItem + Col 的表单项
---

# FormItem 表单项

## 说明

`y-form-item` 整合 `el-form-item` + `el-col`，需与 [Form 表单](/components/form/) 配合使用。

用法示例（布局、联动、防抖等）见 [Form 表单 · 用法示例](/components/form/#用法示例)。

注意：

- 未设置 `span` 时继承 `y-form` 的 `span`
- 属性会分发给 `el-col` 或 `el-form-item`

## 用法示例

见 [Form 表单 · 用法示例](../form/)

## API

### Attributes

支持 [FormItem Attributes](https://element-plus.org/zh-CN/component/form.html#formitem-attributes) 及 [Col Attributes](https://element-plus.org/zh-CN/component/layout.html#col-attributes) 的全部属性。下表列出常用项；未列出的 el-form-item 属性同样支持透传。

| 属性名         | 说明                                  | 类型                                      | 默认值      |
| -------------- | ------------------------------------- | ----------------------------------------- | ----------- |
| span           | 栅格占据列数，同 el-col               | ^[number]                                 | 继承 y-form |
| offset         | 栅格左侧间隔格数，同 el-col           | ^[number]                                 | `0`         |
| push           | 向右移动格数，同 el-col               | ^[number]                                 | `0`         |
| pull           | 向左移动格数，同 el-col               | ^[number]                                 | `0`         |
| xs             | `<768px` 响应式栅格，同 el-col        | ^[number] / ^[object]`ColSizeObject`      | —           |
| sm             | `≥768px` 响应式栅格，同 el-col        | ^[number] / ^[object]`ColSizeObject`      | —           |
| md             | `≥992px` 响应式栅格，同 el-col        | ^[number] / ^[object]`ColSizeObject`      | —           |
| lg             | `≥1200px` 响应式栅格，同 el-col       | ^[number] / ^[object]`ColSizeObject`      | —           |
| xl             | `≥1920px` 响应式栅格，同 el-col       | ^[number] / ^[object]`ColSizeObject`      | —           |
| tag            | 自定义元素标签，同 el-col             | ^[string]                                 | `'div'`     |
| label          | 标签文本，同 el-form-item             | ^[string]                                 | —           |
| prop           | 模型字段名，同 el-form-item           | ^[string] / ^[object]`string[]`           | —           |
| rules          | 校验规则，同 el-form-item             | ^[object]`FormItemRule \| FormItemRule[]` | —           |
| label-width    | 标签宽度，同 el-form-item             | ^[string] / ^[number]                     | —           |
| required       | 是否必填，同 el-form-item             | ^[boolean]                                | —           |
| inline-message | 是否行内展示校验信息，同 el-form-item | ^[boolean]                                | —           |

### Slots

| 名称    | 说明               | 参数                         |
| ------- | ------------------ | ---------------------------- |
| default | 表单控件内容       | —                            |
| label   | 自定义标签内容     | ^[object]`{ label: string }` |
| error   | 自定义校验错误内容 | ^[object]`{ error: string }` |

### Exposes

| 名称            | 说明                                                           | 类型                                                                                |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| size            | 表单项尺寸，同 el-form-item                                    | ^[object]`ComputedRef<'' \| 'default' \| 'small' \| 'large'>`                       |
| validateMessage | 校验提示信息，同 el-form-item                                  | ^[object]`Ref<string>`                                                              |
| validateState   | 校验状态，同 el-form-item                                      | ^[object]`Ref<'' \| 'error' \| 'success' \| 'validating'>`                          |
| validate        | 校验表单项，同 el-form-item                                    | ^[function]`(trigger: string, callback?: FormValidateCallback) => Promise<boolean>` |
| clearValidate   | 移除该表单项的校验结果，同 el-form-item                        | ^[function]`() => void`                                                             |
| resetField      | 重置该表单项为初始值并移除校验结果，同 el-form-item            | ^[function]`() => void`                                                             |
| setInitialValue | 设置该字段初始值，`resetField` 时将重置到此值，同 el-form-item | ^[function]`(value: any) => void`                                                   |
