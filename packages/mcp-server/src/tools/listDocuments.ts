import { z } from 'zod';
import { readdirSync } from 'fs';
import { join } from 'path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ROOT_DIR } from '../constants/path.js';

/**
 * 列出所有文档
 * @param server
 */
export function registerListDocuments(server: McpServer) {
  server.registerTool(
    'list_documents',
    {
      title: 'List Documents',
      description: 'List all available component documentation',
      inputSchema: {},
      outputSchema: {
        documents: z.array(z.object({
          componentName: z.string().describe('Component name'),
          title: z.string().describe('Document title'),
          path: z.string().describe('Document file path')
        })).describe('List of component documents')
      },
    },
    async () => {
      const documents: Array<{ componentName: string; title: string; path: string }> = [];

      try {
        // 读取 docs/components 目录
        const docsDir = join(ROOT_DIR, 'docs', 'components');
        const componentDirs = readdirSync(docsDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const componentDir of componentDirs) {
          try {
            const indexPath = join(docsDir, componentDir, 'index.md');
            const stat = readdirSync(join(docsDir, componentDir));

            if (stat.includes('index.md')) {
              // 将目录名转换为组件名
              const componentName = `Y${componentDir.charAt(0).toUpperCase()}${componentDir.slice(1)}`;

              documents.push({
                componentName,
                title: `${componentName} 组件文档`,
                path: `components/${componentDir}/index.md`
              });
            }
          } catch (error) {
            // 忽略读取错误
          }
        }
      } catch (error) {
        // 忽略目录读取错误
      }

      return {
        structuredContent: { documents },
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ documents }, null, 2),
          },
        ],
      };
    },
  );
}
