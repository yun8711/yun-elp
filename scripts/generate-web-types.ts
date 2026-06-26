import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import { joinUrl } from './site-url';
import {
  extractApiSection,
  isValidTableRow,
  normalizeApiPropName,
  parseMarkdownTable
} from './markdown-table';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

interface WebType {
  name: string;
  description?: string;
  'doc-url'?: string;
  source?: {
    symbol: string;
  };
  slots?: WebTypeSlot[];
  attributes?: WebTypeAttribute[];
  props?: WebTypeProp[];
  js?: {
    events?: WebTypeEvent[];
  };
  exposes?: WebTypeExpose[];
}

interface WebTypeSlot {
  name: string;
  description?: string;
  'doc-url'?: string;
  type?: string | string[];
}

interface WebTypeAttribute {
  name: string;
  description?: string;
  'doc-url'?: string;
  type?: string | string[];
  default?: string;
}

interface WebTypeProp {
  name: string;
  description?: string;
  'doc-url'?: string;
  type?: string | string[];
  default?: string;
}

interface WebTypeEvent {
  name: string;
  description?: string;
  'doc-url'?: string;
  type?: string | string[];
  default?: string;
}

interface WebTypeExpose {
  name: string;
  description?: string;
  'doc-url'?: string;
  type?: string | string[];
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

function generateWebTypes(): void {
  const docsDir = resolve(__dirname, '../docs');
  const componentsDir = resolve(docsDir, 'components');

  const componentFiles = glob.sync('**/index.md', { cwd: componentsDir });

  const webTypes: WebType[] = [];

  componentFiles.forEach(file => {
    const filePath = resolve(componentsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    const slug = file.split('/')[0];
    const componentName = data.title.split(' ')[0];
    const docUrl = joinUrl(`/components/${slug}/`);

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

    const webType: WebType = {
      name: `Y${componentName}`,
      description: data.description,
      'doc-url': docUrl,
      source: {
        symbol: `Y${componentName}`
      },
      slots: slots
        .map(slot => {
          const slotData: WebTypeSlot = {
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
          name: normalizeApiPropName(attr['参数'] || attr['属性名'] || attr['name']),
          description: attr['说明'] || attr['description'],
          type: parseType(attr['类型'] || attr['type']),
          default: parseDefaultValue(attr['默认值'] || attr['default'])
        }))
        .filter(prop => prop.name && prop.name !== '参数'),
      js: {
        events: events
          .map(event => ({
            name: toKebabCase(event['事件名'] || event['name']),
            description: event['说明'] || event['description'],
            type: parseType(event['回调参数'] || event['类型'] || event['type']),
            default: parseDefaultValue(event['默认值'] || event['default'])
          }))
          .filter(event => event.name && event.name !== '事件名')
      },
      exposes: exposes
        .map(expose => ({
          name: toKebabCase(expose['名称'] || expose['name']),
          description: expose['说明'] || expose['description'],
          type: parseType(expose['类型'] || expose['type'])
        }))
        .filter(expose => expose.name && expose.name !== '名称')
    };

    webTypes.push(webType);
  });

  const output = {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    framework: 'vue',
    name: packageJson.name,
    version: packageJson.version,
    'js-types-syntax': 'typescript',
    contributions: {
      html: {
        'vue-components': webTypes
      }
    }
  };

  // 生成到 dist 目录
  const distPath = resolve(__dirname, '../dist/web-types.json');
  writeFileSync(distPath, JSON.stringify(output, null, 2));

  console.log(`已生成 web-types.json，包含 ${webTypes.length} 个组件`);
}

generateWebTypes();
