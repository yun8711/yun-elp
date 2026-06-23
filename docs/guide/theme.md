---
title: 主题定制
---

# 主题定制

## 内置主题

当前仓库内置的主题文件为：

- `yun-elp/themes/kd.scss`

这是默认推荐接入的主题入口。

## 按需导入场景

在 Vite 的 SCSS 预处理配置中注入主题：

```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "yun-elp/themes/kd.scss" as *;',
      },
    },
  },
});
```

## 全量导入场景

```ts
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
```

## 自定义主题

如果内置 `kd` 主题不能满足你的项目需求，建议以仓库中的源文件为起点复制一份再调整：

- `packages/theme-chalk/src/themes/kd.scss`

建议做法：

1. 在业务项目中复制一份自定义 SCSS 主题文件
2. 保留 `yun-elp` 和 `element-plus` 的基础变量依赖
3. 只覆盖你需要修改的颜色、间距和组件样式
4. 在 Vite 的 `additionalData` 中改为注入你的自定义主题文件

## 注意事项

- 当前文档说明的是 SCSS 编译期主题接入方式
- 仓库目前没有额外发布多个预设主题文件
- 如果你的项目依赖 `YunElpResolver({ importStyle: 'scss' })`，请确保工程已启用 Sass
