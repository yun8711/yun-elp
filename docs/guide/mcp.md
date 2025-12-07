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

### 1. 构建 MCP 服务器

首先，确保已安装依赖并构建 MCP 服务器：

```bash
pnpm install
pnpm build:mcp
```

### 2. 在消费项目中安装组件库

在您的消费项目中安装 yun-elp 组件库：

```bash
npm install yun-elp
# 或
pnpm add yun-elp
# 或
yarn add yun-elp
```

### 3. 在 Cursor 中配置 MCP 服务器

在 Cursor 的设置中，找到 MCP 服务器配置（通常在 `~/.cursor/mcp.json` 或 Cursor 设置中），添加以下配置：

**使用 node_modules 中的路径（推荐）：**

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "node",
      "args": [
        "./node_modules/yun-elp/mcp-server/src/index.js"
      ],
      "env": {}
    }
  }
}
```

**使用绝对路径：**

**Windows:**

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "node",
      "args": [
        "C:\\path\\to\\your-project\\node_modules\\yun-elp\\mcp-server\\src\\index.js"
      ],
      "env": {}
    }
  }
}
```

**macOS/Linux:**

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "node",
      "args": [
        "/path/to/your-project/node_modules/yun-elp/mcp-server/src/index.js"
      ],
      "env": {}
    }
  }
}
```

### 4. 重启 Cursor

配置完成后，重启 Cursor 以使配置生效。

**注意：** MCP 服务器会自动从 `node_modules/yun-elp` 中查找组件文档。如果您的项目中没有文档目录，MCP 服务器会尝试从其他可能的位置查找。

## 使用方法

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

## MCP 资源说明

MCP 服务器还提供了以下资源：

### 1. yun-elp://components

获取所有组件的列表（JSON 格式）。

### 2. yun-elp://component/{componentName}

获取指定组件的完整文档（JSON 格式）。

## 开发

如果您想修改或扩展 MCP 服务器，可以：

1. 修改 `packages/mcp-server/src/index.ts` 添加新的工具或资源
2. 修改 `packages/mcp-server/src/utils/component-parser.ts` 改进组件信息解析
3. 运行 `pnpm -C packages/mcp-server build` 重新构建

## 故障排除

### MCP 服务器无法启动

1. 确保已安装所有依赖：`pnpm install`
2. 确保已构建 MCP 服务器：`pnpm build:mcp`
3. 检查路径是否正确（使用绝对路径）
4. 检查 Node.js 版本是否 >= 18

### AI 助手无法调用工具

1. 确保 MCP 服务器配置正确
2. 重启 Cursor
3. 检查 Cursor 的 MCP 日志（通常在开发者工具中）

### 组件信息不完整

1. 确保组件文档文件存在：`docs/components/{componentName}/index.md`
2. 确保文档格式符合规范（包含 API 部分的表格）
3. 检查组件名称是否正确（区分大小写）

## 更多信息

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [Cursor MCP 文档](https://docs.cursor.com/mcp)
