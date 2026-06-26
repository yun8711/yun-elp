---
title: 命名空间
---

# 命名空间

## 适用场景

当你的业务项目已经存在其他 UI 库，或者主应用里还有一套 `element-ui` / `element-plus` 样式时，默认的 `.el-*`、`.y-*`、`--el-*`、`--y-*` 可能发生冲突。

这时可以把 `yun-elp` 和 Element Plus 一起切换到自定义 namespace。

## 先看结论

- 预编译 `css` 成品包只支持默认前缀：Element Plus 为 `el`，yun-elp 为 `y`
- 只有 `scss` 源码接入模式支持自定义 namespace
- `elpConfig.namespace` 控制 Element Plus 的类名和 CSS 变量前缀
- `yNamespace` 控制 yun-elp 的类名和 CSS 变量前缀
- 宿主项目自己的 Element Plus 组件，也必须使用同一套 Element Plus namespace

## 接入方式

### 1. 设置 `YAppWrap`

```vue
<script setup lang="ts">
import { ref } from 'vue';

const locale = ref<'zh-cn' | 'en' | 'ja' | 'ar'>('zh-cn');
const elementNamespace = 'ep';
const yNamespace = 'yp';
</script>

<template>
  <y-app-wrap
    :locale="locale"
    direction="auto"
    :elp-config="{ namespace: elementNamespace }"
    :y-namespace="yNamespace">
    <router-view />
  </y-app-wrap>
</template>
```

`YAppWrap` 内部已经封装了 `el-config-provider`。如果你的 Element Plus 组件都位于 `YAppWrap` 内部，这种写法就够了，不需要额外再包一层外部 `el-config-provider`。

### 2. 在 Sass 编译期注入 namespace

```ts
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from 'yun-elp/resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }),
        YunElpResolver({ importStyle: 'scss', importElementStyle: 'sass' })
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "element-plus/theme-chalk/src/mixins/config.scss" as element-config with ($namespace: "ep");
          @use "yun-elp/theme-chalk/src/mixins/config.scss" as yun-config with ($namespace: "yp");
        `
      }
    }
  }
});
```

## 注意事项

### 宿主项目外层也用了 Element Plus 组件

如果你的应用壳层、布局组件或其他页面结构里，还有一些 Element Plus 组件位于 `YAppWrap` 之外，那么宿主项目也要额外提供一层外部 `el-config-provider`：

```vue
<template>
  <el-config-provider :locale="elLocale" :namespace="elementNamespace">
    <layout-shell>
      <y-app-wrap
        :locale="locale"
        :elp-config="{ locale: elLocale, namespace: elementNamespace }"
        :y-namespace="yNamespace">
        <router-view />
      </y-app-wrap>
    </layout-shell>
  </el-config-provider>
</template>
```

这里的外层 `el-config-provider` 不是给 `YAppWrap` 重复配置，而是为了覆盖 `YAppWrap` 外部的 Element Plus 组件。
