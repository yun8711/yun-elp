import componentObject from '../metadata/components.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * 获取某个 yun-elp 组件的详细信息
 * @param server
 */
export function registerGetComponent(server: McpServer) {
  server.registerTool(
    'get_component',
    {
      title: 'Get Component',
      description:
        '获取组件的详细信息，包括属性（props）、事件（events）、插槽（slots）、方法（methods）和示例索引。使用 get_component_examples 方法按需获取示例源码。',
      inputSchema: z.object({
        tagName: z.string().describe('组件标签名, 例如：y-button')
      }),
      outputSchema: z.object({
        tagName: z.string().describe('组件标签名, 例如：y-button'),
        description: z.string().describe('组件简短描述'),
        detailedDescription: z.string().optional().describe('组件详细说明'),
        docUrl: z.string().url().describe('组件文档URL'),
        props: z.any().describe('组件属性列表'),
        slots: z.any().describe('组件插槽列表'),
        methods: z.any().describe('组件方法(Methods)列表'),
        events: z.any().describe('组件事件(Events)列表'),
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
          .describe('组件示例索引，不包含源码')
      })
    },
    async ({ tagName }) => {
      const component = (componentObject as Record<string, any>)[tagName];

      if (!component) {
        throw new Error(
          `Component "${tagName}" not found. Available components: ${Object.keys(componentObject).join(', ')}`
        );
      }

      const result = {
        tagName: component.tagName,
        description: component.description || '',
        detailedDescription: component.detailedDescription,
        docUrl: component.docUrl,
        props: component.props || [],
        events: component.events || [],
        slots: component.slots || [],
        methods: component.methods || [],
        examples: component.examples || []
      };

      return {
        structuredContent: result,
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    }
  );
}
