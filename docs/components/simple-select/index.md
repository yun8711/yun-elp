---
title: SimpleSelect 选择器
description: SimpleSelect 选择器，基于 el-select 封装，内置 options 处理
---

# SimpleSelect 选择器

SimpleSelect 是基于 Element Plus 的 Select 组件封装的简化版本，主要特点是内置了 options 和 groupOptions 处理，使用可以直接传入选项数组而不需要手动创建 `el-option` 组件。

## options 用法

:::demo

simple-select/test

:::

## groupOptions 用法

:::demo 

simple-select/group

:::


## API

### Attributes

除了以下属性外，SimpleSelect 支持 Element Plus Select 组件的所有属性。

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| options | 选项数组 | SimpleSelectOption[] | [] |
| optionGroups | 选项分组数组 | SimpleSelectOptionGroup[] | [] |

### SimpleSelectOption

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| label | 选项的标签 | string | - |
| value | 选项的值 | any | - |
| disabled | 是否禁用该选项 | boolean | false |

### SimpleSelectOptionGroup

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| label | 分组的标签 | string | - |
| disabled | 是否禁用该分组 | boolean | false |
| options | 分组下的选项数组 | SimpleSelectOption[] | [] |

### Events

SimpleSelect 支持 Element Plus Select 组件的所有事件。

### Slots

SimpleSelect 完全支持 Element Plus Select 组件的所有插槽，包括：

| 插槽名 | 说明 | 作用域参数 |
|--------|------|------------|
| default | 选项内容 | - |
| prefix | Select 组件头部内容 | - |
| empty | 无选项时的列表内容 | - |


### Exposes

SimpleSelect 暴露了以下方法：

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| focus | 使 input 获取焦点 | - | void |
| blur | 使 input 失去焦点 | - | void |
| getSelectedLabel | 获取当前选中的标签 | - | string |
| getSelectInstance | 获取 el-select 实例 | - | ElSelect 实例 |
