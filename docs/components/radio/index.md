---
title: Radio
description: 配置更方便的单选框
---

# Radio 单选框

基于 `el-radio` 封装，简化了选项配置

## 基础用法

:::demo

radio/test

:::

## API

### Attributes

| 属性名                | 说明                                     | 类型                                          | 默认值    |
| --------------------- | ---------------------------------------- | --------------------------------------------- | --------- |
| model-value / v-model | 绑定值                                   | ^[string] / ^[number] / ^[boolean]            | `''`      |
| options               | 选项值                                   | ^[object]`RadioOption[]`                      | `[]`      |
| child-type            | 子元素类型，即el-radio-group支持的子组件 | ^[enum]`'radio' \| 'button'`                  | `'radio'` |
| disabled-method       | 选项禁用方法                             | ^[Function]`(option: RadioOption) => boolean` | —         |

### RadioOption

它支持 [RadioProps](https://element-plus.org/zh-CN/component/radio.html#radio-attributes) 和 [RadioButtonProps](https://element-plus.org/zh-CN/component/radio.html#radiobutton-attributes) ，也可以是任意简单数据类型的值

### Slots

| 名称    | 说明         | 参数                             |
| ------- | ------------ | -------------------------------- |
| default | 选项内容插槽 | ^[object]`{ item: RadioOption }` |
