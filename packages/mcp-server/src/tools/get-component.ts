import componentObject from '../metadata/components.js'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取某个 element-ui组件的详细信息
 * @param server
 */
export function registerGetComponent(server: McpServer) {
  server.registerTool(
    'get_component',
    {
      title: 'Get Component',
      description:
        '获取组件的详细信息，包括属性（props）、事件（events）、插槽（slots）、方法（methods）和 TypeScript 类型定义。使用 get_component_examples 方法获取使用示例。',
      inputSchema: z.object({
        tagName: z.string().describe('组件标签名, 例如：el-button'),
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
        dts: z.string().describe('组件的TypeScript类型定义'),
      }),
    },
    async ({ tagName }) => {
      const component = (componentObject as Record<string, any>)[tagName]

      if (!component) {
        throw new Error(`Component "${tagName}" not found. Available components: ${Object.keys(componentObject).join(', ')}`)
      }

      // 读取类型定义（.ts.txt 文件，作为文本内容读取）
      let dts = ''
      try {
        // 优先读取 .ts.txt 文件（纯文本格式，避免被 TypeScript 编译器处理）
        const tsTxtPath = path.join(__dirname, '../examples', `${tagName}.ts.txt`)
        const tsPath = path.join(__dirname, '../examples', `${tagName}.ts`)
        const dtsPath = path.join(__dirname, '../examples', `${tagName}.d.ts`)
        if (fs.existsSync(tsTxtPath)) {
          dts = fs.readFileSync(tsTxtPath, 'utf8')
        } else if (fs.existsSync(tsPath)) {
          dts = fs.readFileSync(tsPath, 'utf8')
        } else if (fs.existsSync(dtsPath)) {
          dts = fs.readFileSync(dtsPath, 'utf8')
        }
      } catch (error) {
        console.warn(`Failed to read type definition for ${tagName}:`, error)
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
        dts: dts,
      }

      return {
        structuredContent: result,
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      }
    }
  )
}
