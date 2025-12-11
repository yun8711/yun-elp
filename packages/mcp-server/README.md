# yun-elp MCP Server

一个模型上下文协议 (MCP) 服务器，提供有关 yun-elp 组件的全面信息。该服务器使 AI 助手能够查询 yun-elp 组件文档、属性、事件和使用示例。

## 功能特性

- 📋 **列出组件** - 获取所有 Element-UI 组件的完整列表
- 🔍 **搜索组件** - 按名称或描述搜索组件
- 📖 **组件详情** - 获取特定组件的详细信息
- ⚙️ **组件属性** - 访问组件的所有属性、类型和默认值
- 🎯 **组件事件** - 查看所有事件及其参数
- 📝 **使用示例** - 从组件文档中提取代码示例

## API

该服务器提供 4 个 MCP API：

### 1. `list_components`
列出所有可用的 Element-UI 组件。

### 2. `search_components`
按关键词搜索组件。

**参数：**
- `keyword`: 搜索词
- `limit` (可选): 最大结果数量

### 3. `get_component`
获取特定组件的详细信息，包括属性（props）、事件（events）、插槽（slots）、方法（methods）、示例代码和 TypeScript 类型定义等。

**参数：**
- `tagName`: 组件标签名称 (例如: "y-button")

**返回：**
- `tagName`: 组件标签名
- `description`: 组件简短描述
- `detailedDescription`: 详细说明（来自 markdown）
- `docUrl`: 文档 URL
- `props`: 组件属性数组
- `events`: 组件事件数组
- `slots`: 组件插槽数组
- `methods`: 组件方法数组
- `dts`: TypeScript 类型定义（文本内容）

### 4. `get_component_examples`
获取特定组件的使用示例。

**参数：**
- `tagName`: 组件标签名称

## MCP 集成

然后在 MCP 客户端中配置：

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

推荐使用 npx 方式，它会自动管理包版本并确保使用最新版本。

## 许可证

MIT
