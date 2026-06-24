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
  ]
};
```

如果项目使用 `scss` 源码样式，主题入口应单独全局引入一次：

```ts
import 'yun-elp/themes/kd.scss';
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

## 如何让 AI 获取这些资源

这些资源本身只是“可被读取”，AI 是否真的能用到，取决于你在本地使用的工具是否具备对应的接入方式。通常有两种方式：

### 方式一：通过网页资源读取

适用场景：

- 你使用的 AI 聊天工具或 IDE 插件支持联网读取网页
- 你希望 AI 先看文档索引、组件元数据，再生成代码
- 你不需要在 IDE 内通过 MCP 调工具

可直接提供给 AI 的资源地址：

- `https://yun8711.github.io/yun-elp/llms.txt`
- `https://yun8711.github.io/yun-elp/llms-full.txt`
- `https://yun8711.github.io/yun-elp/metadata/components.json`

推荐提示方式：

- “请先读取 yun-elp 的 `llms.txt`，再给我生成页面代码”
- “请先读取 `components.json`，确认 `y-table` 的 Props 和示例后再回答”

说明：

- `llms.txt` 适合先让 AI 建立整体认知
- `llms-full.txt` 适合需要更多组件摘要和 API 信息时使用
- `components.json` 适合需要结构化读取 Props、Events、Slots、Exposes 时使用

如果你使用的 AI 工具不支持联网，或者不会主动抓取这些 URL，仅把地址贴给它是无效的，这时应使用 MCP。

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

## 本地 IDE 需要做的配置

如果你希望本地 IDE 中的 AI 助手稳定读取 yun-elp 组件信息，至少需要完成下面几项配置。

### 1. 准备 Node.js 环境

- 项目开发环境建议 Node.js `>= 18`
- MCP 服务运行要求 Node.js `>= 20`
- 本机需要能执行 `npx`

如果本机 Node 版本低于 `20`，MCP 服务可能无法启动。

### 2. 在 IDE 中添加 MCP 服务

在支持 MCP 的 AI IDE 中，把下面这段配置加入 MCP server 配置：

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

适用说明：

- `command: "npx"`：通过 npm 临时执行 MCP 服务
- `args: ["-y", "yun-elp-mcp"]`：自动拉取并启动最新版本

一般可以在以下位置完成配置：

- IDE 的 MCP Servers / Tools / Integrations 配置界面
- IDE 对应的 MCP 配置文件

如果你的 IDE 已支持图形化添加 MCP Server，也可以直接填写：

- Name：`yun-elp`
- Command：`npx`
- Args：`-y yun-elp-mcp`

### 3. 让 AI 优先使用 MCP 查询组件信息

只配好 MCP 还不够，实际提问时最好明确告诉 AI 先查 yun-elp 组件数据，再生成代码。

推荐提问方式：

- “先用 yun-elp MCP 查一下 `y-table-search` 的 API，再帮我写页面”
- “请先搜索 yun-elp 里和表单布局相关的组件，再给出实现方案”
- “如果 yun-elp 没有对应能力，再退回 Element Plus 原生组件”

这样可以减少 AI 凭印象猜测 API 的情况。

### 4. 验证 MCP 是否生效

配置完成后，可以在 IDE 里直接测试以下问题：

- “列出所有 yun-elp 组件”
- “获取 `y-button` 的 API”
- “给我 `y-dialog` 的使用示例”

如果 AI 能返回组件列表、Props、Events、Slots、示例索引或示例源码，说明 MCP 已正常生效。

## 本地配置建议

如果你是在自己的业务项目中使用 yun-elp，建议把 AI 相关能力按下面的优先级接入：

1. IDE 支持 MCP：优先配置 `yun-elp-mcp`
2. AI 支持联网但不支持 MCP：让 AI 读取 `llms.txt` 或 `components.json`
3. 两者都不支持：手动把相关组件文档内容贴给 AI

推荐原因：

- MCP 最适合在 IDE 内做结构化查询
- `llms.txt` / `components.json` 更适合网页读取型 AI
- 单纯依赖模型记忆最不可靠，容易猜错组件 API
