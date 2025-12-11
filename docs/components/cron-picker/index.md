---
title: CronPicker
description: 定时选择器
---

# CronPicker 定时选择器

## 说明

基于 [`cron-parser^5.3.1`](https://www.npmjs.com/package/cron-parser) 封装的定时选择器组件，支持多种调度周期（分钟、小时、日、周、月、年）的配置，可以生成标准的 Cron 表达式，并提供执行时间的预览功能。

注意：需要单独安装 `cron-parser`

## 用法示例

### 基础用法

:::demo

cron-picker/test

:::

### 自定义默认值

:::demo 通过 `editDefaultValue` 属性可以自定义不同调度周期的默认配置

cron-picker/custom-defaults

:::

## API

### Attributes

| 属性名                | 说明                                     | 类型                                                                | 默认值     |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------- | ---------- |
| model-value / v-model | 绑定值                                   | ^[string]                                                           | `''`       |
| disabled-period       | 禁止下拉周期选项                         | ^[array]`string[]`                                                  | `[]`       |
| edit-default-value    | 修改默认值，例如切换到年时默认选中的时间 | ^[object]`Record<string, any>`                                      | `{}`       |
| default-period        | 默认调度周期                             | ^[enum]`'MINUTE' \| 'HOUR' \| 'DAY' \| 'WEEK' \| 'MONTH' \| 'YEAR'` | `'MINUTE'` |
| placeholder           | 占位符                                   | ^[string]                                                           | —          |

### editDefaultValue 配置项

#### MINUTE（分钟周期）

| 属性名    | 说明             | 类型      | 默认值    |
| --------- | ---------------- | --------- | --------- |
| startTime | 开始时间         | ^[string] | `'00:00'` |
| endTime   | 结束时间         | ^[string] | `'23:59'` |
| perMinute | 执行间隔（分钟） | ^[string] | `'5'`     |

#### HOUR（小时周期）

| 属性名       | 说明             | 类型                         | 默认值    |
| ------------ | ---------------- | ---------------------------- | --------- |
| startTime    | 开始时间         | ^[string]                    | `'00:00'` |
| endTime      | 结束时间         | ^[string]                    | `'23:59'` |
| perHour      | 执行间隔（小时） | ^[string]                    | `'1'`     |
| assignHours  | 指定执行的小时   | ^[array]`string[]`           | `['0']`   |
| assignMinute | 执行分钟         | ^[string]                    | `'0'`     |
| radio        | 选择模式         | ^[enum]`'start' \| 'assign'` | `'start'` |

#### DAY（日周期）

| 属性名     | 说明     | 类型      | 默认值    |
| ---------- | -------- | --------- | --------- |
| timePicker | 执行时间 | ^[string] | `'00:00'` |

#### WEEK（周周期）

| 属性名     | 说明       | 类型               | 默认值    |
| ---------- | ---------- | ------------------ | --------- |
| weeks      | 执行的星期 | ^[array]`string[]` | `['1']`   |
| timePicker | 执行时间   | ^[string]          | `'00:00'` |

#### MONTH（月周期）

| 属性名     | 说明       | 类型               | 默认值    |
| ---------- | ---------- | ------------------ | --------- |
| days       | 执行的日期 | ^[array]`string[]` | `['1']`   |
| timePicker | 执行时间   | ^[string]          | `'00:00'` |

#### YEAR（年周期）

| 属性名     | 说明       | 类型               | 默认值    |
| ---------- | ---------- | ------------------ | --------- |
| days       | 执行的日期 | ^[array]`string[]` | `['1']`   |
| months     | 执行的月份 | ^[array]`string[]` | `['1']`   |
| timePicker | 执行时间   | ^[string]          | `'00:00'` |

### Events

| 事件名 | 说明             | 类型                                 |
| ------ | ---------------- | ------------------------------------ |
| change | Cron表达式值变化 | ^[Function]`(value: string) => void` |

### Exposes

| 名称  | 说明       | 类型                    |
| ----- | ---------- | ----------------------- |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur  | 失焦输入框 | ^[Function]`() => void` |
