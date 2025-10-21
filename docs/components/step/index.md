---
title: Step 步骤条
description: Step 步骤条
---

# Step 步骤条

## 基础用法

:::demo 通过 `steps` 可以定义每步的名称；如果不需要名称，则使用 `stepNumber` 定义步骤数量即可

step/basic

:::

## 自定义样式

:::demo 通过css变量可以自定义组件中部分样式

step/style

:::

## 插槽

:::demo 通过插槽可以自定义步骤条节点样式，不包含连接线

step/slot

:::

## API

### Attributes

| 属性名      | 说明                                                   | 类型               | 默认值 |
| ----------- | ------------------------------------------------------ | ------------------ | ------ |
| options     | 步骤选项数组，用于显示步骤标签                         | ^[array]`string[]` | `[]`   |
| stepNumber  | 步骤数量，当options为空时使用此属性生成步骤数，不小于2 | ^[number]          | `2`    |
| activeIndex | 当前激活步骤的索引                                     | ^[number]          | `0`    |
| inlineLabel | 标签是否与步骤序号同行显示                             | ^[boolean]         | `true` |

### Slots

| 名称    | 说明                         | 参数                                                 |
| ------- | ---------------------------- | ---------------------------------------------------- |
| default | 每个step的插槽，不包含连接线 | ^[object]`{step:string,index:number,active:boolean}` |

### CSS Variables

| 变量名              | 说明                   | 默认值               |
| ------------------- | ---------------------- | -------------------- |
| --step-height       | 组件高度               | `64px`               |
| --line-width        | 连接线宽度             | `1px`                |
| --active-color      | active状态时的颜色     | `--el-color-primary` |
| --active-text-color | active状态时的文本颜色 | `--el-color-primary` |
