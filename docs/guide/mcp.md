---
title: MCP 服务
description: yun-elp 组件库 MCP 服务提供的能力
---

yun-elp 组件库提供了 MCP (Model Context Protocol) 服务，面向 Cursor 等 AI IDE 暴露组件库文档、API 与示例查询能力。

## 安装和配置

`yun-elp-mcp` 是独立的 MCP 服务包，推荐通过 `npx` 使用，客户端会自动拉取最新版本。

在 Cursor 等 MCP 客户端中添加以下配置：

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

## 功能概览

通过 yun-elp MCP 服务，AI 助手可以：

- 列出所有 yun-elp 组件
- 按关键词搜索组件
- 获取组件 Props、Events、Slots、Methods 等 API 信息
- 获取组件示例索引，并按需读取示例源码

## 可用工具

### `list_components`

列出所有可用的 yun-elp 组件，返回组件标签名、描述与文档地址。

适合用于：

- 快速了解组件库包含哪些组件
- 让 AI 在生成页面前先选择合适组件

### `search_components`

按关键词搜索组件，匹配组件标签名与描述。

参数：

- `keyword`：搜索词
- `limit`：最大返回数量，可选

适合用于：

- 按业务语义查找组件，例如表格、弹窗、表单
- 在不确定组件名称时让 AI 先检索候选组件

### `get_component`

获取指定组件的详细信息。

参数：

- `tagName`：组件标签名，例如 `y-button`、`y-table`

返回内容：

- 组件标签名、描述、详细说明与文档地址
- Props、Events、Slots、Methods
- 示例索引

适合用于：

- 查询组件完整 API
- 让 AI 按组件约束生成更准确的 Vue 示例代码

### `get_component_examples`

获取指定组件的使用示例。

参数：

- `tagName`：组件标签名，例如 `y-dialog`
- `exampleName`：示例名称，可选
- `includeSource`：是否返回示例源码，默认 `false`

适合用于：

- 查看组件有哪些示例
- 在需要时让 AI 读取指定示例源码作为参考
