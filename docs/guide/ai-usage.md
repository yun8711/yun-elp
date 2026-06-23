---
title: AI 使用指南
description: 面向 AI 助手和代码生成工具的 yun-elp 使用约定
---

本页用于帮助 AI 助手、代码生成工具和 IDE 插件准确理解 yun-elp 的使用方式。

## 基础定位

yun-elp 是基于 Element Plus 的 Vue 3 业务组件库，不是 Element Plus 的替代品。生成代码时应优先复用 Element Plus 的基础能力，只在 yun-elp 提供明确业务封装的场景中使用 `y-` 前缀组件。

推荐技术栈：

- Vue 3.5+
- Element Plus 2.14+
- TypeScript 5+
- Vite 8+
- pnpm 10+

## 安装

```shell
pnpm add yun-elp vue element-plus vue-router lodash-es
```

可选依赖按需补充：

```shell
pnpm add cron-parser echarts
```

## 推荐导入方式

推荐使用自动导入，不要在每个业务页面手动导入组件。

```ts
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from 'yun-elp/resolver';

export default {
  plugins: [
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        }),
        YunElpResolver({
          importStyle: 'scss'
        })
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "yun-elp/themes/kd.scss" as *;'
      }
    }
  }
};
```

如果项目使用全量导入，应同时引入组件样式：

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
import App from './App.vue';

createApp(App).use(YunElp).mount('#app');
```

## 组件命名

模板中统一使用 `y-` 前缀标签：

```vue
<template>
  <y-button type="primary">提交</y-button>
  <y-form :model="formModel">
    <y-form-item label="名称" prop="name">
      <el-input v-model="formModel.name" />
    </y-form-item>
  </y-form>
</template>
```

在 TypeScript 中引用组件类型或组件对象时使用大驼峰名称，例如 `YButton`、`YForm`、`YFormItem`。

## 生成代码约定

- 使用 `y-` 组件前先确认组件文档中存在对应组件
- 不要猜测未在文档中声明的 yun-elp 私有属性、事件、插槽和暴露方法
- 未被 yun-elp 扩展的 Element Plus API，按 Element Plus 官方组件规则使用
- 需要业务封装时优先使用 yun-elp 组件，需要基础组件能力时继续使用 Element Plus 组件
- 示例代码应使用 `<script setup lang="ts">`，并提供完整的响应式数据结构
- 表单类组件优先使用 `y-form` + `y-form-item`，输入框、选择器等字段控件继续使用 Element Plus 原组件
- 若页面会使用 `y-page-header`、`y-column-op` 等依赖路由上下文的能力，应确保项目已安装并接入 `vue-router`

## AI 可读取资源

文档站发布后提供以下机器可读入口：

- `/llms.txt`：面向 AI 的核心文档入口索引
- `/llms-full.txt`：包含组件摘要和主要 API 的完整索引
- `/metadata/components.json`：组件元数据，包含组件名、标签、文档地址、示例、Props、Events、Slots、Exposes
- `/sitemap.xml`：站点页面索引
- `/robots.txt`：爬虫访问规则

`components.json` 由构建脚本根据 `docs/components/*/index.md` 自动生成，不需要手写维护。

## MCP

在 Cursor 等支持 MCP 的 AI IDE 中，推荐配置 `yun-elp-mcp` 获取组件信息。MCP 适合在生成代码前查询组件列表、组件 API 和示例代码。

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "npx",
      "args": ["-y", "yun-elp-mcp"]
    }
  }
}
```
