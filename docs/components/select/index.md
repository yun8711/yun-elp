---
title: Select 选择器
description: Select 选择器，基于 el-select 封装，内置 options 处理
---

# Select 选择器

Select 是基于 Element Plus 的 Select 组件封装的简化版本，主要特点是内置了 options 和 groupOptions 处理，使用可以直接传入选项数组而不需要手动创建 `el-option` 组件。

## 基础用法

:::demo 使用 `options` 选项代替原来的 `el-option` 组件

select/basic

:::

## 简单类型选项

:::demo `options` 选项除了支持对象类型的值，还支持使用简单类型的值，内部会转换为对象类型

select/simple

:::

## 禁用方法

:::demo `disabledMethod` 相当于一个选项过滤函数，可以同时作用于所有选项进行，在某些场景下非常方便。这里需要注意，对于简单类型选项，参数是转换后的对象

select/disabled

:::

## 选项分组

:::demo 用法与 `el-select` 相同，配置上 `optionGroups` 的 `options` 也支持简单类型选项

select/group

:::

## API

### Attributes

除了以下属性外，Select 支持 ElSelect 组件的所有属性。

| 属性名         | 说明         | 类型                                           | 默认值 |
| -------------- | ------------ | ---------------------------------------------- | ------ |
| options        | 选项数组     | ^[array]`SelectOption[]`                       | `[]`   |
| optionGroups   | 选项分组数组 | ^[array]`SelectOptionGroup[]`                  | `[]`   |
| disabledMethod | 选项禁用方法 | ^[Function]`(option: SelectOption) => boolean` | —      |

### SelectOption Properties

| 属性名   | 说明           | 类型       | 默认值  |
| -------- | -------------- | ---------- | ------- |
| label    | 选项的标签     | ^[string]  | —       |
| value    | 选项的值       | `any`      | —       |
| disabled | 是否禁用该选项 | ^[boolean] | `false` |

### SelectOptionGroup Properties

| 属性名   | 说明             | 类型                     | 默认值  |
| -------- | ---------------- | ------------------------ | ------- |
| label    | 分组的标签       | ^[string]                | —       |
| disabled | 是否禁用该分组   | ^[boolean]               | `false` |
| options  | 分组下的选项数组 | ^[array]`SelectOption[]` | `[]`    |

### Events

Select 支持 Element Plus Select 组件的所有事件。

### Slots

支持 ElSelect 组件的所有插槽，包括：

| 插槽名  | 说明                | 参数 |
| ------- | ------------------- | ---- |
| default | 选项内容            | —    |
| prefix  | Select 组件头部内容 | —    |
| empty   | 无选项时的列表内容  | —    |

### Exposes

| 属性名            | 说明                | 类型                        |
| ----------------- | ------------------- | --------------------------- |
| focus             | 使 input 获取焦点   | ^[Function]`()=>void`       |
| blur              | 使 input 失去焦点   | ^[Function]`()=>void`       |
| getSelectedLabel  | 获取当前选中的标签  | ^[string]                   |
| getSelectInstance | 获取 el-select 实例 | ^[object]`ElSelectInstance` |
