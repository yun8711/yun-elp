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
| `pnpm commit` | 使用 `czg` 进行规范化提交 |

提交时 husky 会对**暂存文件**自动执行 `lint-staged`（修复后重新加入暂存区）。发版前 `check:release` 仅检查组件库源码包（`components`、`theme-chalk`、`resolver`）。

## 发版与发布

在 `main` 分支、工作区已提交干净的前提下，按以下顺序操作：

```bash
pnpm check:release   # 发版前质量检查
pnpm commit          # 提交待发版变更（如有）
pnpm release         # 升版本、写 CHANGELOG、打 tag 并推送
pnpm publish         # 发布主包 yun-elp 到 npm
```

若主包与 MCP 包需一并发布：

```bash
pnpm publish:all
```

若本次变更涉及 MCP 元数据，在发布 MCP 前额外执行：

```bash
pnpm mcp:extract
pnpm mcp:test
pnpm mcp:publish     # 仅发布 yun-elp-mcp 时使用
```

### 检查项说明

| 命令 | 阶段 | 说明 |
| --- | --- | --- |
| `pnpm check:release` | 发版前 | `audit`（仅警告）→ 组件库 lint / typecheck → 覆盖率测试 |
| `pnpm release` | 发版 | 使用 `release-it` 升版本；要求工作区干净 |
| `pnpm check:publish` | 发布前 | 版本一致性 → 构建 → dist 产物校验（`publish` 会自动执行） |
| `pnpm publish` | 发布 | 执行 `check:publish` 后发布主包 `yun-elp` |
| `pnpm publish:all` | 发布 | 依次发布主包与 `yun-elp-mcp` |
| `pnpm mcp:publish` | 发布 | 只发布 `yun-elp-mcp`（发布前会自动 build） |

依赖安全扫描可手动执行 `pnpm audit`；发版流程中仅作参考警告，不阻断发布。
