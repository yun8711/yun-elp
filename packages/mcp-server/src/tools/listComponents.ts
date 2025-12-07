import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getAllComponents } from '../utils/components';

/**
 * 列出所有 mdui 组件
 * @param server
 */
export function registerListComponents(server: McpServer) {
  server.registerTool(
    'list_components',
    {
      title: 'List Components',
      description:
        '列出本地 yun-elp 索引中所有可用的 yun-elp 组件，按标签名称升序排序。该操作为只读、离线且确定性的，无需输入。对于每个组件，返回以下信息：标签名称（大驼峰）、描述、文档 URL 以及一个最小化的 HTML 使用示例。',
      inputSchema: {},
      // 定义输出结构
      outputSchema: {
        components: z
          .array(
            z.object({
              tagName: z.string().describe('标签名称（大驼峰）, 例如：YButton'),
              description: z.string().describe('组件描述'),
              docUrl: z.string().url().describe('组件文档 URL'),
              usage: z.string().describe('Example HTML usage snippet of the component')
            })
          )
          .describe(
            'A list of components with their tag names, descriptions, documentation URLs, and usage snippets (sorted by tagName).'
          )
      }
    },
    async () => {
      const components = getAllComponents();
      const list = components
        .map(component => ({
          tagName: component.tagName,
          description: component.description,
          docUrl: component.docUrl,
          usage: component.usage
        }))
        .sort((a, b) => a.tagName.localeCompare(b.tagName));

      return {
        structuredContent: { components: list },
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ components: list }, null, 2)
          }
        ]
      };
    }
  );
}
