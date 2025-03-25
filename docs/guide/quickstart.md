---
title: 快速开始
---

<h1>快速开始</h1>

## 完整引入

如果你对打包后的文件大小不是很在乎，那么使用完整导入会更方便。

```ts
// main.ts
import { createApp } from 'vue';
import KdElp from 'element-plus';
import 'kd-elp/style';
import App from './App.vue';

const app = createApp(App);

app.use(KdElp);
app.mount('#app');
```

## 按需引入（推荐）

需要使用额外的插件来自动导入要使用的组件

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

然后在 Vite 或 Webpack（待测试） 的配置文件中增加如下配置：

### Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { KdElpResolver } from 'kd-elp';

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      dts: 'types/auto-imports.d.ts',
      resolvers: [
        // 自动导入element相关函数，如：ElMessage, ElMessageBox..
        ElementPlusResolver(),
      ],
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],
    }),
    Components({
      dts: 'types/components.d.ts',
      // 自动导入组件库
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
        // kd-elp的自动导出解析器
        KdElpResolver(),
      ],
    }),
  ],
});
```

### Webpack（待测试）

## Volar 支持

如果您使用 Volar，请在 tsconfig.json 中通过 compilerOptions.type 指定全局组件类型。

```json
{
  "compilerOptions": {
    "types": ["kd-elp/global.d.ts"]
  }
}
```
