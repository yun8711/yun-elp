---
title: 快速开始
---

## 兼容性

保持与 [Element Plus](https://element-plus.org/zh-CN/guide/installation#%E5%85%BC%E5%AE%B9%E6%80%A7) 一致

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

## 自动按需导入（推荐）

需要使用额外的插件来自动导入要使用的组件

```shell
pnpm add -D unplugin-vue-components unplugin-auto-import
```

然后在 Vite 的配置文件中增加如下配置：

### Vite

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
        // 添加kd主题样式文件
        additionalData: `@use "yun-elp/themes/kd.scss" as *;`,
      },
    },
  }
});
```

## Volar 支持

如果使用 Volar，请在 tsconfig.json 中通过 compilerOptions.type 指定全局组件类型。

```json
{
  "compilerOptions": {
    "types": ["yun-elp/global.d.ts"]
  }
}
```
