---
title: SimpleRadio 单选框
description: SimpleRadio 单选框
---

# SimpleRadio 单选框

## 基础用法

:::demo

simple-radio/test

:::

## API

### Attributes

| 属性名     | 说明                                     | 类型                               | 默认值    |
| ---------- | ---------------------------------------- | ---------------------------------- | --------- |
| modelValue | 绑定值                                   | ^[string] / ^[number] / ^[boolean] | `''`      |
| options    | 选项值                                   | ^[object]`SimpleRadioOption[]`     | `[]`      |
| childType  | 子元素类型，即el-radio-group支持的子组件 | ^[object]`SimpleRadioOption[]`     | `'radio'` |

### SimpleRadioOption

它是 [RadioProps](https://element-plus.org/zh-CN/component/radio.html#radio-attributes) 和 [RadioButtonProps](https://element-plus.org/zh-CN/component/radio.html#radiobutton-attributes) 的联合类型

### Slots

| 名称    | 说明         | 参数                                   |
| ------- | ------------ | -------------------------------------- |
| default | 选项内容插槽 | ^[object]`{ item: SimpleRadioOption }` |
