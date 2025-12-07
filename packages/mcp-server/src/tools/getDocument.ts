import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ROOT_DIR } from '../constants/path.js';

/**
 * 获取文档内容
 * @param server
 */
export function registerGetDocument(server: McpServer) {
  server.registerTool(
    'get_document',
    {
      title: 'Get Document',
      description: 'Get documentation content for a specific component',
      inputSchema: {
        componentName: z.string().describe('The name of the component to get documentation for')
      },
      outputSchema: {
        content: z.string().describe('The documentation content in Markdown format'),
        found: z.boolean().describe('Whether the documentation was found')
      },
    },
    async ({ componentName }) => {
      try {
        // 尝试从 docs 目录读取组件文档
        const docPath = join(ROOT_DIR, 'docs', 'components', componentName.toLowerCase().replace('y', ''), 'index.md');

        const content = readFileSync(docPath, 'utf-8');

        return {
          structuredContent: {
            content,
            found: true
          },
          content: [
            {
              type: 'text' as const,
              text: content,
            },
          ],
        };
      } catch (_error) {
        return {
          structuredContent: {
            content: '',
            found: false
          },
          content: [
            {
              type: 'text' as const,
              text: `Documentation for component "${componentName}" not found.`,
            },
          ],
        };
      }
    },
  );
}
