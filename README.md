# KD-ELP 组件库

基于 Element Plus 的业务组件库，采用 Vue 3.5+、TypeScript、Vite 5 和 SCSS 构建。

## 特性

- 基于 Element Plus 进行二次封装
- 提供一致的设计语言和交互体验
- 全面的 TypeScript 支持
- 组件和工具函数集成
- Web Types 支持，提供 IDE 自动完成

## 项目结构

```
kd-elp/
├── packages/               # 子包目录
│   ├── components/         # 组件库
│   └── utils/              # 工具库
├── docs/                   # 文档站点 (VitePress)
├── play/                   # 组件调试项目
├── package.json            # 工作区配置
└── pnpm-workspace.yaml     # PNPM 工作区配置
```

## 快速开始

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
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建文档
pnpm docs:build
```

## 开发规范

- 所有组件以 `k-` 开头
- 使用 ESLint、Prettier、StyleLint 规范代码
- 使用 Git Commit 规范提交代码
- 遵循 Element Plus 的设计风格

## 许可证

MIT
