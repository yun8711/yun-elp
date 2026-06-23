# yun-elp MCP Server

[yun-elp](https://github.com/yun8711/yun-elp) 的 MCP（Model Context Protocol）服务。面向 Cursor 等 AI IDE，提供组件列表、API 文档和示例代码查询。

yun-elp 是基于 **Element Plus** 的 Vue 3 业务组件库，模板中使用 `y-` 前缀标签（如 `y-button`、`y-table`）。

## 功能

- 列出所有 yun-elp 组件
- 按关键词搜索组件
- 获取组件 Props、Events、Slots、Methods 及示例索引
- 按需获取组件使用示例源码

## 安装与配置

npm 包名：`yun-elp-mcp`

在 Cursor 等 MCP 客户端中配置：

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

推荐使用 `npx`，自动拉取最新版本。

## 工具说明

### 1. `list_components`

列出所有可用的 yun-elp 组件（标签名、描述、文档 URL）。

### 2. `search_components`

按关键词搜索组件（匹配标签名与描述）。

**参数：**

- `keyword`：搜索词
- `limit`（可选）：最大返回数量

### 3. `get_component`

获取指定组件的详细信息。

**参数：**

- `tagName`：组件标签名，例如 `y-button`、`y-table`

**返回：**

- `tagName`、`description`、`detailedDescription`、`docUrl`
- `props`、`events`、`slots`、`methods`
- `examples`：示例索引，不包含源码

### 4. `get_component_examples`

获取组件的使用示例索引；需要源码时可按需读取。

**参数：**

- `tagName`：组件标签名，例如 `y-dialog`
- `exampleName`（可选）：示例名称
- `includeSource`（可选）：是否返回示例源码，默认 `false`

## 使用示例

配置完成后，可在 AI 对话中直接提问，例如：

- 「列出所有 yun-elp 组件」
- 「获取 y-button 的 API」
- 「搜索表格相关组件」
- 「给我 y-dialog 的使用示例」

## 数据来源

组件 API 元数据由仓库内 `docs/components/*/index.md` 与 `dist/web-types.json` 抽取生成。示例源码不提交到仓库，发布构建时从 `docs/components/*/*.vue` 生成到 MCP 包的 `dist/examples`。

## 相关链接

- [yun-elp 文档](https://yun8711.github.io/yun-elp/)
- [AI 使用指南](https://yun8711.github.io/yun-elp/guide/ai-usage)
- [MCP 官方文档](https://modelcontextprotocol.io/)

## 许可证

MIT
