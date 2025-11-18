import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../../../package.json'), 'utf-8'));

interface MarkdownTableRow {
  [key: string]: string;
}

interface ComponentProp {
  name: string;
  description?: string;
  type?: string | string[];
  default?: string;
}

interface ComponentSlot {
  name: string;
  description?: string;
  type?: string | string[];
}

interface ComponentEvent {
  name: string;
  description?: string;
  type?: string | string[];
}

interface ComponentExpose {
  name: string;
  description?: string;
  type?: string | string[];
}

interface ComponentData {
  name: string;
  description?: string;
  props?: ComponentProp[];
  slots?: ComponentSlot[];
  events?: ComponentEvent[];
  exposes?: ComponentExpose[];
}

interface ComponentsData {
  version: string;
  components: ComponentData[];
}

function parseMarkdownTable(content: string): MarkdownTableRow[] {
  if (!content.trim()) {
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 3) {
    return [];
  }

  // 查找表格开始的位置（表头行）
  let tableStartIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 检查是否是表格行（包含 | 且不是描述文字）
    if (
      line.includes('|') &&
      !line.includes('除了') &&
      !line.includes('支持') &&
      !line.includes('组件')
    ) {
      tableStartIndex = i;
      break;
    }
  }

  if (tableStartIndex === -1) {
    return [];
  }

  // 从表格开始位置提取表格内容
  const tableLines = lines.slice(tableStartIndex);
  if (tableLines.length < 3) {
    return [];
  }

  // 移除表头和分隔行
  const tableContent = tableLines.slice(2);

  // 处理表头，将转义的竖线替换为特殊字符
  const headers = tableLines[0]
    .replace(/\\\|/g, '___PIPE___')
    .split('|')
    .filter(Boolean)
    .map(h => h.trim().replace(/___PIPE___/g, '\\|'));

  const rows = tableContent.map(line => {
    const processedLine = line.replace(/\\\|/g, '___PIPE___');
    const cells = processedLine
      .split('|')
      .filter(Boolean)
      .map(c => c.trim().replace(/___PIPE___/g, '\\|'));

    return headers.reduce((obj, header, index) => {
      obj[header] = cells[index] || '';
      return obj;
    }, {} as MarkdownTableRow);
  });

  return rows;
}

function extractApiSection(content: string, section: string): string {
  // 首先查找 ## API 章节
  const apiRegex = /## API\s*\n([\s\S]*?)(?=\n## |$)/;
  const apiMatch = content.match(apiRegex);

  if (!apiMatch) {
    return '';
  }

  const apiContent = apiMatch[1];

  // 在 API 章节内查找指定的子章节
  const sectionRegex = new RegExp(`### ${section}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`);
  const match = apiContent.match(sectionRegex);

  if (!match) {
    return '';
  }

  return match[1].trim();
}

function parseType(type: string): string | string[] {
  if (!type) return '';

  // 处理包含 "/" 的联合类型（如 ^[string] / ^[number] / ^[boolean]）
  if (type.includes('/')) {
    const types = type.split('/').map(t => t.trim());
    const result: string[] = [];

    for (const t of types) {
      const customMatch = t.match(/\^\[([^\]]+)\]/);
      if (customMatch) {
        result.push(customMatch[1]);
      } else {
        result.push(t);
      }
    }

    // 对于联合类型，返回用 | 连接的字符串
    return result.join(' | ');
  }

  // 处理函数类型，提取反引号内的内容
  if (type.startsWith('^[Function]`') && type.includes('`')) {
    const functionMatch = type.match(/\^\[Function\]`([^`]+)`/);
    if (functionMatch) {
      // 处理转义的竖线
      let result = functionMatch[1].replace(/\\\|/g, '|');
      // 去掉开头和结尾的括号
      if (result.startsWith('(') && result.endsWith(')')) {
        result = result.slice(1, -1);
      }
      return result;
    }
  }

  // 处理对象类型，提取反引号内的内容
  if (type.startsWith('^[object]`') && type.includes('`')) {
    const objectMatch = type.match(/\^\[object\]`([^`]+)`/);
    if (objectMatch) {
      return objectMatch[1];
    }
  }

  // 处理枚举类型，提取反引号内的内容
  if (type.startsWith('^[enum]`') && type.includes('`')) {
    const enumMatch = type.match(/\^\[enum\]`([^`]+)`/);
    if (enumMatch) {
      // 处理转义的竖线
      return enumMatch[1].replace(/\\\|/g, '|');
    }
  }

  // 处理自定义语法 ^[type] 格式
  const customTypeMatch = type.match(/\^\[([^\]]+)\]/);
  if (customTypeMatch) {
    const extractedType = customTypeMatch[1];
    // 检查提取的类型是否包含联合类型
    if (extractedType.includes('|') && !extractedType.includes('\\|')) {
      return extractedType
        .split('|')
        .map(t => t.trim())
        .join(' | ');
    }
    return extractedType;
  }

  // 处理复杂数据类型，提取反引号中的内容（排除已经处理的函数、对象、枚举类型）
  if (
    !type.startsWith('^[Function]`') &&
    !type.startsWith('^[object]`') &&
    !type.startsWith('^[enum]`')
  ) {
    const backtickMatch = type.match(/`([^`]+)`/);
    if (backtickMatch) {
      const extractedType = backtickMatch[1].trim();
      // 检查提取的类型是否包含联合类型
      if (extractedType.includes('|') && !extractedType.includes('\\|')) {
        return extractedType
          .split('|')
          .map(t => t.trim())
          .join(' | ');
      }
      return extractedType;
    }
  }

  // 处理联合类型，注意处理转义的竖线
  if (type.includes('|') && !type.includes('\\|')) {
    return type
      .split('|')
      .map(t => t.trim())
      .join(' | ');
  }

  // 处理包含转义竖线的类型
  if (type.includes('\\|')) {
    return type.replace(/\\\|/g, '|');
  }

  // 清理类型字符串，移除markdown格式和反引号
  return type.replace(/\^\[/g, '').replace(/\]/g, '').replace(/`/g, '').trim();
}

function parseDefaultValue(value: string): string | undefined {
  if (value === '—' || !value) return undefined;

  // 处理字符串，移除多余的引号（单引号或反引号）
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('`') && value.endsWith('`'))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

// 将驼峰命名转换为小写连字符格式
function toKebabCase(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function isValidTableRow(row: MarkdownTableRow): boolean {
  // 检查是否是有效的表格行（不是分隔符或标题行）
  const values = Object.values(row);
  return values.some(value => value && !value.includes('---') && !value.includes('###'));
}

function generateComponentsData(): void {
  const docsDir = resolve(__dirname, '../../../docs');
  const componentsDir = resolve(docsDir, 'components');

  const componentFiles = glob.sync('**/index.md', { cwd: componentsDir });

  const components: ComponentData[] = [];

  componentFiles.forEach(file => {
    const filePath = resolve(componentsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    const componentName = data.title.split(' ')[0];

    // 只解析API文档中特定章节下的表格
    const attributes = parseMarkdownTable(extractApiSection(markdownContent, 'Attributes')).filter(
      isValidTableRow
    );
    const slots = parseMarkdownTable(extractApiSection(markdownContent, 'Slots')).filter(
      isValidTableRow
    );
    const events = parseMarkdownTable(extractApiSection(markdownContent, 'Events')).filter(
      isValidTableRow
    );
    const exposes = parseMarkdownTable(extractApiSection(markdownContent, 'Exposes')).filter(
      isValidTableRow
    );

    const componentData: ComponentData = {
      name: `Y${componentName}`,
      description: data.description,
      slots: slots
        .map(slot => {
          const slotData: ComponentSlot = {
            name: toKebabCase(slot['插槽名'] || slot['名称'] || slot['name']),
            description: slot['说明'] || slot['description']
          };

          const type = slot['参数'] || slot['类型'] || slot['type'];
          if (type && type !== '—') {
            slotData.type = parseType(type);
          }

          return slotData;
        })
        .filter(slot => slot.name && slot.name !== '参数'),
      props: attributes
        .map(attr => ({
          name: toKebabCase(attr['参数'] || attr['属性名'] || attr['name']),
          description: attr['说明'] || attr['description'],
          type: parseType(attr['类型'] || attr['type']),
          default: parseDefaultValue(attr['默认值'] || attr['default'])
        }))
        .filter(prop => prop.name && prop.name !== '参数'),
      events: events
        .map(event => ({
          name: toKebabCase(event['事件名'] || event['name']),
          description: event['说明'] || event['description'],
          type: parseType(event['回调参数'] || event['类型'] || event['type'])
        }))
        .filter(event => event.name && event.name !== '事件名'),
      exposes: exposes
        .map(expose => ({
          name: toKebabCase(expose['名称'] || expose['name']),
          description: expose['说明'] || expose['description'],
          type: parseType(expose['类型'] || expose['type'])
        }))
        .filter(expose => expose.name && expose.name !== '名称')
    };

    components.push(componentData);
  });

  const output: ComponentsData = {
    version: packageJson.version,
    components
  };

  // 生成到 mcp-server 的 data 目录
  const outputPath = resolve(__dirname, '../src/data/components-data.json');
  writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.warn(`已生成 components-data.json，包含 ${components.length} 个组件`);
}

generateComponentsData();
