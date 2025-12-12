---
title: 总览
---

# 主题定制

yun-elp 组件库默认提供了一套主题，提供了对主题色、辅助色等颜色体系，以及部分组件样式的修改。

## 默认主题

**按需导入时**，以 vite 配置文件中增加如下配置：

```ts
// vite.config.ts
export default defineConfig({
  // ...
  css:{
    preprocessorOptions: {
      scss: {
        // 添加主题样式文件
        additionalData: '@use "yun-elp/themes/kd.scss" as *;',
      },
    },
  }
});
```

**全量导入时**，在 main.ts 中导入：

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
// ...
```

## 自定义主题

可以参考yun-elp内置的 [kd主题文件](https://github.com/yun8711/yun-elp/blob/main/packages/theme-chalk/src/themes/kd.scss) 在项目中重新定义一份scss文件
