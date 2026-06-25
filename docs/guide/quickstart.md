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

安装：

```shell
pnpm add -D unplugin-vue-components unplugin-auto-import unplugin-element-plus
```

`vite.config.ts` 示例：

```ts
import { defineConfig } from 'vite';
import ElementPlus from 'unplugin-element-plus/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from 'yun-elp/resolver';

export default defineConfig({
  plugins: [
    ElementPlus({ useSource: true }),
    AutoImport({
      imports: ['vue'],
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
        YunElpResolver({
          importStyle: 'scss',
          importElementStyle: 'sass',
        }),
      ],
    }),
  ],
});
```

`main.ts` 中全局引入主题（仅一次）：

```ts
import 'yun-elp/themes/kd.scss';
```

配置项：

- `importElementStyle` 与 `ElementPlusResolver.importStyle` 保持一致
- `importStyle: false` / `importElementStyles: false` 可分别关闭 yun-elp / EP 样式
- 业务页使用 `<el-input>` 自动导入，避免 `import` + `markRaw(ElInput)`
- 命名空间见[命名空间](./namespace)

## 全量导入

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
import App from './App.vue';

createApp(App).use(YunElp).mount('#app');
```

如果你使用的是自动导入 + `scss` 源码样式，在应用入口引入：

```ts
import 'yun-elp/themes/kd.scss';
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
