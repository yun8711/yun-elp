# KD-ELP 组件库

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
npm install kd-elp element-plus vue

# 使用 yarn
yarn add kd-elp element-plus vue

# 使用 pnpm
pnpm add kd-elp element-plus vue
```

## 使用方法

### 完整引入

```js
import { createApp } from 'vue';
import KdElp from 'kd-elp';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(KdElp);
app.mount('#app');
```

### 按需引入

```js
import { createApp } from 'vue';
import { KButton } from 'kd-elp';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);
app.component('k-button', KButton);
app.mount('#app');
```

### 单独使用工具函数

```js
import { formatDate } from 'kd-elp/utils';

const date = formatDate(new Date(), 'YYYY-MM-DD');
console.log(date);
```

### 按需导入

```js
// 导入组件
import { KButton } from 'kd-elp';

// 方式1: 导入所有样式
import 'kd-elp/style';

// 方式2: 只导入特定组件的样式
import 'kd-elp/components/k-button/style';
```

### 导入工具函数

```js
import { formatDate } from 'kd-elp/utils';
```

### 自动导入（推荐）

利用 unplugin-vue-components 和 unplugin-auto-import 插件可以实现组件和API的自动导入：

```js
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { KdElpResolver, KdElpAutoImportResolver } from 'kd-elp/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [KdElpResolver()] // 自动导入组件和组件样式
    }),
    AutoImport({
      resolvers: [KdElpAutoImportResolver()] // 自动导入工具函数
    })
  ]
});
```

配置后可以直接使用组件和工具函数，无需导入任何内容:

```vue
<template>
  <!-- 组件和样式会被自动导入 -->
  <KButton type="primary">按钮</KButton>
</template>

<script setup>
// formatDate 函数会被自动导入
const now = formatDate(new Date(), 'YYYY-MM-DD');
</script>
```

自动导入的优势：

1. 无需手动导入组件
2. 无需手动导入样式，样式会随组件自动导入
3. 只会导入用到的组件和样式，减小打包体积

更多详细配置请参考 [自动导入集成指南](docs/guide/integration.md)。

### 主题定制

KD-ELP 组件库内置了自定义主题，覆盖了 Element Plus 默认样式，并支持运行时动态修改：

```js
import { createApp } from 'vue';
import KdElp, { applyTheme } from 'kd-elp';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(KdElp);

// 运行时自定义主题
applyTheme({
  primary: '#1677ff', // 修改主色调
  borderRadius: '6px', // 修改圆角
  fontSizeBase: '16px' // 修改基础字体大小
});

app.mount('#app');
```

更多主题配置请参考 [主题定制指南](docs/guide/theme.md)。

### 国际化配置

KD-ELP 支持国际化，默认使用简体中文，可以配置为其他语言：

```js
import { createApp } from 'vue';
import KdElp, { KdElpConfigProvider } from 'kd-elp';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);
app.use(KdElp);
app.mount('#app');
```

使用英文：

```vue
<template>
  <kd-elp-config-provider locale="en-US">
    <App />
  </kd-elp-config-provider>
</template>

<script setup>
import { KdElpConfigProvider } from 'kd-elp';
import App from './App.vue';
</script>
```

更多国际化配置请参考 [国际化指南](docs/guide/i18n.md)。

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

## 开发指南

### 安装依赖

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build
```

### 开发组件

每个组件都有统一的目录结构，将组件代码和样式放在同一目录下：

```
packages/components/src/components/k-组件名/
├── index.ts                # 组件导出文件
├── k-组件名.vue            # 组件实现文件
├── k-组件名.scss           # 组件样式文件
├── style.ts                # 样式入口文件（用于按需导入）
└── k-组件名.test.ts        # 组件测试文件
```

详细的组件开发指南请参考 [组件开发指南](docs/guide/component-development.md)。

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
