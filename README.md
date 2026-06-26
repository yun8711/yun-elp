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
- 开发、构建流程
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

常用命令：

| 命令 | 说明 |
| --- | --- |
| `pnpm lint` | 全仓 ESLint / Stylelint / Prettier 自动修复 |
| `pnpm typecheck` | 检查 components、play、docs 的类型 |
| `pnpm test` | 运行组件测试并校验覆盖率 |
| `pnpm build` | 构建组件、样式、resolver 与发布产物 |
| `pnpm mcp:sync` | 开发收尾：刷新 web-types、抽取并测试 MCP 元数据 |
| `pnpm commit` | 使用 `czg` 进行规范化提交 |

提交时 husky 会对**暂存文件**自动执行 `lint-staged`（修复后重新加入暂存区）。`publish:check` 仅检查组件库源码包（`components`、`theme-chalk`、`resolver`）。

## 发版与发布

发布流程统一使用 `publish:*` 命令。**发布到 npm 需在本机终端人工执行**，并传入 `--otp`。

### 主包

```bash
pnpm publish:check
pnpm commit
pnpm publish:release
pnpm publish:build
pnpm publish:main -- --otp=123456
```

### MCP 包

若本次版本包含 MCP 相关变更（文档、元数据或 MCP 服务代码），按需执行：

```bash
pnpm publish:mcp -- --otp=123456
```

MCP 元数据应在开发阶段通过 `pnpm mcp:sync` 生成并提交，不在发布流程中 extract。

### 命令说明

| 命令 | 说明 |
| --- | --- |
| `pnpm publish:check` | 发版前质量检查 |
| `pnpm publish:release` | 升版本、写 CHANGELOG、打 tag |
| `pnpm publish:build` | 构建主包 `dist` 并校验产物 |
| `pnpm publish:main` | 人工发布主包；支持 `-- --otp=xxxxxx` |
| `pnpm publish:mcp` | 人工发布 MCP 包；支持 `-- --otp=xxxxxx` |
| `pnpm mcp:sync` | 开发收尾：刷新 web-types、抽取并测试 MCP 元数据 |

依赖安全扫描可手动执行 `pnpm audit`；发版流程中仅作参考警告，不阻断发布。
