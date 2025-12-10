---
title: 快速开始
---


## 安装

Yun-Elp 作为一个二开的业务组件库，考虑到它的使用场景是在更加具体的实际项目中，因此它依赖了 vue、elemtn-plus、@element-plus/icon、lodash-es、vueuse、echarts等常用的基础库，及其他的一些业务中经常用到的依赖。

在现代成熟的前端工程下，基于 tree-shaking 的优化，这些依赖不会对项目产生太大的影响。

推荐使用 pnpm 作为项目的包管理器。

```shell
# 安装必要依赖
pnpm add yun-elp vue@^3.5.14 element-plus@^2.11.9 @element-plus/icons-vue@^2.3.2 lodash-es@^4.17.21

# 安装可选依赖，根据所使用的组件而定
pnpm add cron-parser@^5.3.1 echarts@^6.0.0
```

## 导入

### 按需导入（推荐）

与 element-plus 一起使用按需导入，这是现在主流的方式。

首先需要安装两个插件：

```shell
pnpm add -D unplugin-vue-components unplugin-auto-import
```

然后在 Vite 的配置文件中增加如下配置：

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from 'yun-elp/resolver';

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      dts: 'types/auto-imports.d.ts',
      resolvers: [
        ElementPlusResolver(),
      ],
      imports: ['vue'],
    }),
    Components({
      dts: 'types/components.d.ts',
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        // yun-elp的自动导出解析器
        YunElpResolver({
          importStyle: 'scss',
        }),
      ],
    }),
  ],
  css:{
    preprocessorOptions: {
      scss: {
        // 添加主题样式文件，内置了kd主题样式
        additionalData: '@use "yun-elp/themes/kd.scss" as *;',
      },
    },
  }
});
```

### 全量导入

如果不在意构建后的体积，也可以使用全量导入的方式

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
import App from './App.vue';

const app = createApp(App);
app.use(YunElp);
```

### 其他导入方式

暂时不支持浏览器直接导入，因为没有使用场景，所以未构建 cjs 文件

## IDE 配置

yun-elp提供了 web-types.json、tags.json、global.d.ts 文件，主要用于提升 IDE（如 VS Code、WebStorm 等）的开发体验，包括组件自动补全、类型提示、属性/事件智能感知等。

### global.d.ts

TypeScript 全局类型声明文件，提供组件库的全局类型定义，例如组件的 Props、Emits、Slots 等接口，支持 TypeScript 的静态类型检查。

安装组件库后，IDE 中的 TypeScript 会自动从 node_modules 加载全局类型，无需额外配置

如果是 monorepo 或复杂项目，在 tsconfig.json 的 compilerOptions 中添加：

```
{
  "compilerOptions": {
    "types": ["your-elp/global"]
  }
}
```

### tags.json

Vue 标签定义文件，用于 Vue 模板的标签和属性提示，主要针对 VS Code 的 Vetur 插件，提供组件的自定义数据（如 props、events 的描述和默认值）。它类似于 VS Code 的自定义数据协议，帮助在 `<template>` 中获得更精确的补全

**VS Code + Vetur 插件（适用于 Vue 2/3，但推荐切换到 Volar）**

（1）安装 Vetur 插件（octref.vetur）

（2）在 VS Code 设置（settings.json）中添加：
```json
{
  "vetur.validation.template.templateMode": "vetur",
  "vetur.completion.tagCasing": "kebab",
  "emmet.includeLanguages": {
    "vue": "html"
  },
  "vetur.validation.script": false  // 如果使用 TS，关闭 JS 验证
}
```
（3）Vetur 会自动从 node_modules 加载 tags.json。如果未自动加载，手动在 settings.json 中指定：
```json
{
  "vetur.validation.template.customTemplates": "${workspaceFolder}/node_modules/your-elp-lib/tags.json"
}
```

**VS Code + Volar 插件（推荐，Vue 3 官方）**

Volar 不直接使用 tags.json，而依赖 TS 类型，即 global.d.ts。

但如果需要额外模板提示，可以通过 Volar 的自定义数据配置间接支持

``` json
{
  "volar.completion.preferredTagNameCase": "kebab",
  "typescript.suggest.autoImports": true
}
```

### web-types.json

Web 类型定义文件，专为 JetBrains IDE（如 WebStorm、PhpStorm、IntelliJ IDEA）设计的文件，提供 Vue 组件的元数据，包括 props、slots、events 的类型、描述和文档链接。安装后，能在这些 IDE 中实现组件的智能补全和跳转定义。

WebStorm 默认已经安装了 Vue.js 插件，安装组件库后，IDE会自动从 node_modules 扫描 web-types.json
