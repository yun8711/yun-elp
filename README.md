# YUN-ELP 组件库

基于 Element Plus 的业务组件库，采用 Vue 3.5+、TypeScript、Vite 5 和 SCSS 构建。

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

## 使用方法

### 完整引入

```js
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(YunElp);
app.mount('#app');
```

### 按需引入

```js
import { createApp } from 'vue';
import { YButton } from 'yun-elp';
import 'yun-elp/style';
import App from './App.vue';

const app = createApp(App);
app.component('y-button', YButton);
app.mount('#app');
```

### 自动导入（推荐）

利用 unplugin-vue-components 和 unplugin-auto-import 插件可以实现组件和API的自动导入：

```js
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { YunElpResolver, YunElpAutoImportResolver } from 'yun-elp/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [YunElpResolver()] // 自动导入组件和组件样式
    }),
    AutoImport({
      resolvers: [YunElpAutoImportResolver()] // 自动导入工具函数
    })
  ]
});
```

配置后可以直接使用组件和工具函数，无需导入任何内容:

```vue
<template>
  <!-- 组件和样式会被自动导入 -->
  <YButton type="primary">按钮</YButton>
</template>

<script setup>
// formatDate 函数会被自动导入
const now = formatDate(new Date(), 'YYYY-MM-DD');
</script>
```

### 主题定制

YUN-ELP 组件库内置了自定义主题，覆盖了 Element Plus 默认样式，并支持运行时动态修改：

```js
import { createApp } from 'vue';
import YunElp, { applyTheme } from 'yun-elp';
import 'yun-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(YunElp);

// 运行时自定义主题
applyTheme({
  primary: '#1677ff', // 修改主色调
  borderRadius: '6px', // 修改圆角
  fontSizeBase: '16px' // 修改基础字体大小
});

app.mount('#app');
```

## 项目结构

```
yun-elp/
├── packages/               # 子包目录
│   ├── components/         # 组件库
│   ├── resolver/          # 自动导入解析器
│   └── theme-chalk/       # 主题样式
├── docs/                   # 文档站点
├── play/                   # 组件调试项目
├── scripts/               # 构建脚本
├── package.json           # 工作区配置
└── pnpm-workspace.yaml    # PNPM 工作区配置
```

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
