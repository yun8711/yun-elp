---
title: MCP 服务
description: yun-elp 组件库 MCP 服务提供的能力
---

# MCP 服务

yun-elp 提供独立的 MCP（Model Context Protocol）服务包 `yun-elp-mcp`，面向 Cursor 等 AI IDE 暴露组件库文档、API 与示例查询能力。

## 运行要求

- Node.js `>= 20`
- 推荐通过 `npx` 启动最新版本

## 安装和配置

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

### `search_components`

按关键词搜索组件。

参数：

- `keyword`：搜索词
- `limit`：最大返回数量，可选

### `get_component`

获取指定组件的详细信息。

参数：

- `tagName`：组件标签名，例如 `y-button`、`y-table`

返回内容：

- 组件标签名、描述、详细说明与文档地址
- Props、Events、Slots、Methods
- 示例索引

### `get_component_examples`

获取指定组件的使用示例。

参数：

- `tagName`：组件标签名，例如 `y-dialog`
- `exampleName`：示例名称，可选
- `includeSource`：是否返回示例源码，默认 `false`

## 仓库内维护命令

如果你在维护 `yun-elp-mcp` 本身，常用命令如下：

```shell
pnpm mcp:extract
pnpm mcp:test
pnpm mcp:build
pnpm mcp:publish
```

说明：

- `mcp:extract`：从组件文档中抽取元数据和示例
- `mcp:test`：本地测试 MCP 服务
- `mcp:build`：构建 `packages/mcp-server`
- `mcp:publish`：发布 `yun-elp-mcp` 到 npm
