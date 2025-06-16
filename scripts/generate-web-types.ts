import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf-8'));

interface WebType {
  name: string;
  source?: {
    symbol: string;
  };
  description?: string;
  'doc-url'?: string;
  props?: WebTypeProp[];
  slots?: WebTypeSlot[];
  events?: WebTypeEvent[];
  exposes?: WebTypeExpose[];
}

interface WebTypeProp {
  name: string;
  description?: string;
  'doc-url'?: string;
  type: (string | { name: string; source: { symbol: string; module: string } })[];
  default?: string | boolean | number;
}

interface WebTypeSlot {
  name: string;
  description?: string;
  'doc-url'?: string;
}

interface WebTypeEvent {
  name: string;
  description?: string;
  'doc-url'?: string;
  arguments?: {
    name: string;
    type: string;
    description?: string;
  }[];
}

interface WebTypeExpose {
  name: string;
  description?: string;
  type: string;
}

interface MarkdownTableRow {
  [key: string]: string;
}

function parseMarkdownTable(content: string): MarkdownTableRow[] {
  if (!content.trim()) {
    // console.log('Empty content for table parsing');
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length < 3) {
    // console.log('Not enough lines for table:', lines);
    return [];
  }

  // 移除表头和分隔行
  const tableContent = lines.slice(2);

  // 处理表头，将转义的竖线替换为特殊字符
  const headers = lines[0]
    .replace(/\\\|/g, '___PIPE___') // 先将转义的竖线替换为特殊字符
    .split('|')
    .filter(Boolean)
    .map(h => h.trim().replace(/___PIPE___/g, '\\|')); // 恢复转义的竖线

  // console.log('Table headers:', headers);

  const rows = tableContent.map(line => {
    // 处理每一行，将转义的竖线替换为特殊字符
    const processedLine = line.replace(/\\\|/g, '___PIPE___');
    const cells = processedLine
      .split('|')
      .filter(Boolean)
      .map(c => c.trim().replace(/___PIPE___/g, '\\|')); // 恢复转义的竖线

    return headers.reduce((obj, header, index) => {
      obj[header] = cells[index] || '';
      return obj;
    }, {} as MarkdownTableRow);
  });

  // console.log('Parsed table rows:', rows);
  return rows;
}

function extractApiSection(content: string, section: string): string {
  // console.log(`Extracting ${section} section...`);
  // 只要出现 ### ${section} 就匹配
  const regex = new RegExp(`### ${section}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`);
  const match = content.match(regex);
  if (!match) {
    // console.log(`No match found for ${section}`);
    return '';
  }
  const tableContent = match[1].trim();
  // console.log(`Found ${section} content:`, tableContent);
  return tableContent;
}

function parseType(
  type: string
): (string | { name: string; source: { symbol: string; module: string } })[] {
  // 处理联合类型，注意处理转义的竖线
  if (type.includes('|') && !type.includes('\\|')) {
    return type.split('|').map(t => t.trim());
  }
  // 处理包含转义竖线的类型
  if (type.includes('\\|')) {
    // 移除转义符号，将 \| 替换为 |
    return [type.replace(/\\\|/g, '|')];
  }
  // 处理特殊类型
  if (type.includes('Component')) {
    return [type, { name: 'Component', source: { symbol: 'Component', module: 'vue' } }];
  }
  return [type];
}

function parseDefaultValue(value: string, type: string): string | boolean | number | undefined {
  if (value === '—' || !value) return undefined;

  // 处理布尔值
  if (type === 'boolean') {
    return value === 'true';
  }

  // 处理数字
  if (type === 'number' || type.includes('number')) {
    const num = Number(value);
    if (!isNaN(num)) {
      return num;
    }
  }

  // 处理字符串，移除多余的引号
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }

  return value;
}

function generateWebTypes(): void {
  const docsDir = resolve(__dirname, '../docs');
  const componentsDir = resolve(docsDir, 'components');
  // console.log('Components directory:', componentsDir);

  const componentFiles = glob.sync('**/index.md', { cwd: componentsDir });
  // console.log('Found component files:', componentFiles);

  const webTypes: WebType[] = [];

  componentFiles.forEach(file => {
    // console.log(`\nProcessing file: ${file}`);
    const filePath = resolve(componentsDir, file);
    // console.log('Full file path:', filePath);

    const content = readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);
    // console.log('Front matter data:', data);

    const componentName = data.title.split(' ')[0];
    // console.log('Component name:', componentName);

    const attributes = parseMarkdownTable(extractApiSection(markdownContent, 'Attributes'));
    const slots = parseMarkdownTable(extractApiSection(markdownContent, 'Slots'));
    const events = parseMarkdownTable(extractApiSection(markdownContent, 'Events'));
    const exposes = parseMarkdownTable(extractApiSection(markdownContent, 'Exposes'));

    // console.log('Parsed sections:', {
    // attributes,
    // slots,
    // events,
    // exposes
    // });

    const webType: WebType = {
      name: `y-${componentName.toLowerCase()}`,
      source: {
        symbol: `Y${componentName}`
      },
      description: data.description,
      'doc-url': `/components/${file.replace('/index.md', '')}`,
      props: attributes.map(attr => {
        const type = parseType(attr['类型']);
        return {
          name: attr['属性名'],
          description: attr['说明'],
          'doc-url': `/components/${file.replace('/index.md', '')}#attributes`,
          type,
          default: parseDefaultValue(attr['默认值'], type[0].toString())
        };
      }),
      slots: slots.map(slot => ({
        name: slot['插槽名'],
        description: slot['说明'],
        'doc-url': `/components/${file.replace('/index.md', '')}#slots`
      })),
      events: events.map(event => ({
        name: event['事件名'],
        description: event['说明'],
        'doc-url': `/components/${file.replace('/index.md', '')}#events`,
        arguments: event['回调参数']
          ? [
              {
                name: 'event',
                type: event['回调参数'],
                description: '事件对象'
              }
            ]
          : undefined
      })),
      exposes: exposes.map(expose => ({
        name: expose['名称'],
        description: expose['说明'],
        type: expose['类型']
      }))
    };

    webTypes.push(webType);
  });

  const output = {
    $schema: 'https://json.schemastore.org/web-types',
    framework: 'vue',
    name: packageJson.name,
    version: packageJson.version,
    contributions: {
      html: {
        'vue-components': webTypes
      }
    }
  };

  // 同时生成到 dist 目录和 packages/components 目录
  const distPath = resolve(__dirname, '../dist/web-types.json');

  writeFileSync(distPath, JSON.stringify(output, null, 2));

  console.log(`已生成 web-types.json，包含 ${webTypes.length} 个组件`);
}

generateWebTypes();
