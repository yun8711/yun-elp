# 组件开发指南

本指南介绍如何在 KD-ELP 组件库中开发新组件，包括目录结构、命名规范和最佳实践。

## 组件目录结构

每个组件都应该遵循以下目录结构：

```
packages/components/src/components/k-组件名/
├── index.ts                # 组件导出文件
├── k-组件名.vue            # 组件实现文件
├── k-组件名.scss           # 组件样式文件
├── style.ts                # 样式入口文件（用于按需导入）
└── k-组件名.test.ts        # 组件测试文件
```

### 示例：k-button 组件

```
packages/components/src/components/k-button/
├── index.ts              # 导出 KButton 组件
├── k-button.vue          # KButton 组件实现
├── k-button.scss         # KButton 样式
├── style.ts              # 样式入口（用于按需导入）
└── k-button.test.ts      # KButton 测试
```

## 组件命名规范

- 组件目录名使用 kebab-case（短横线）命名，以 `k-` 开头，例如：`k-button`
- 组件文件名也使用 kebab-case 命名，例如：`k-button.vue`
- 组件在 Vue 中的注册名使用 PascalCase 命名，例如：`KButton`

## 组件开发步骤

### 1. 创建组件目录和文件

```bash
mkdir -p packages/components/src/components/k-your-component
```

### 2. 创建组件文件

#### index.ts

```ts
import KYourComponent from './k-your-component.vue';

export default KYourComponent;
```

#### k-your-component.vue

```vue
<template>
  <div class="k-your-component">
    <!-- 组件模板 -->
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'KYourComponent',
  inheritAttrs: false
});

// 定义组件属性
defineProps<{
  // 组件属性
}>();

// 定义组件事件
const emit = defineEmits<{
  // 组件事件
}>();
</script>

<style lang="scss">
@import './k-your-component.scss';
</style>
```

#### k-your-component.scss

```scss
.k-your-component {
  // 组件样式
}
```

#### k-your-component.test.ts

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import KYourComponent from './k-your-component.vue';

describe('KYourComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(KYourComponent);
    expect(wrapper.exists()).toBe(true);
  });

  // 更多测试...
});
```

#### style.ts

```ts
/**
 * 组件样式入口文件
 * 用于按需导入样式
 */

// 导入组件样式
import './k-your-component.scss';

// 如果组件依赖其他组件，可以在这里导入它们的样式
// 例如: import '../k-other-component/style';

// 用于类型检查和导出
export {};
```

### 3. 注册组件

在 `packages/components/src/components/index.ts` 中导出新组件：

```ts
// 导出所有组件
import KButton from './k-button';
import KYourComponent from './k-your-component';

export { KButton, KYourComponent };
```

## 样式指南

- 所有样式都应该放在组件目录下的 `.scss` 文件中
- 使用 BEM 命名规范来避免样式冲突
- 组件的根类名应该与组件名一致（例如 `.k-button`）
- 在组件中通过 `@import './k-组件名.scss';` 引入样式
- 为了支持按需导入，每个组件都应该有一个 `style.ts` 文件

## 按需导入样式

用户可以通过以下方式导入组件样式：

```js
// 导入组件
import { KButton } from 'kd-elp';

// 方式1: 导入所有样式
import 'kd-elp/style';

// 方式2: 只导入特定组件的样式
import 'kd-elp/components/k-button/style';
```

## 测试指南

- 每个组件都应该有对应的测试文件
- 测试应该覆盖组件的主要功能和边界情况
- 使用 Vitest 和 Vue Test Utils 进行测试
- 测试文件命名应该遵循 `k-组件名.test.ts` 的格式
