---
title: PageProgress 页面进度条
description: PageProgress 页面进度条
---

# PageProgress 页面进度条

PageProgress 是一个页面级进度条组件，基于 NProgress 库的设计理念，提供了简洁美观的页面加载进度指示器。它支持自动增量、队列优化动画等高级功能，适用于页面切换、数据加载等场景。

## 基础用法

:::demo

page-progress/test

:::

## API

### Attributes

| 属性名      | 说明                   | 类型                  | 默认值   |
|-------------|------------------------|-----------------------|----------|
| modelValue  | 进度条显示状态 (v-model)| ^[boolean]            | `false` |
| step        | 步进距离 (0-100)      | ^[number]             | `8`      |
| spinner     | 是否显示加载图标       | ^[boolean]            | `true`   |
| delay       | 完成后的延迟隐藏时间 (ms) | ^[number]             | `200`    |
| speed       | 自动增量速度 (ms)      | ^[number]             | `200`    |
| color       | 进度条颜色             | ^[string]             | `#409eff` |

### Events

| 事件名          | 说明             | 类型                      |
|-----------------|------------------|---------------------------|
| update:show     | 显示状态变化     | ^[function]`(value: boolean) => void` |
| update:percentage| 进度值变化       | ^[function]`(value: number) => void`  |

### Exposes

| 名称     | 说明                   | 类型                                      |
|----------|------------------------|-------------------------------------------|
| start    | 开始进度条             | ^[function]`() => void`                   |
| done     | 完成进度条             | ^[function]`(force?: boolean) => void`    |
| set      | 设置进度值             | ^[function]`(percentage: number) => void` |
| inc      | 增量进度               | ^[function]`(amount?: number) => void`    |
| configure| 更新配置               | ^[function]`(options: Partial<PageProgressProps>) => void` |

## 使用方法

### 基本控制

```typescript
import { YPageProgress } from 'yun-elp';

// 开始进度条
progressRef.value.start();

// 设置进度
progressRef.value.set(0.5);

// 增加进度
progressRef.value.inc(0.1);

// 完成进度条
progressRef.value.done();
```

### 自动增量

组件默认启用自动增量功能，会定期自动增加进度值，模拟真实的加载过程：

```vue
<template>
  <y-page-progress
    :speed="200"
  />
</template>
```

### 队列优化

组件内部实现了队列机制，避免多个动画同时执行导致的冲突：

```typescript
// 快速连续调用不会冲突
progressRef.value.set(0.3);
progressRef.value.set(0.6);
progressRef.value.done();
```

### 全局配置

可以通过 `useAppConfig` 进行全局配置：

```typescript
import { useAppConfig } from 'yun-elp';

const app = createApp(App);
app.use(createAppConfig({
  pageProgress: {
    color: '#007acc',
    delay: 300,
    step: 10
  }
}));
```
