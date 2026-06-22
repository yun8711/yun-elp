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
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建文档
pnpm build:docs
```

### 发布

项目采用严格的发布流程确保版本质量：

```bash
# 发布前完整检查（推荐）
pnpm pre-release

# 发布新版本（会自动触发CI/CD发布到npm）
pnpm release
```

发布前会自动进行：

- 代码规范检查
- 单元测试
- 构建验证
- 版本一致性检查

详细的发布流程请参考 [RELEASE_PROCESS.md](./RELEASE_PROCESS.md)

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
