import { z } from 'zod';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ROOT_DIR } from '../constants/path.js';

/**
 * 列出CSS变量
 * @param server
 */
export function registerListCssVariables(server: McpServer) {
  server.registerTool(
    'list_css_variables',
    {
      title: 'List CSS Variables',
      description: 'List all CSS variables available in the yun-elp theme',
      inputSchema: {},
      outputSchema: {
        variables: z.array(z.object({
          name: z.string().describe('CSS variable name'),
          value: z.string().describe('CSS variable value'),
          file: z.string().describe('Source file path')
        })).describe('List of CSS variables')
      },
    },
    async () => {
      const variables: Array<{ name: string; value: string; file: string }> = [];

      try {
        // 读取 theme-chalk 目录下的 CSS 文件
        const themeDir = join(ROOT_DIR, 'dist', 'theme-chalk');
        const files = readdirSync(themeDir).filter(file => file.endsWith('.css'));

        for (const file of files) {
          try {
            const content = readFileSync(join(themeDir, file), 'utf-8');

            // 提取 CSS 变量定义
            const varMatches = content.match(/--([a-zA-Z_-][a-zA-Z0-9_-]*)\s*:\s*([^;]+);/g);
            if (varMatches) {
              varMatches.forEach(match => {
                const varMatch = match.match(/--([a-zA-Z_-][a-zA-Z0-9_-]*)\s*:\s*([^;]+);/);
                if (varMatch) {
                  variables.push({
                    name: `--${varMatch[1]}`,
                    value: varMatch[2].trim(),
                    file: `theme-chalk/${file}`
                  });
                }
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
        structuredContent: { variables },
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ variables }, null, 2),
          },
        ],
      };
    },
  );
}
