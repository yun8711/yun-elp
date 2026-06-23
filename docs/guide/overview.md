---
title: 总览
---

# 总览

## 项目定位

yun-elp 是一个基于 Element Plus 的 Vue 3 业务组件库。

它不是 Element Plus 的替代品，而是在其基础上补充更贴近业务场景的封装组件、统一样式和全局配置能力，降低页面搭建与重复封装成本。

## 当前技术栈

- Vue 3.5+
- TypeScript 5+
- Element Plus 2.14+
- Vite 8
- Sass
- Vitest
- VitePress
- pnpm workspace monorepo

## 仓库组成

当前仓库主要由以下子包组成：

- `packages/components`：组件源码、hooks、locale、测试
- `packages/elp`：最终对外发布的 npm 包元数据
- `packages/resolver`：`unplugin-vue-components` 解析器
- `packages/theme-chalk`：组件样式与内置主题
- `packages/mcp-server`：`yun-elp-mcp` 服务包
- `docs`：文档站
- `play`：本地调试示例项目

## 兼容范围

当前发布包 `yun-elp` 的基础依赖范围如下：

- Vue：`^3.5.34`
- Element Plus：`^2.14.0`
- Vue Router：`^4.5.0 || ^5.0.0`
- lodash-es：`^4.17.21`

可选依赖：

- `cron-parser`：`y-cron-picker` 等场景需要
- `echarts`：`y-echarts` 组件需要

## 工程约束

- Node.js：`>= 18`
- 包管理器：推荐 `pnpm 10+`
- 发布产物：根包构建后输出到 `dist/`
- 文档 AI 资源：由 `pnpm docs:ai` 生成到 `docs/public/`

## 质量保障

仓库为 `packages/components` 维护了类型检查、单元测试和覆盖率脚本：

- `pnpm typecheck`
- `pnpm test`
- `pnpm lint`

如果你在参与开发，建议至少在提交前执行一次 `pnpm typecheck` 与 `pnpm test`。
