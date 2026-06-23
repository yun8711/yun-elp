---
title: 设计
---

# 设计

## 设计目标

yun-elp 的目标不是重新造一套基础组件，而是在 Element Plus 之上沉淀一层更适合业务系统复用的封装。

核心原则：

- 优先复用 Element Plus 的成熟能力
- 只对高频业务场景做明确封装
- 保持类型、文档、示例、测试同步维护
- 保持发布产物、文档站、AI 资源与 MCP 数据同源

## 当前仓库结构

项目采用 pnpm workspace monorepo，当前主要目录如下：

```text
.
├── docs                     # VitePress 文档站
├── packages
│   ├── components           # 组件源码、hooks、locale、测试
│   ├── elp                  # 对外发布包 package.json 与 exports
│   ├── mcp-server           # yun-elp-mcp 服务包
│   ├── resolver             # unplugin-vue-components 解析器
│   └── theme-chalk          # 样式产物与主题入口
├── play                     # 本地调试项目
└── scripts                  # 构建、同步、生成脚本
```

## 包职责划分

### `packages/components`

- 存放 `Y*` 组件源码
- 提供 hooks、locale、utils
- 维护 Vitest 测试
- 作为构建时的核心源码输入

### `packages/elp`

- 定义最终 npm 包名 `yun-elp`
- 维护 `exports`、`peerDependencies`、`optionalDependencies`
- 构建时由脚本复制到 `dist/package.json`

### `packages/resolver`

- 提供 `YunElpResolver`
- 用于 `unplugin-vue-components` 自动解析 `Y*` 组件
- 可按配置注入 CSS 或 SCSS 样式副作用

### `packages/theme-chalk`

- 存放组件样式源码
- 产出 `dist/theme-chalk/*`
- 当前内置主题入口为 `themes/kd.scss`

### `packages/mcp-server`

- 提供独立 npm 包 `yun-elp-mcp`
- 读取组件元数据与示例，供 Cursor 等 MCP 客户端查询
- 与主包分开发版，但版本号保持同步

## 文档与 AI 资源同源策略

组件文档写在 `docs/components/*/index.md`，它们不只是面向人读：

- 文档站直接渲染这些内容
- `pnpm docs:ai` 会生成 `llms.txt`、`llms-full.txt`、`metadata/components.json`
- `pnpm mcp:extract` 会从组件文档与示例中抽取 MCP 所需数据

因此，新增或修改组件时，文档本身就是一等产物，而不是发布后的补充材料。
