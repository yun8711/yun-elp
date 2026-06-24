# AGENTS

## 目的

本仓库是 `yun-elp` 的 `pnpm workspace` 单仓项目，包含：

- `packages/components` 中的核心组件
- `packages/theme-chalk` 中的样式与主题
- `packages/resolver` 中的按需解析支持
- `play` 中的本地调试示例应用
- `docs` 中的文档站点
- `scripts` 中的构建与发布辅助脚本
- `packages/mcp-server` 中的 MCP 服务端资源

本文件作为在该仓库内工作的 coding agent 默认操作说明。

## 环境要求

- 只能使用 `pnpm`。仓库在 `preinstall` 中限制了其他包管理器。
- 仓库根环境要求 Node.js `>= 18`。
- `packages/mcp-server` 需要 Node.js `>= 20`。

## 仓库结构

- `packages/components/src/*`：组件源码目录
- `packages/components/hooks/*`：共享组合式 hooks，例如 `use-namespace`
- `packages/components/utils/*`：安装器辅助函数与通用工具
- `packages/components/components.ts`：组件导出聚合
- `packages/components/defaults.ts`：全量安装器入口
- `packages/theme-chalk/src/*`：组件样式与主题资源
- `play/src/examples/*`：本地人工验证示例
- `docs/components/*`：组件文档与示例
- `docs/guide/*`：项目说明文档
- `scripts/*`：组件脚手架、元数据生成等仓库自动化脚本
- `packages/mcp-server/src/*`：MCP 服务端实现

## 生成产物与派生产物

除非任务明确要求处理生成结果，否则不要把这些目录当作主要编辑目标：

- `dist/*`
- `docs/dist/*`
- `.coverage/*`
- `node_modules/*`
- `docs/.vitepress/.temp/*`
- `docs/.vitepress/cache/*`
- `.codegraph/*`

优先修改源码，再执行对应的构建或提取命令。

## 常用命令

- `pnpm install`：安装依赖
- `pnpm dev`：启动 `play` 本地调试项目
- `pnpm docs:dev`：启动文档站
- `pnpm create`：创建新组件骨架
- `pnpm typecheck`：执行工作区类型检查
- `pnpm test`：运行组件覆盖率测试
- `pnpm lint`：执行格式化、ESLint 和 Stylelint
- `pnpm lint:check`：只检查代码规范，不自动修复
- `pnpm build`：构建组件包与相关产物
- `pnpm mcp:extract`：从文档刷新 MCP 数据
- `pnpm mcp:test`：测试 MCP 服务

## 工作规则

- 如果修改了 `packages/components/src/*` 中的组件行为，需要同时检查这些位置是否也要更新：
  - `play/src/examples/*`
  - `docs/components/*`
  - `packages/theme-chalk/src/*` 中对应样式
  - `packages/components/src/index.ts`、`packages/components/components.ts` 或其他包入口导出
- 保持基于 namespace 的样式约定。新增或修改组件时，应继续使用 `useNamespace(...)` 一类 helper，不要回退为写死 `.y-*` 或 `--el-*` 字符串。
- 新增组件时，优先使用 `pnpm create`，不要手工完整搭建整套组件骨架。
- 如果改动涉及打包、安装器接线或导出链路，需要检查 `packages/components/defaults.ts`、`packages/components/index.ts` 以及相关构建脚本。
- 如果改动会影响面向 MCP 的文档数据，需要执行 `pnpm mcp:extract` 和 `pnpm mcp:test`。

## 验证要求

根据改动选择最小但合理的验证集合，不要跳过明显应做的检查：

- 组件逻辑或类型改动：`pnpm typecheck` 和 `pnpm test`
- 仅文档或 playground 改动：至少在可行时启动对应 dev 服务验证
- 样式、导出或构建链路改动：`pnpm build`
- MCP 服务改动：`pnpm mcp:test`

如果因为环境或限制无法执行某条命令，需要在交付说明中明确指出。

## CodeGraph 使用建议

这个项目适合使用 `codegraph`，因为它是一个多包的 TypeScript/Vue 仓库，内部存在共享 hooks、安装器工具、文档示例与调试示例之间的跨目录关联。

适合在本仓库中使用 `codegraph` 的场景包括：

- 追踪组件导出到安装器接线的链路
- 查找 `useNamespace` 等共享 hooks 的全部调用方
- 理解脚手架脚本与最终组件目录结构的对应关系
- 在修改共享工具前评估影响范围

推荐使用流程：

1. 在仓库根目录执行一次 `codegraph init`
2. 优先用 `codegraph_explore` 处理范围较大的问题
3. 需要查看具体符号实现时使用 `codegraph_node`
4. 重构共享 hooks 或安装器工具前使用 `codegraph_impact`

当前本地索引产物位于 `.codegraph/`，应保持未提交状态。
