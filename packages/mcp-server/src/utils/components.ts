/**
 * 组件数据，从 components-data.json 解析得到
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface ComponentInfo {
  tagName: string;
  description: string;
  docUrl: string;
  usage: string;
}

export interface ComponentData {
  name: string;
  description?: string;
  props?: Array<{
    name: string;
    description?: string;
    type?: string | string[];
    default?: string;
  }>;
  slots?: Array<{
    name: string;
    description?: string;
    type?: string | string[];
  }>;
  events?: Array<{
    name: string;
    description?: string;
    type?: string | string[];
  }>;
  exposes?: Array<{
    name: string;
    description?: string;
    type?: string | string[];
  }>;
}

export interface ComponentsData {
  version: string;
  components: ComponentData[];
}

/**
 * 加载 components-data.json 数据
 */
function loadComponentsData(): ComponentsData | null {
  try {
    const componentsDataPath = join(__dirname, 'components-data.json');
    const data = readFileSync(componentsDataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load components-data.json:', error);
    return null;
  }
}

/**
 * 获取所有组件信息
 */
export function getAllComponents(): ComponentInfo[] {
  const componentsData = loadComponentsData();
  if (!componentsData) {
    return [];
  }

  const components = componentsData.components;

  return components.map(component => ({
    tagName: component.name,
    description: component.description || '暂无描述',
    docUrl: `https://yun-elp-docs.vercel.app/components/${component.name.toLowerCase().replace('y', '')}/index.html`,
    usage: generateUsageSnippet(component)
  }));
}

/**
 * 根据组件信息生成使用示例
 */
function generateUsageSnippet(component: ComponentData): string {
  const tagName = component.name;

  // 基础使用示例
  let usage = `<${tagName}></${tagName}>`;

  // 如果有常用属性，添加到示例中
  const commonProps = component.props?.slice(0, 3) || []; // 取前3个属性作为示例

  if (commonProps.length > 0) {
    const propsStr = commonProps
      .filter(prop => prop.name !== 'key' && prop.name !== 'ref')
      .map(prop => {
        if (prop.default && prop.default !== 'undefined') {
          return `${prop.name}="${prop.default.replace(/['"]/g, '')}"`;
        }
        return `${prop.name}="value"`;
      })
      .join(' ');

    if (propsStr) {
      usage = `<${tagName} ${propsStr}></${tagName}>`;
    }
  }

  return usage;
}

/**
 * 根据组件名称获取组件详细信息
 */
export function getComponentByName(name: string): ComponentData | undefined {
  const componentsData = loadComponentsData();
  if (!componentsData) {
    return undefined;
  }

  const components = componentsData.components;
  return components.find(component => component.name === name);
}

/**
 * 搜索组件
 */
export function searchComponents(query: string): ComponentInfo[] {
  const allComponents = getAllComponents();
  const lowerQuery = query.toLowerCase();

  return allComponents.filter(component =>
    component.tagName.toLowerCase().includes(lowerQuery) ||
    component.description.toLowerCase().includes(lowerQuery)
  );
}
