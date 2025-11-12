import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
// 在构建后的文件中，需要从 dist/mcp-server/src/utils 向上查找项目根目录
// 构建后路径: dist/mcp-server/src/utils/component-parser.js -> 需要找到项目根目录
const rootDir = resolve(__dirname, '../../../../..');

export interface ComponentInfo {
  name: string;
  displayName: string;
  description: string;
  attributes?: AttributeInfo[];
  events?: EventInfo[];
  slots?: SlotInfo[];
  exposes?: ExposeInfo[];
  examples?: string[];
}

export interface AttributeInfo {
  name: string;
  description: string;
  type: string;
  defaultValue?: string;
}

export interface EventInfo {
  name: string;
  description: string;
  type: string;
}

export interface SlotInfo {
  name: string;
  description: string;
  params?: string;
}

export interface ExposeInfo {
  name: string;
  description: string;
  type: string;
}

/**
 * 解析组件文档 markdown 文件
 * 优先从 node_modules 中查找（消费项目），如果不存在则从项目根目录查找（开发环境）
 */
export function parseComponentDoc(componentName: string): ComponentInfo | null {
  // 尝试从多个可能的位置查找文档
  const possiblePaths = [
    // 消费项目：从 node_modules/yun-elp 查找
    join(rootDir, 'node_modules', 'yun-elp', 'docs', 'components', componentName, 'index.md'),
    // 开发环境：从项目根目录查找
    join(rootDir, 'docs', 'components', componentName, 'index.md'),
    // 如果 rootDir 已经是 dist，向上查找
    join(rootDir, '..', 'docs', 'components', componentName, 'index.md'),
    // 如果 rootDir 是 dist/mcp-server/src，向上查找
    join(rootDir, '..', '..', '..', 'docs', 'components', componentName, 'index.md')
  ];

  let docPath: string | null = null;
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      docPath = path;
      break;
    }
  }

  if (!docPath) {
    return null;
  }

  const content = readFileSync(docPath, 'utf-8');
  const lines = content.split('\n');

  // 提取 frontmatter
  const frontmatter: Record<string, string> = {};
  let frontmatterEnd = 0;

  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        frontmatterEnd = i;
        break;
      }
      const match = lines[i].match(/^(\w+):\s*(.+)$/);
      if (match) {
        frontmatter[match[1]] = match[2];
      }
    }
  }

  const info: ComponentInfo = {
    name: componentName,
    displayName: frontmatter.title || componentName,
    description: frontmatter.description || '',
    attributes: [],
    events: [],
    slots: [],
    exposes: []
  };

  // 解析 API 部分
  let currentSection: 'attributes' | 'events' | 'slots' | 'exposes' | null = null;
  let inTable = false;
  let tableHeader: string[] = [];

  for (let i = frontmatterEnd + 1; i < lines.length; i++) {
    const line = lines[i].trim();

    // 检测 API 章节
    if (line === '### Attributes') {
      currentSection = 'attributes';
      inTable = false;
      continue;
    } else if (line === '### Events') {
      currentSection = 'events';
      inTable = false;
      continue;
    } else if (line === '### Slots') {
      currentSection = 'slots';
      inTable = false;
      continue;
    } else if (line === '### Exposes') {
      currentSection = 'exposes';
      inTable = false;
      continue;
    }

    // 检测表格
    if (line.startsWith('|') && line.includes('属性名') || line.includes('事件名') || line.includes('名称')) {
      inTable = true;
      tableHeader = line.split('|').map(c => c.trim()).filter(c => c);
      continue;
    }

    // 解析表格行
    if (inTable && line.startsWith('|') && currentSection) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      if (cells.length >= 2 && cells[0] !== '属性名' && cells[0] !== '事件名' && cells[0] !== '名称') {
        const row: Record<string, string> = {};
        tableHeader.forEach((header, index) => {
          if (cells[index]) {
            row[header] = cells[index];
          }
        });

        if (currentSection === 'attributes' && row['属性名']) {
          info.attributes!.push({
            name: row['属性名'],
            description: row['说明'] || '',
            type: row['类型'] || '',
            defaultValue: row['默认值'] || undefined
          });
        } else if (currentSection === 'events' && row['事件名']) {
          info.events!.push({
            name: row['事件名'],
            description: row['说明'] || '',
            type: row['类型'] || ''
          });
        } else if (currentSection === 'slots' && row['名称']) {
          info.slots!.push({
            name: row['名称'],
            description: row['说明'] || '',
            params: row['参数'] || undefined
          });
        } else if (currentSection === 'exposes' && row['名称']) {
          info.exposes!.push({
            name: row['名称'],
            description: row['说明'] || '',
            type: row['类型'] || ''
          });
        }
      }
    }

    // 检测表格结束
    if (inTable && !line.startsWith('|') && line !== '') {
      inTable = false;
    }
  }

  return info;
}

/**
 * 获取所有组件列表
 * 优先从 node_modules 中查找（消费项目），如果不存在则从项目根目录查找（开发环境）
 */
export function getAllComponents(): string[] {
  // 尝试从多个可能的位置查找文档目录
  const possibleDirs = [
    // 消费项目：从 node_modules/yun-elp 查找
    join(rootDir, 'node_modules', 'yun-elp', 'docs', 'components'),
    // 开发环境：从项目根目录查找
    join(rootDir, 'docs', 'components'),
    // 如果 rootDir 已经是 dist，向上查找
    join(rootDir, '..', 'docs', 'components'),
    // 如果 rootDir 是 dist/mcp-server/src，向上查找
    join(rootDir, '..', '..', '..', 'docs', 'components')
  ];

  let componentsDir: string | null = null;
  for (const dir of possibleDirs) {
    if (existsSync(dir)) {
      componentsDir = dir;
      break;
    }
  }

  if (!componentsDir) {
    return [];
  }

  try {
    return readdirSync(componentsDir)
      .filter((item: string) => {
        const itemPath = join(componentsDir, item);
        return statSync(itemPath).isDirectory();
      })
      .sort();
  } catch {
    return [];
  }
}

/**
 * 搜索组件
 */
export function searchComponents(query: string): ComponentInfo[] {
  const components = getAllComponents();
  const results: ComponentInfo[] = [];

  const lowerQuery = query.toLowerCase();

  for (const componentName of components) {
    const info = parseComponentDoc(componentName);
    if (!info) continue;

    // 搜索组件名、显示名、描述
    if (
      componentName.toLowerCase().includes(lowerQuery) ||
      info.displayName.toLowerCase().includes(lowerQuery) ||
      info.description.toLowerCase().includes(lowerQuery)
    ) {
      results.push(info);
    }
  }

  return results;
}

