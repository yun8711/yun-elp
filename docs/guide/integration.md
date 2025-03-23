# 自动导入集成指南

本指南介绍如何在您的项目中使用自动导入功能，以简化组件和工具函数的使用。

## 安装插件

首先，您需要安装以下两个插件：

```bash
# npm
npm install -D unplugin-vue-components unplugin-auto-import

# yarn
yarn add -D unplugin-vue-components unplugin-auto-import

# pnpm
pnpm add -D unplugin-vue-components unplugin-auto-import
```

## Vite 配置

在您的 `vite.config.ts` 文件中添加以下配置：

```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { KdElpResolver, KdElpAutoImportResolver } from 'kd-elp/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入组件
    Components({
      resolvers: [KdElpResolver()],
      // 可选：指定组件的搜索目录和生成的类型文件的位置
      dts: 'src/components.d.ts'
    }),
    // 自动导入工具函数
    AutoImport({
      resolvers: [KdElpAutoImportResolver()],
      // 可选：指定生成的类型文件的位置
      dts: 'src/auto-imports.d.ts'
    })
  ]
});
```

## 样式按需自动导入

使用 `KdElpResolver` 的一个重要优势是，它不仅会自动导入组件，还会自动导入组件所需的样式。

这意味着您可以：

1. 在模板中直接使用 KdElp 组件，无需手动导入组件
2. **无需手动导入样式文件**，样式会随组件自动按需导入

例如，当您在模板中使用 `<KButton>` 时，解析器会：

- 自动导入 `KButton` 组件
- 自动导入 `KButton` 所需的样式，而不是导入整个组件库的样式

这样可以有效减小最终的打包体积。

## Webpack 配置

如果您使用 webpack，可以按照以下方式配置：

```js
const { KdElpResolver, KdElpAutoImportResolver } = require('kd-elp/resolvers');
const Components = require('unplugin-vue-components/webpack');
const AutoImport = require('unplugin-auto-import/webpack');

module.exports = {
  // ...其他配置
  plugins: [
    Components({
      resolvers: [KdElpResolver()]
    }),
    AutoImport({
      resolvers: [KdElpAutoImportResolver()]
    })
  ]
};
```

## 自定义工具函数配置

您可以指定要自动导入的工具函数：

```ts
// 导入所有工具函数（默认行为）
KdElpAutoImportResolver();

// 仅导入指定的工具函数
KdElpAutoImportResolver({
  utils: ['formatDate', 'formatNumber']
});
```

## 使用自动导入

配置完成后，您可以在组件中直接使用 KdElp 的组件和工具函数，无需手动导入：

```vue
<template>
  <!-- 直接使用组件，无需导入 -->
  <KButton type="primary">自动导入的按钮</KButton>
</template>

<script setup>
// 工具函数会被自动导入，无需手动 import
const formattedDate = formatDate(new Date(), 'YYYY-MM-DD');
</script>
```

## 类型支持

自动导入插件会自动生成类型声明文件，确保在 TypeScript 项目中有完整的类型支持和代码提示。组件属性和事件也将得到正确的类型检查。
