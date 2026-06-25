---
title: 主题定制
---

# 主题定制

## 内置主题

- `yun-elp/themes/kd.scss`
- `yun-elp/themes/arco.scss`
- `yun-elp/themes/antd.scss`
- `yun-elp/themes/switchable.scss` — 运行时切换 `kd / arco / antd`

## 按需导入（scss 源码）

在 `main.ts`（或全局样式入口）引入一次：

```ts
import 'yun-elp/themes/kd.scss';
```

替换主题示例：

```ts
import 'yun-elp/themes/arco.scss';
```

或在 SCSS 入口：

```scss
@use 'yun-elp/themes/kd.scss';
```

## 运行时切换主题

引入：

```ts
import 'yun-elp/themes/switchable.scss';
```

切换：

```ts
document.documentElement.setAttribute('data-yun-theme', 'kd');
document.documentElement.setAttribute('data-yun-theme', 'arco');
document.documentElement.setAttribute('data-yun-theme', 'antd');
```

## 全量导入

```ts
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
```

## 自定义主题

以 `packages/theme-chalk/src/themes/kd.scss` 为起点复制到业务项目，按需修改后在入口引入。

## 编译期覆盖 Element Plus 变量（可选）

入口仍保留 `import 'yun-elp/themes/kd.scss'`。

新建 `styles/element-kd-vars.scss`：

```scss
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #365edf,
    ),
  )
);
```

`vite.config.ts`：

```ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@use "@/styles/element-kd-vars.scss" as *;`,
    },
  },
},
```

`additionalData` 只用于 EP 变量 forward，不要 `@use` 主题文件。
