#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "node",
  args: ["./dist/stdio.js"],
});

const client = new Client({
  name: "yun-elp-mcp-client",
  version: "1.0.0",
});

console.info("正在连接 MCP 服务器...");
await client.connect(transport);
console.info("成功连接到 MCP 服务器!");

try {
  // 测试 1: 列出所有组件
  console.info("\n--- 测试 1: 列出所有组件 ---");
  const components = await client.callTool({
    name: "list_components",
    arguments: {},
  });
  Array.isArray(components.content) && console.info(components.content[0].text.substring(0, 200) + "...");

  // 测试 2: 搜索组件
  console.info("\n--- 测试 2: 搜索按钮相关组件 ---");
  const searchResult = await client.callTool({
    name: "search_components",
    arguments: {
      keyword: "button",
      limit: 5,
    },
  });
  Array.isArray(searchResult.content) && console.info(searchResult.content[0].text);

  // 测试 3: 获取组件详情
  console.info("\n--- 测试 3: 获取 y-button 组件详情 ---");
  const componentDetail = await client.callTool({
    name: "get_component",
    arguments: {
      tagName: "y-button",
    },
  });
  Array.isArray(componentDetail.content) && console.info("组件详情获取成功，数据长度:", componentDetail.content[0].text.length);

  // 测试 4: 获取组件示例
  console.info("\n--- 测试 4: 获取 y-button 组件示例 ---");
  const componentExamples = await client.callTool({
    name: "get_component_examples",
    arguments: {
      tagName: "y-button",
    },
  });
  Array.isArray(componentExamples.content) && console.info("组件示例获取成功，数据长度:", componentExamples.content[0].text.length);

  // 测试 5: 验证 get_component 返回的完整信息（包含 props、events、slots、methods）
  console.info("\n--- 测试 5: 验证 get_component 返回的完整信息 ---");
  const fullComponentInfo = await client.callTool({
    name: "get_component",
    arguments: {
      tagName: "y-button",
    },
  });
  if (Array.isArray(fullComponentInfo.content)) {
    const info = JSON.parse(fullComponentInfo.content[0].text);
    console.info(`组件 ${info.tagName} 包含:`);
    console.info(`  - Props: ${info.props?.length || 0} 个`);
    console.info(`  - Events: ${info.events?.length || 0} 个`);
    console.info(`  - Slots: ${info.slots?.length || 0} 个`);
    console.info(`  - Methods: ${info.methods?.length || 0} 个`);
  }

  console.info("\n✅ 所有测试完成！");
} catch (error) {
  console.error("测试过程中出错:", error);
} finally {
  // 关闭连接
  await client.close();
  console.info("\n测试完成，已断开与服务器的连接。");
}
