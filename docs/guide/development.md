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

## 常用命令

| 命令             | 说明                                      |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | 启动 `play` 调试项目                      |
| `pnpm docs:dev`  | 启动文档站，启动前自动生成 AI 文档资源    |
| `pnpm create`    | 创建新组件模板                            |
| `pnpm typecheck` | 检查组件、play、docs 的 TypeScript 类型   |
| `pnpm test`      | 运行 `packages/components` 覆盖率测试     |
| `pnpm lint`      | 全仓 ESLint、Stylelint、Prettier 自动修复 |
| `pnpm build`     | 构建组件、样式、resolver、发布包元数据    |
| `pnpm commit`    | 使用 `czg` 进行规范化提交                 |

## 组件开发流程

### 1. 创建组件骨架

```shell
pnpm create
```

脚本会生成组件源码、样式、测试、文档和示例文件。

生成出来的组件骨架已经默认接入 namespace helper：

- Vue 组件默认使用 `useNamespace('<component-name>')`
- SCSS 默认使用 `y-class()` 等 Sass helper
- 基础测试会覆盖自定义 `yNamespace` 场景

这部分不要再回退成写死的 `.y-*`、`--el-*` 字符串；如果需要详细说明，见[命名空间](./namespace)。

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
pnpm lint        # 可选：全仓自动修复
pnpm commit
```

`git commit` 时 husky 会对**暂存文件**执行 `lint-staged`（ESLint / Stylelint / Prettier 自动修复并重新暂存）。`publish:check` 仅检查组件库源码包，不含 `play`、`docs`、`mcp-server`。

仓库使用 `czg` / `commitlint` 维护提交规范。

## 发布相关

发布流程按 `publish:*` 命令分步执行。**发布到 npm 需在本机终端人工执行**，npm 开启 2FA 时需传入 `--otp`（每次发布各需一次 OTP）。

主包与 MCP 包分开处理：先完成主包发版与发布；MCP 的 `extract` 会产生 `components.ts` 等变更，**单独 commit 后再发布 MCP**。

### 主包

在 `main` 分支上，按顺序执行：

```shell
pnpm publish:check                      # 1. 质量检查
pnpm commit                             # 2. 提交待发版变更（如有）
pnpm publish:release                    # 3. 升版本、CHANGELOG、tag 并推送
pnpm publish:build                      # 4. 构建 dist 并校验产物
pnpm publish:main -- --otp=123456       # 5. 人工发布 yun-elp
```

未传 `--otp` 时 npm 会交互式提示；也可设置 `NPM_OTP=123456`。

### MCP 包

主包 `publish:build` 完成后（已生成 `dist/web-types.json`），按需执行：

```shell
pnpm publish:mcp:sync                   # 1. extract + test（可能改动 components.ts）
pnpm commit                             # 2. 若有变更，单独提交 MCP 元数据
pnpm publish:mcp -- --otp=123456        # 3. 人工发布 yun-elp-mcp（发布前自动 build）
```

若本次发版未改组件文档或 API，可跳过 MCP 流程。日常维护 MCP 时仍可使用 `pnpm mcp:extract`、`pnpm mcp:test`、`pnpm mcp:build`。

### 命令说明

| 命令                    | 说明                                         |
| ----------------------- | -------------------------------------------- |
| `pnpm publish:check`    | 发版前质量检查（lint / typecheck / 测试）    |
| `pnpm publish:release`  | 升版本、写 CHANGELOG、打 tag；要求工作区干净 |
| `pnpm publish:build`    | 构建主包 `dist` 并校验版本与产物             |
| `pnpm publish:main`     | 人工发布主包；支持 `-- --otp=xxxxxx`         |
| `pnpm publish:mcp:sync` | 从文档与 `web-types` 抽取 MCP 元数据并测试   |
| `pnpm publish:mcp`      | 人工发布 MCP 包；支持 `-- --otp=xxxxxx`      |
