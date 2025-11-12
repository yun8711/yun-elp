#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { getAllComponents, parseComponentDoc, searchComponents } from './utils/component-parser.js';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// 在构建后的文件中，需要从 dist/mcp-server/src 向上查找项目根目录
// 构建后路径: dist/mcp-server/src/index.js -> 需要找到项目根目录
const rootDir = resolve(__dirname, '../../..');

const server = new Server(
  {
    name: 'yun-elp-mcp-server',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
);

// 列出所有工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description: '列出所有可用的组件',
        inputSchema: {
          type: 'object',
          properties: {},
          required: []
        }
      },
      {
        name: 'get_component_info',
        description: '获取指定组件的详细信息，包括 API、属性、事件、插槽等',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: '组件名称（例如：button, table, dialog）'
            }
          },
          required: ['componentName']
        }
      },
      {
        name: 'search_components',
        description: '搜索组件，根据组件名、显示名或描述进行模糊搜索',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: '搜索关键词'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_component_example',
        description: '获取组件的示例代码',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: '组件名称'
            },
            exampleName: {
              type: 'string',
              description: '示例名称（可选，如果不提供则返回所有示例）'
            }
          },
          required: ['componentName']
        }
      }
    ]
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components': {
        const components = getAllComponents();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  components: components.map(name => ({
                    name,
                    displayName: parseComponentDoc(name)?.displayName || name
                  }))
                },
                null,
                2
              )
            }
          ]
        };
      }

      case 'get_component_info': {
        const { componentName } = args as { componentName: string };
        const info = parseComponentDoc(componentName);

        if (!info) {
          return {
            content: [
              {
                type: 'text',
                text: `组件 "${componentName}" 未找到`
              }
            ],
            isError: true
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2)
            }
          ]
        };
      }

      case 'search_components': {
        const { query } = args as { query: string };
        const results = searchComponents(query);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  query,
                  count: results.length,
                  results: results.map(info => ({
                    name: info.name,
                    displayName: info.displayName,
                    description: info.description
                  }))
                },
                null,
                2
              )
            }
          ]
        };
      }

      case 'get_component_example': {
        const { componentName, exampleName } = args as { componentName: string; exampleName?: string };
        
        try {
          const fs = await import('fs');
          
          // 尝试从多个可能的位置查找示例目录
          const possibleDirs = [
            join(rootDir, 'node_modules', 'yun-elp', 'docs', 'components', componentName),
            join(rootDir, 'docs', 'components', componentName),
            join(rootDir, '..', 'docs', 'components', componentName),
            join(rootDir, '..', '..', '..', 'docs', 'components', componentName)
          ];
          
          let examplesDir: string | null = null;
          for (const dir of possibleDirs) {
            if (fs.existsSync(dir)) {
              examplesDir = dir;
              break;
            }
          }
          
          if (!examplesDir) {
            return {
              content: [
                {
                  type: 'text',
                  text: `组件 "${componentName}" 的示例目录不存在`
                }
              ],
              isError: true
            };
          }

          const files = fs.readdirSync(examplesDir).filter((f: string) => f.endsWith('.vue') && f !== 'index.vue');
          
          if (exampleName) {
            const exampleFile = files.find(f => f === `${exampleName}.vue` || f === exampleName);
            if (!exampleFile) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `示例 "${exampleName}" 未找到`
                  }
                ],
                isError: true
              };
            }
            const content = fs.readFileSync(join(examplesDir, exampleFile), 'utf-8');
            return {
              content: [
                {
                  type: 'text',
                  text: content
                }
              ]
            };
          } else {
            const examples: Record<string, string> = {};
            for (const file of files) {
              const name = file.replace('.vue', '');
              examples[name] = fs.readFileSync(join(examplesDir, file), 'utf-8');
            }
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(examples, null, 2)
                }
              ]
            };
          }
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `读取示例时出错: ${error instanceof Error ? error.message : String(error)}`
              }
            ],
            isError: true
          };
        }
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `未知的工具: ${name}`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `执行工具时出错: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    };
  }
});

// 列出所有资源
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const components = getAllComponents();

  return {
    resources: [
      {
        uri: 'yun-elp://components',
        name: '所有组件列表',
        description: '获取所有可用组件的列表',
        mimeType: 'application/json'
      },
      ...components.map(name => ({
        uri: `yun-elp://component/${name}`,
        name: `组件: ${name}`,
        description: `获取 ${name} 组件的完整文档`,
        mimeType: 'application/json'
      }))
    ]
  };
});

// 读取资源
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri === 'yun-elp://components') {
      const components = getAllComponents();
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(
              {
                components: components.map(name => ({
                  name,
                  displayName: parseComponentDoc(name)?.displayName || name,
                  description: parseComponentDoc(name)?.description || ''
                }))
              },
              null,
              2
            )
          }
        ]
      };
    }

    const match = uri.match(/^yun-elp:\/\/component\/(.+)$/);
    if (match) {
      const componentName = match[1];
      const info = parseComponentDoc(componentName);

      if (!info) {
        return {
          contents: [
            {
              uri,
              mimeType: 'text/plain',
              text: `组件 "${componentName}" 未找到`
            }
          ]
        };
      }

      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(info, null, 2)
          }
        ]
      };
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `未知的资源 URI: ${uri}`
        }
      ]
    };
  } catch (error) {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `读取资源时出错: ${error instanceof Error ? error.message : String(error)}`
        }
      ]
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('yun-elp MCP server running on stdio');
}

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});

