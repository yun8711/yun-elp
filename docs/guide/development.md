---
title: 开发流程
---

# 开发流程

## 环境准备

- Node.js `>= 18`
- 推荐 `pnpm 10+`
- 仓库使用 pnpm workspace，必须用 `pnpm` 安装依赖

安装依赖：

```shell
pnpm install
```

也可以使用根脚本：

```shell
pnpm bootstrap
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 `play` 调试项目 |
| `pnpm docs:dev` | 启动文档站，启动前自动生成 AI 文档资源 |
| `pnpm create` | 创建新组件模板 |
| `pnpm typecheck` | 检查组件、play、docs 的 TypeScript 类型 |
| `pnpm test` | 运行 `packages/components` 覆盖率测试 |
| `pnpm lint` | 运行格式、ESLint、Stylelint |
| `pnpm build` | 构建组件、样式、resolver、发布包元数据 |
| `pnpm commit` | 使用 `czg` 进行规范化提交 |

## 组件开发流程

### 1. 创建组件骨架

```shell
pnpm create
```

脚本会生成组件源码、样式、测试、文档和示例文件。

### 2. 本地调试

启动调试项目：

```shell
pnpm dev
```

`play/` 是当前仓库的本地示例项目，用于联调组件效果与交互。

### 3. 编写文档与示例

- 组件文档位于 `docs/components/<component>/index.md`
- 示例通常与文档一起维护
- 如果你改了组件能力，文档和示例也要同步更新

### 4. 运行验证

至少建议执行：

```shell
pnpm typecheck
pnpm test
```

如果修改了样式、导出或构建链路，再执行：

```shell
pnpm build
```

### 5. 提交代码

```shell
pnpm commit
```

仓库使用 `czg` / `commitlint` 维护提交规范。

## 发布相关

主包发布前常用流程：

```shell
pnpm pre-release
pnpm commit
pnpm release
pnpm pre-publish
pnpm publish
```

如果本次变更涉及 MCP 数据，还需要：

```shell
pnpm mcp:extract
pnpm mcp:test
pnpm mcp:publish
```

说明：

- `pnpm release` 负责升版本、生成 changelog、打 tag
- `pnpm publish` 发布主包 `yun-elp`
- `pnpm mcp:publish` 只发布 `yun-elp-mcp`
