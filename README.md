# YUN-ELP 组件库

基于 Element Plus 的业务组件库，采用 Vue 3.5+、TypeScript、Vite 8 构建。

## 特性

- 基于 Element Plus 进行二次封装
- 提供一致的设计语言和交互体验
- 全面的 TypeScript 支持
- 组件和工具函数集成
- Web Types 支持，提供 IDE 自动完成
- 支持按需加载，减小打包体积
- 支持 unplugin-vue-components 和 unplugin-auto-import 自动导入
- 自定义主题，支持运行时动态切换
- 国际化支持，默认中文，可配置其他语言

## 安装

```bash
# 使用 npm
npm install yun-elp element-plus vue

# 使用 yarn
yarn add yun-elp element-plus vue

# 使用 pnpm
pnpm add yun-elp element-plus vue
```

## 兼容策略

YUN-ELP 基于 Element Plus 二次封装，采用单线维护策略，仅维护当前最新版本。

当前版本要求：

- Vue: ^3.5.0
- Element Plus: ^2.14.0

组件库通过 peerDependencies 声明基础库版本范围，使用方需要自行安装兼容版本的 Vue 与 Element Plus。

## 使用方法

见[文档](https://yun8711.github.io/yun-elp/guide/overview)

## 开发指南

### 安装依赖

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 开发

```bash
# 启动组件调试项目
pnpm dev

# 启动文档站点
pnpm docs:dev

# 新增组件
pnpm create

# 测试
pnpm test
```

### 构建

```bash
# 构建所有包
pnpm build
```

### 发布

组件库发布到 npm 的入口是 `dist/` 目录，版本号以根目录 `package.json` 为准，经 `release` 同步到 `packages/elp`、`packages/mcp-server`，再由 `build` 复制到 `dist/package.json`。

`pre-release` 会执行 lint 并可能自动修复格式，因此应放在 `release` **之前**，避免升版本后又产生额外的格式提交。

#### 标准流程

```bash
# 1. 发版前质量检查（lint + 单元测试）
pnpm pre-release
# 在 `pre-release` 基础上附加依赖 audit（失败仅警告）
pnpm pre-release:full

# 2. 如有 lint 等变更，先提交
pnpm commit

# 3. 升级版本、生成 CHANGELOG、打 tag 并推送（不自动发 npm）
pnpm release

# 4. 构建 dist 并校验版本
pnpm pre-publish

# 5. 发布到 npm
pnpm publish
```

`release-it` 配置为 `npm.publish: false`，**不会**自动发布到 npm，需手动执行 `pnpm publish`。

#### 发布前要求

- 在 `main` 分支执行 `pnpm release`（见 `release-it.config.cjs`）
- 自上个 tag 以来已有新的 commit（不允许空发版）
- 发布 npm 前确保已登录：`npm login --registry=https://registry.npmjs.org/`

### MCP 包（`yun-elp-mcp`）

MCP 服务包位于 `packages/mcp-server/`，npm 包名为 **`yun-elp-mcp`**。版本号与主包一致，由 `pnpm release` 通过 `scripts/sync-version.ts` 自动同步到 `packages/mcp-server/package.json`。

npm 发布与主包**分开**执行（主包走 `dist/`，MCP 走子包自身），但版本号始终跟随根目录。若本次不重新执行 `pnpm release`，发 MCP 前需确认 `packages/mcp-server/package.json` 的 `version` 已与根目录一致，必要时先执行 `pnpm sync-version` 并提交变更。

文档站 AI 资源（`pnpm docs:ai` → `docs/public/llms.txt` 等）与 MCP 数据是两条链路；更新组件文档后，若希望 Cursor 等 IDE 通过 MCP 查到最新 API，需单独执行下面的 MCP 发布流程。

#### 发布流程

```bash
# 前置1. 先完成主包版本升级；如果主包刚发版则不需要重复执行
pnpm release

# 前置2. 主包构建（extract 依赖 dist/web-types.json）
pnpm build

# 1. 从 docs/components/*/index.md 组件文档抽取 MCP 元数据与示例
pnpm mcp:extract

# 2. 本地验证（可选）
pnpm mcp:test

# 3. 提交版本同步与 extract 产物（src/metadata/components.ts、src/examples/*）
pnpm commit

# 4. 发布到 npm（子包 prepublishOnly 会自动 build）
pnpm mcp:publish
```

#### 注意事项

- MCP 版本**跟随主包**，无需手动改 `packages/mcp-server/package.json` 的 `version`
- 发 MCP 前应先完成 `pnpm release`，确保 npm 上主包与 MCP 版本一致
- `extract` **不会**在 `publish` 时自动执行，文档变更后必须先 `extract` 并提交，再发版
- `pnpm mcp:publish` 只负责发布 `yun-elp-mcp` 子包，不会重新执行 `pnpm release`
- 发布前需已登录 npm：`npm login --registry=https://registry.npmjs.org/`
- 新增组件后若 MCP 查不到，通常是漏跑 `extract` 或未 commit 抽取产物

### 代码规范

项目使用以下工具进行代码规范：

- ESLint：代码质量检查
- Prettier：代码格式化
- StyleLint：样式代码规范
- CommitLint：Git 提交信息规范

```bash
# 运行代码检查
pnpm lint

# 提交代码（会自动运行 commitlint）
pnpm commit
```

## 许可证

MIT
