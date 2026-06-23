---
title: 快速开始
---

# 快速开始

## 安装

`yun-elp` 发布包当前通过 `peerDependencies` 要求使用方自行安装基础依赖，推荐直接安装下面这一组：

```shell
pnpm add yun-elp vue@^3.5.34 element-plus@^2.14.0 vue-router@^5 lodash-es@^4.17.21
```

说明：

- `vue-router` 的兼容范围是 `^4.5.0 || ^5.0.0`
- 新项目推荐直接使用最新主线 `5.x`
- 已在使用 Vue Router 4 的项目，只要版本在 `4.5+`，也可以继续接入

按需安装可选依赖：

```shell
pnpm add cron-parser echarts
```

- 使用 `y-cron-picker` 时需要 `cron-parser`
- 使用 `y-echarts` 时需要 `echarts`

## 按需导入（推荐）

推荐配合 `unplugin-vue-components` 使用 `yun-elp/resolver` 自动导入组件与样式。

先安装插件：

```shell
pnpm add -D unplugin-vue-components unplugin-auto-import
```

`vite.config.ts` 示例：

```ts
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from 'yun-elp/resolver';

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        YunElpResolver({
          importStyle: 'scss',
        }),
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "yun-elp/themes/kd.scss" as *;',
      },
    },
  },
});
```

说明：

- `YunElpResolver({ importStyle: 'scss' })` 会自动引入 `yun-elp/theme-chalk/src/*.scss`
- `YAppWrap`、`YButton`、`YGroupSelect` 这类组件不会通过 resolver 自动附带样式文件
- 如果不需要自动注入样式，可以把 `importStyle` 设为 `false`

## 全量导入

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
import App from './App.vue';

createApp(App).use(YunElp).mount('#app');
```

## 一个最小示例

```vue
<script setup lang="ts">
import { reactive } from 'vue';

const formModel = reactive({
  name: '',
});
</script>

<template>
  <y-form :model="formModel">
    <y-form-item label="名称" prop="name">
      <el-input v-model="formModel.name" />
    </y-form-item>
    <y-button type="primary">提交</y-button>
  </y-form>
</template>
```

## IDE 配置

`yun-elp` 发布包内包含以下 IDE 辅助文件：

- `global.d.ts`
- `web-types.json`
- `tags.json`

通常安装后即可被 IDE 自动识别；如果是复杂 monorepo，也可以在 `tsconfig.json` 中显式补充：

```json
{
  "compilerOptions": {
    "types": ["yun-elp/global"]
  }
}
```

推荐使用 Volar + TypeScript Vue Plugin 获得最佳体验。
