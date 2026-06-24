# yun-elp

基于 Element Plus 的 Vue 3 业务组件库。

## 文档

- 官网文档：[https://yun8711.github.io/yun-elp/](https://yun8711.github.io/yun-elp/)
- 快速开始：[https://yun8711.github.io/yun-elp/guide/quickstart](https://yun8711.github.io/yun-elp/guide/quickstart)

`README` 只保留最基本的信息。关于以下内容，请直接查阅官网文档：

- 组件用法与示例
- `namespace` 配置
- 主题接入与自定义
- 国际化
- 开发、构建与发布流程
- MCP / AI 使用方式

## 安装

```bash
pnpm add yun-elp element-plus vue vue-router lodash-es
```

按需安装可选依赖：

```bash
pnpm add cron-parser echarts
```

## 快速使用

```ts
import { createApp } from 'vue';
import YunElp from 'yun-elp';
import 'yun-elp/style';
import 'yun-elp/themes/kd.scss';
import App from './App.vue';

createApp(App).use(YunElp).mount('#app');
```

## 开发

```bash
pnpm install
pnpm dev
```

更多说明见官网文档。
