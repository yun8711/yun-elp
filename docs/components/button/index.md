# Button 按钮

常用的操作按钮。

## 基础用法

基础的按钮用法。

使用 `type`、`plain`、`round` 和 `circle` 属性来定义按钮的样式。

:::demo

```vue
<template>
  <div class="demo-button">
    <k-button>默认按钮</k-button>
    <k-button type="primary">主要按钮</k-button>
    <k-button type="success">成功按钮</k-button>
    <k-button type="info">信息按钮</k-button>
    <k-button type="warning">警告按钮</k-button>
    <k-button type="danger">危险按钮</k-button>
  </div>
</template>

<style scoped>
.demo-button {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
```

:::

## 不同尺寸

提供三种不同尺寸的按钮：使用 `size` 属性来定义按钮的大小。

:::demo

```vue
<template>
  <div class="demo-button">
    <k-button size="large">大型按钮</k-button>
    <k-button>默认按钮</k-button>
    <k-button size="small">小型按钮</k-button>
  </div>
</template>

<style scoped>
.demo-button {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
```

:::

## 禁用状态

按钮不可用状态。

你可以使用 `disabled` 属性来定义按钮是否可用，它接受一个 `Boolean` 值。

:::demo

```vue
<template>
  <div class="demo-button">
    <k-button disabled>禁用按钮</k-button>
    <k-button type="primary" disabled>禁用按钮</k-button>
    <k-button type="success" disabled>禁用按钮</k-button>
    <k-button type="info" disabled>禁用按钮</k-button>
    <k-button type="warning" disabled>禁用按钮</k-button>
    <k-button type="danger" disabled>禁用按钮</k-button>
  </div>
</template>

<style scoped>
.demo-button {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
```

:::

## API

### Attributes

| 属性名   | 说明           | 类型    | 可选值                                      | 默认值 |
| -------- | -------------- | ------- | ------------------------------------------- | ------ |
| size     | 尺寸           | string  | large / default / small                     | —      |
| type     | 类型           | string  | primary / success / warning / danger / info | —      |
| plain    | 是否朴素       | boolean | —                                           | false  |
| round    | 是否圆角       | boolean | —                                           | false  |
| circle   | 是否圆形       | boolean | —                                           | false  |
| disabled | 是否禁用       | boolean | —                                           | false  |
| loading  | 是否加载中状态 | boolean | —                                           | false  |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义默认内容 |
| icon    | 自定义图标     |

### Events

| 事件名 | 说明           | 回调参数   |
| ------ | -------------- | ---------- |
| click  | 点击按钮时触发 | MouseEvent |

### Exposes

| 名称 | 说明         | 类型 |
| ---- | ------------ | ---- |
| ref  | 按钮实例引用 | Ref  |
