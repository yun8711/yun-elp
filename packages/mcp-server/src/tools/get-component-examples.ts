import componentObject from '../metadata/components.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ComponentExample } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildExampleSummary(tagName: string, examples: ComponentExample[]) {
  if (examples.length === 0) {
    return `${tagName} 暂无示例索引。`;
  }

  return examples
    .map(example => {
      const lines = [
        `### ${example.title || example.name}`,
        '',
        `- 名称: ${example.name}`,
        `- 文档: ${example.docUrl || ''}`
      ];
      if (example.description) {
        lines.push(`- 说明: ${example.description}`);
      }
      lines.push(`- 源码路径: ${example.sourcePath}`);
      return lines.join('\n');
    })
    .join('\n\n');
}

function buildExampleSourceMarkdown(example: ComponentExample, source: string) {
  const lines = [`### ${example.title || example.name}`, ''];

  if (example.description) {
    lines.push(example.description, '');
  }

  lines.push('```vue', source.trim(), '```');

  return lines.join('\n');
}

/**
 * 获取组件的使用示例
 * @param server
 */
export function registerGetComponentExamples(server: McpServer) {
  server.registerTool(
    'get_component_examples',
    {
      title: 'Get Component Examples',
      description: '获取 yun-elp 组件的示例索引；传 includeSource=true 时按需返回指定示例源码。',
      inputSchema: z.object({
        tagName: z.string().describe('组件标签名, 例如：y-button'),
        exampleName: z
          .string()
          .optional()
          .describe('示例名称；includeSource=true 时可指定要读取的示例'),
        includeSource: z.boolean().optional().describe('是否返回示例源码，默认 false')
      }),
      outputSchema: z.object({
        tagName: z.string().describe('组件标签名'),
        examples: z
          .array(
            z.object({
              name: z.string().describe('示例名称'),
              title: z.string().describe('示例标题'),
              description: z.string().optional().describe('示例描述'),
              sourcePath: z.string().describe('示例源码在仓库中的路径'),
              docUrl: z.string().url().optional().describe('组件文档URL')
            })
          )
          .describe('组件示例索引'),
        source: z.string().optional().describe('按需读取的示例源码'),
        content: z.string().describe('用于展示给模型的示例索引或源码文档')
      })
    },
    async ({ tagName, exampleName, includeSource }) => {
      const component = componentObject[tagName as keyof typeof componentObject];

      if (!component) {
        throw new Error(
          `Component "${tagName}" not found. Available components: ${Object.keys(componentObject).join(', ')}`
        );
      }

      const examples = component.examples || [];
      let source: string | undefined;
      let content = buildExampleSummary(tagName, examples);

      if (includeSource) {
        const example = exampleName
          ? examples.find(item => item.name === exampleName)
          : examples[0];

        if (!example) {
          throw new Error(
            exampleName
              ? `Example "${exampleName}" not found for "${tagName}". Available examples: ${examples.map(item => item.name).join(', ')}`
              : `Component "${tagName}" has no examples.`
          );
        }

        try {
          const sourcePath = path.join(__dirname, '../examples', tagName, `${example.name}.vue`);
          if (fs.existsSync(sourcePath)) {
            source = fs.readFileSync(sourcePath, 'utf8');
            content = buildExampleSourceMarkdown(example, source);
          } else {
            content = `未找到 ${tagName}/${example.name} 示例源码。可查看文档：${example.docUrl || component.docUrl || ''}`;
          }
        } catch (error) {
          console.warn(`Failed to read example source for ${tagName}:`, error);
          content = `读取 ${tagName} 组件示例源码时出错。`;
        }
      }

      const result = {
        tagName,
        examples,
        source,
        content
      };

      return {
        structuredContent: result,
        content: [
          {
            type: 'text' as const,
            text: content
          }
        ]
      };
    }
  );
}
