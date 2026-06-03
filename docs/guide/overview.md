---
title: 总览
---

# 总览

## 项目背景

Yun-Elp 组件库是一个基于 Vue 3 的业务组件库，通过总结日常业务中常见需求，并参考其他优秀组件库，在 Element Plus 基础上进行二次封装，在保持UI一致的基础上，减少重复开发，专注于快速实现业务需求。

## 技术栈

- **框架**: Vue 3.5+
- **组件库**: Element Plus 2.11.9+
- **语言**: TypeScript 5+
- **CSS框架**：scss
- **构建工具**: Vite 7+
- **包管理器**: pnpm 9+
- **代码规范**: ESLint、Stylelint、prettier、Commitlint等

## 许可证

本项目采用 MIT 许可证

## 质量保障

组件库使用 Vitest 对各 Vue 组件（`packages/components/src/**/*.vue`）维护单元测试，当前覆盖率如下（执行 `pnpm test:coverage` 可查看最新报告）：

| 指标 | 覆盖率 |
| --- | --- |
| 语句（Statements） | 94.61% |
| 行（Lines） | 95.02% |
| 分支（Branches） | 84.47% |
| 函数（Functions） | 91.62% |

测试编写与运行说明见 [开发流程](./development) 及 `packages/components/TEST.md`。
