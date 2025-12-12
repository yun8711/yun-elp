---
title: MCP 服务
description: 如何在 AI IDE 中使用 yun-elp 组件库的 MCP 服务
---

# MCP 服务

yun-elp 组件库提供了 MCP (Model Context Protocol) 服务，让您可以在 AI IDE（如 Cursor）中更方便地使用组件库。

## 什么是 MCP？

MCP (Model Context Protocol) 是由 Anthropic 提出的模型上下文协议，旨在为大语言模型与外部数据源、工具和服务提供统一的通信框架。通过 MCP 服务，AI 助手可以：

- 查询组件库的所有组件
- 获取组件的详细 API 文档
- 搜索组件
- 获取组件的使用示例

## 安装和配置

yun-elp-mcp 是一个单独的包

**在 Cursor 中配置**

在 Cursor 的设置中，找到 MCP 服务器配置（通常在 `~/.cursor/mcp.json` 或 Cursor 设置中），添加以下配置即可：

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

配置完成后，您可以在 Cursor 中直接询问 AI 助手关于组件库的问题，例如：

- "列出所有可用的组件"
- "告诉我 button 组件的使用方法"
- "搜索表格相关的组件"
- "给我一个 dialog 组件的示例代码"

AI 助手会自动调用 MCP 服务获取组件信息，并为您提供准确的答案。

## MCP 工具说明

MCP 服务器提供了以下工具：

### 1. list_components

列出所有可用的组件。

**示例：**
```
列出所有组件
```

### 2. get_component_info

获取指定组件的详细信息，包括：
- 组件名称和描述
- Attributes（属性）
- Events（事件）
- Slots（插槽）
- Exposes（暴露的方法）

**参数：**
- `componentName` (必需): 组件名称，例如 `button`, `table`, `dialog`

**示例：**
```
获取 button 组件的详细信息
```

### 3. search_components

根据关键词搜索组件。

**参数：**
- `query` (必需): 搜索关键词

**示例：**
```
搜索表格相关的组件
```

### 4. get_component_example

获取组件的示例代码。

**参数：**
- `componentName` (必需): 组件名称
- `exampleName` (可选): 示例名称，如果不提供则返回所有示例

**示例：**
```
获取 button 组件的示例代码
```

## 更多信息

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [Cursor MCP 文档](https://docs.cursor.com/mcp)
