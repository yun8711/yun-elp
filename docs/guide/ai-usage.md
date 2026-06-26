---
title: AI 使用指南
description: 面向 AI 助手和代码生成工具的 yun-elp 使用约定
---

本页说明 yun-elp 为 AI 辅助开发提供了哪些能力，如何通过 MCP 接入，以及常见 IDE 的配置方式。

## 一、组件库提供的 AI 能力与资源

yun-elp 将组件文档作为一等产物维护（见 [设计](./design#文档与-ai-资源同源策略)）。文档站、机器可读索引与 MCP 数据均来自 `docs/components/*/index.md`，保持同源。

### 能力概览

| 能力                          | 说明                                                            | 适用场景                                       |
| ----------------------------- | --------------------------------------------------------------- | ---------------------------------------------- |
| **MCP 服务**（`yun-elp-mcp`） | 在 IDE 内结构化查询组件列表、API、示例                          | 生成代码前查 Props / Events / 示例（**首选**） |
| **文档站机器可读资源**        | `llms.txt`、`llms-full.txt`、`components.json` 等               | 联网 AI、Cursor Docs、无法配 MCP 时            |
| **在线文档站**                | [yun8711.github.io/yun-elp](https://yun8711.github.io/yun-elp/) | 人工阅读；Cursor Docs 全站索引                 |
| **IDE 类型提示**              | `web-types.json`、Volar 组件标签                                | 编辑器补全，非对话上下文                       |

### 机器可读资源

| 资源              | 地址                                                         | 用途                                                  |
| ----------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| `llms.txt`        | `https://yun8711.github.io/yun-elp/llms.txt`                 | AI 文档入口索引，体积小，适合先建立整体认知           |
| `llms-full.txt`   | `https://yun8711.github.io/yun-elp/llms-full.txt`            | 组件摘要与主要 API 的完整索引                         |
| `components.json` | `https://yun8711.github.io/yun-elp/metadata/components.json` | 结构化元数据：Props、Events、Slots、Exposes、示例索引 |
| `sitemap.xml`     | `https://yun8711.github.io/yun-elp/sitemap.xml`              | 站点页面索引                                          |

这些 URL 本身可被读取，但 AI 能否用到取决于 IDE 是否支持 MCP、Docs 爬取或联网抓取。无法自动读取时，应配置 MCP（见下文）或手动粘贴相关文档片段。

### 生成代码约定

AI 生成 yun-elp 代码时请遵循：

- yun-elp 基于 Element Plus，只在有明确业务封装时使用 `y-` 前缀组件；基础能力继续用 `el-*`
- 使用前确认文档中存在该组件；**不要猜测**未声明的 Props、Events、Slots、Exposes
- 模板用 `y-*` 标签，TypeScript 引用组件类型用大驼峰（如 `YButton`）
- 表单场景优先 `y-form` + `y-form-item`，字段控件仍用 Element Plus 原组件
- 涉及多语言时，在 `y-app-wrap` 上设 `locale` 即可同步 yun-elp 与内部 Element Plus 文案；`direction="auto"` 时 `locale="ar"` 自动 RTL

安装、自动导入、主题等工程配置见 [快速开始](./quickstart)；国际化与命名空间见 [国际化](./i18n)、[命名空间](./namespace)。

## 二、MCP 接入

[yun-elp-mcp](https://www.npmjs.com/package/yun-elp-mcp) 是独立 npm 包，通过 [Model Context Protocol](https://modelcontextprotocol.io/) 向 AI IDE 暴露组件文档与示例查询能力。详细说明见 [MCP 服务](./mcp)。

### 配置

在支持 MCP 的客户端中添加：

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "npx",
      "args": ["-y", "yun-elp-mcp"]
    }
  }
}
```

推荐使用 `npx`，自动拉取最新版本。各 IDE 的具体配置位置见下一节。

### 可用工具

| 工具                     | 作用                                                    |
| ------------------------ | ------------------------------------------------------- |
| `list_components`        | 列出所有组件（标签名、描述、文档地址）                  |
| `search_components`      | 按关键词搜索组件                                        |
| `get_component`          | 获取指定组件的 Props、Events、Slots、Methods 与示例索引 |
| `get_component_examples` | 获取示例；可选 `includeSource` 返回示例源码             |

### 使用与验证

配置完成后，可在对话中直接提问，例如：

- 「列出所有 yun-elp 组件」
- 「获取 `y-button` 的 API」
- 「搜索表格相关组件，再帮我写列表页」
- 「给我 `y-dialog` 的使用示例源码」

若 AI 能返回组件列表、API 字段或示例源码，说明 MCP 已生效。建议在提问中明确要求**先查 MCP 再写代码**，以减少凭记忆猜测 API。

## 三、常见 IDE 配置

不同 IDE 接入外部文档的方式不同。**跨 IDE 最一致的做法是配置 `yun-elp-mcp`**；需要 guide 类文档（国际化、主题等）时，再按 IDE 能力补充 Docs 或项目说明文件。

### 接入优先级

1. **MCP `yun-elp-mcp`**：查组件 API 与示例（Cursor、Claude Code、Codex 等均适用）
2. **Cursor Docs**：补充 `llms.txt` 或文档站（仅 Cursor）
3. **项目说明文件**：在业务仓库写规则，引导 AI 优先查 MCP
4. **联网读取 URL**：工具支持抓取网页时，可读 `llms.txt` / `components.json`
5. **手动粘贴**：以上均不可用时，粘贴相关组件文档

### IDE 能力对比

| 能力                 | Cursor          | Claude Code | Codex       | GitHub Copilot            |
| -------------------- | --------------- | ----------- | ----------- | ------------------------- |
| 内置「添加文档 URL」 | ✅              | ❌          | ❌          | ❌                        |
| 对话中 `@Docs`       | ✅              | ❌          | ❌          | ❌                        |
| MCP                  | ✅              | ✅          | ✅          | ✅（VS Code 等）          |
| 项目规则             | `.cursor/rules` | `CLAUDE.md` | `AGENTS.md` | `copilot-instructions.md` |

### Cursor

**MCP**：在 MCP 设置中添加第二节的 JSON，或通过 UI 填写 Name `yun-elp`、Command `npx`、Args `-y yun-elp-mcp`。

**Docs**（可选）：`Cursor Settings → Features → Docs → Add new doc`

| 推荐 URL                                          | 说明                  |
| ------------------------------------------------- | --------------------- |
| `https://yun8711.github.io/yun-elp/llms.txt`      | 优先，索引快          |
| `https://yun8711.github.io/yun-elp/llms-full.txt` | 需要更完整 API 摘要时 |
| `https://yun8711.github.io/yun-elp/`              | 全站，页数多、索引慢  |

索引完成后在 Chat 中通过 `@Docs` 引用。Docs 仅支持公网 URL；在 yun-elp 仓库内开发时，工作区 `docs/` 与 MCP 通常已足够。

### Claude Code

```bash
claude mcp add --scope user yun-elp -- npx -y yun-elp-mcp
```

可选在业务项目的 `CLAUDE.md` 中写明：使用 yun-elp 前先通过 MCP 查询组件 API。Claude Code 无 Cursor Docs 等价功能；偶发需求可用 WebFetch 读取 `llms.txt`，但不如 MCP 可靠。

### Codex

```bash
codex mcp add yun-elp -- npx -y yun-elp-mcp
```

或在 `~/.codex/config.toml`（项目内可用 `.codex/config.toml`）：

```toml
[mcp_servers.yun-elp]
command = "npx"
args = ["-y", "yun-elp-mcp"]
```

建议在业务项目 `AGENTS.md` 中写明：使用 yun-elp 组件前先查 yun-elp MCP。

### GitHub Copilot

无 Cursor 式 Docs。可通过 `copilot-instructions.md` 引导 AI 行为；VS Code 中可配置 MCP 接入 `yun-elp-mcp`；GitHub 上可用 Copilot Spaces 手动添加文档链接或文件。

### 推荐组合

| IDE            | 推荐配置                                 |
| -------------- | ---------------------------------------- |
| Cursor         | MCP + 可选 Docs（`llms.txt`）            |
| Claude Code    | MCP + 可选 `CLAUDE.md`                   |
| Codex          | MCP + `AGENTS.md`                        |
| GitHub Copilot | MCP（若支持）+ `copilot-instructions.md` |
