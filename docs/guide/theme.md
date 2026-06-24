---
title: 主题定制
---

# 主题定制

## 内置主题

当前仓库内置的主题文件为：

- `yun-elp/themes/kd.scss` - 内部主题
- `yun-elp/themes/arco.scss` - 偏 Arco Design 风格
- `yun-elp/themes/antd.scss` - 偏 Ant Design 风格
- `yun-elp/themes/switchable.scss` - 用于运行时动态切换

## 导入方式

### `scss` 源码接入场景

如果你的项目通过 `YunElpResolver({ importStyle: 'scss' })` 接入组件样式，主题文件应当单独全局引入一次：

```ts
import 'yun-elp/themes/kd.scss';
```

也可以按需替换为任意一套内置主题，例如：

```ts
import 'yun-elp/themes/arco.scss';
```

也可以在你自己的全局样式入口里引入：

```scss
@use 'yun-elp/themes/kd.scss';
```

如果你同时启用了自定义 namespace，主题文件仍然是全局引入一次

### 动态切换主题

如果你需要在运行时切换 `kd / arco / antd`，请改为引入：

```ts
import 'yun-elp/themes/switchable.scss';
```

然后通过根节点属性切换主题：

```ts
document.documentElement.setAttribute('data-yun-theme', 'kd');
document.documentElement.setAttribute('data-yun-theme', 'arco');
document.documentElement.setAttribute('data-yun-theme', 'antd');
```

### `css` 成品包 / 全量导入场景

如果你使用全量导入，按下面的方式引入组件样式和主题：

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
4. 在业务项目入口或全局样式入口中，引入你的自定义主题文件
