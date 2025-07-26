---
title: RowSelect 行选择器
description: RowSelect 行选择器组件，支持单选和多选模式，具有折叠展开功能
---

# RowSelect 行选择器

## 多选模式

:::demo 默认情况下为多选模式

row-select/multipl

:::

## 单选模式

:::demo

row-select/single

:::

## 高级用法

:::demo 可以将多个 RowSelect 组合成为高级筛选组件

row-select/advance

:::

## API

### Attributes

| 属性名       | 说明                                           | 类型                                                   | 默认值                                                    |
| ------------ | ---------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| modelValue   | 绑定值                                         | ^[string] / ^[number] / ^[array]`string[] \| number[]` | `''`                                                      |
| single       | 是否为单选模式                                 | ^[boolean]                                             | `false`                                                   |
| duration     | 收缩展开动画时长，单位ms                       | ^[number]                                              | `200`                                                     |
| defaultLines | 默认显示行数                                   | ^[number]                                              | `1`                                                       |
| labelWidth   | label宽度                                      | ^[string]                                              | `'auto'`                                                  |
| labelAlign   | label水平对齐方式，对应text-align属性的值      | ^[enum]`'left' \| 'center' \| 'right'`                 | `'left'`                                                  |
| labelText    | label文字                                      | ^[string]                                              | `'选项'`                                                  |
| separator    | 是否显示分隔符                                 | ^[boolean]                                             | `true`                                                    |
| labelStyles  | label文字的样式                                | ^[object]`CSSProperties`                               | —                                                         |
| foldText     | 右侧按钮折叠状态时文字                         | ^[string]                                              | `'更多'`                                                  |
| unfoldText   | 右侧按钮展开状态时文字                         | ^[string]                                              | `'收起'`                                                  |
| showIcon     | 是否显示箭头图标                               | ^[boolean]                                             | `true`                                                    |
| iconPosition | 图标位于按钮方位                               | ^[enum]`'left' \| 'right'`                             | `'left'`                                                  |
| btnStyles    | 右侧按钮样式                                   | ^[object]`CSSProperties`                               | —                                                         |
| options      | 选项数组                                       | ^[object]`RowSelectOption[]`                           | `[]`                                                      |
| showAll      | 是否显示全部选项                               | ^[boolean]                                             | `true`                                                    |
| allText      | 全部选项文字                                   | ^[string]                                              | `'全部'`                                                  |
| itemHeight   | 选项高度，只支持px单位                         | ^[string] / ^[number]                                  | `'24px'`                                                  |
| itemWidth    | 选项宽度                                       | ^[string] / ^[number]                                  | `'auto'`                                                  |
| gap          | 选项间距，支持数字或带px单位，多个值用逗号分隔 | ^[string]                                              | `'8'`                                                     |
| defineProps  | 定义选项的属性映射                             | ^[object]`RowSelectDefineProps`                        | `{ label: 'label', value: 'value', disabled: 'disabled'}` |
| itemStyles   | 选项样式集                                     | ^[object]`CSSProperties`                               | —                                                         |

### RowSelectOption

| 属性名   | 说明     | 类型                  | 默认值  |
| -------- | -------- | --------------------- | ------- |
| label    | 选项标签 | ^[string]             | —       |
| value    | 选项值   | ^[string] / ^[number] | —       |
| disabled | 是否禁用 | ^[boolean]            | `false` |

### Slots

| 名称    | 说明               | 参数                                                |
| ------- | ------------------ | --------------------------------------------------- |
| default | 选项内容插槽       | ^[object]`{ item: RowSelectOption, index: number }` |
| all     | "全部"选项内容插槽 | —                                                   |

### Events

| 事件名            | 说明               | 类型                                                           |
| ----------------- | ------------------ | -------------------------------------------------------------- |
| update:modelValue | 绑定值变化时触发   | ^[Function]`(value: string \| string[] \| number \| number[])` |
| change            | 选择变化时触发     | ^[Function]`(value: string \| string[] \| number \| number[])` |
| fold              | 折叠状态变化时触发 | ^[Function]`(value: boolean)`                                  |

### Exposes

| 名称    | 说明                 | 类型                                  |
| ------- | -------------------- | ------------------------------------- |
| trigger | 触发折叠/展开        | ^[Function]`(fold?: boolean) => void` |
| clear   | 清空值               | ^[Function]`() => void`               |
| reset   | 重置组件状态，包括值 | ^[Function]`() => void`               |

### CSS Variables

| 变量名                   | 说明                | 默认值                            |
| ------------------------ | ------------------- | --------------------------------- |
| --text-font-size         | 字号                | `var(--el-font-size-base)`        |
| --text-label-color       | 标签文本颜色        | `var(--el-text-color-regular)`    |
| --text-label-font-size   | 标签文本字号        | `var(--el-font-size-base)`        |
| --text-item-color        | 选项文本颜色        | `var(--el-text-color-regular)`    |
| --text-item-font-size    | 选项文本字号        | `var(--el-font-size-base)`        |
| --active-item-color      | 选项选中时文本颜色  | `var(--el-color-white)`           |
| --active-item-bg-color   | 选项选中时背景颜色  | `var(--el-color-primary)`         |
| --disabled-item-color    | 选项禁用时文本颜色  | `var(--el-text-color-disabled)`   |
| --disabled-item-bg-color | 选项禁用时背景颜色  | `var(--el-color-disabled)`        |
| --hover-item-color       | 选项hover时文本颜色 | `var(--el-text-color-primary)`    |
| --hover-item-bg-color    | 选项hover时背景颜色 | `var(--el-color-primary-light-9)` |

## 类型定义

<details>

```ts
interface RowSelectDefineProps {
  label?: string;
  key?: string;
  disabled?: string;
}
```

</details>
