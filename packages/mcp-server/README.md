# @yun-elp/mcp-server

yun-elp 组件库的 MCP (Model Context Protocol) 服务器，用于在 AI IDE 中提供组件库信息。

## 功能

- 列出所有可用组件
- 获取组件的详细 API 文档
- 搜索组件
- 获取组件的使用示例

## 安装

```bash
pnpm install
pnpm build
```

## 使用

### 作为命令行工具

```bash
node dist/index.js
```

### 在 Cursor 中配置

在 Cursor 的 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "yun-elp": {
      "command": "node",
      "args": ["/path/to/packages/mcp-server/dist/index.js"]
    }
  }
}
```

## 开发

```bash
# 开发模式（监听文件变化）
pnpm dev

# 构建
pnpm build
```

## 许可证

MIT

