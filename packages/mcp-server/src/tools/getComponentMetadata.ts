import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getComponentByName } from '../utils/components.js';

/**
 * 获取组件元数据
 * @param server
 */
export function registerGetComponentMetadata(server: McpServer) {
  server.registerTool(
    'get_component_metadata',
    {
      title: 'Get Component Metadata',
      description: 'Get detailed metadata for a specific component from the yun-elp component library',
      inputSchema: {
        componentName: z.string().describe('The name of the component to get metadata for (e.g., YButton, YTable)')
      },
      outputSchema: {
        component: z.object({
          name: z.string().describe('Component name'),
          description: z.string().describe('Component description'),
          props: z.array(z.object({
            name: z.string().describe('Property name'),
            description: z.string().describe('Property description'),
            type: z.string().describe('Property type'),
            default: z.string().optional().describe('Default value')
          })).optional().describe('Component properties'),
          slots: z.array(z.object({
            name: z.string().describe('Slot name'),
            description: z.string().describe('Slot description'),
            type: z.string().optional().describe('Slot type')
          })).optional().describe('Component slots'),
          events: z.array(z.object({
            name: z.string().describe('Event name'),
            description: z.string().describe('Event description'),
            type: z.string().optional().describe('Event type')
          })).optional().describe('Component events'),
          exposes: z.array(z.object({
            name: z.string().describe('Exposed method/property name'),
            description: z.string().describe('Exposed method/property description'),
            type: z.string().optional().describe('Exposed method/property type')
          })).optional().describe('Component exposes')
        }).optional().describe('Component metadata, null if component not found')
      },
    },
    async ({ componentName }) => {
      const component = getComponentByName(componentName);

      if (!component) {
        return {
          structuredContent: { component: null },
          content: [
            {
              type: 'text' as const,
              text: `Component "${componentName}" not found.`,
            },
          ],
        };
      }

      // 格式化组件元数据
      const formattedComponent = {
        name: component.name,
        description: component.description || '',
        props: component.props?.map(prop => ({
          name: prop.name,
          description: prop.description || '',
          type: Array.isArray(prop.type) ? prop.type.join(' | ') : prop.type || 'any',
          default: prop.default
        })),
        slots: component.slots?.map(slot => ({
          name: slot.name,
          description: slot.description || '',
          type: Array.isArray(slot.type) ? slot.type.join(' | ') : slot.type
        })),
        events: component.js?.events?.map(event => ({
          name: event.name,
          description: event.description || '',
          type: Array.isArray(event.type) ? event.type.join(' | ') : event.type
        })),
        exposes: component.exposes?.map(expose => ({
          name: expose.name,
          description: expose.description || '',
          type: Array.isArray(expose.type) ? expose.type.join(' | ') : expose.type
        }))
      };

      return {
        structuredContent: { component: formattedComponent },
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ component: formattedComponent }, null, 2),
          },
        ],
      };
    },
  );
}
