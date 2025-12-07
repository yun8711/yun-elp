import { z } from 'zod';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ROOT_DIR } from '../constants/path.js';

/**
 * 列出CSS类
 * @param server
 */
export function registerListCssClasses(server: McpServer) {
  server.registerTool(
    'list_css_classes',
    {
      title: 'List CSS Classes',
      description: 'List all CSS classes available in the yun-elp theme',
      inputSchema: {},
      outputSchema: {
        classes: z.array(z.object({
          name: z.string().describe('CSS class name'),
          file: z.string().describe('Source file path')
        })).describe('List of CSS classes')
      },
    },
    async () => {
      const classes: Array<{ name: string; file: string }> = [];

      try {
        // 读取 theme-chalk 目录下的 CSS 文件
        const themeDir = join(ROOT_DIR, 'dist', 'theme-chalk');
        const files = readdirSync(themeDir).filter(file => file.endsWith('.css'));

        for (const file of files) {
          try {
            const content = readFileSync(join(themeDir, file), 'utf-8');

            // 提取 CSS 类名（简单的正则匹配）
            const classMatches = content.match(/\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g);
            if (classMatches) {
              const uniqueClasses = [...new Set(classMatches.map(match => match.substring(1)))];
              classes.push(...uniqueClasses.map(className => ({
                name: className,
                file: `theme-chalk/${file}`
              })));
            }
          } catch (error) {
            // 忽略读取错误
          }
        }
      } catch (error) {
        // 忽略目录读取错误
      }

      return {
        structuredContent: { classes },
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ classes }, null, 2),
          },
        ],
      };
    },
  );
}
