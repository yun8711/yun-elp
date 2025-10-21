import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ComponentTag {
  attributes: string[];
  description?: string;
  subtags?: string[];
}

interface TagsJson {
  [componentName: string]: ComponentTag;
}

interface MarkdownTableRow {
  [key: string]: string;
}

// 将驼峰命名转换为小写连字符格式
function toKebabCase(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
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

function isValidTableRow(row: MarkdownTableRow): boolean {
  // 检查是否是有效的表格行（不是分隔符或标题行）
  const values = Object.values(row);
  return values.some(value => value && !value.includes('---') && !value.includes('###'));
}

function generateTags(): void {
  const docsDir = resolve(__dirname, '../docs');
  const componentsDir = resolve(docsDir, 'components');

  const componentFiles = glob.sync('**/index.md', { cwd: componentsDir });

  const tags: TagsJson = {};

  componentFiles.forEach(file => {
    const filePath = resolve(componentsDir, file);
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: markdownContent } = matter(content);

    const componentName = data.title.split(' ')[0];
    const tagName = `y-${toKebabCase(componentName)}`;

    // 从文档中提取描述
    const description = data.description || markdownContent.split('\n')[0].replace(/^#+\s*/, '');

    // 解析Attributes表格
    const attributes = parseMarkdownTable(extractApiSection(markdownContent, 'Attributes'))
      .filter(isValidTableRow)
      .map(attr => {
        // 提取属性名，支持多种表头格式
        const attrName = attr['参数'] || attr['属性名'] || attr['name'] || '';
        // 转换为kebab-case
        return toKebabCase(attrName);
      })
      .filter(attr => attr && attr !== '参数' && attr !== '属性名' && attr !== 'name');

    // 创建组件标签信息
    const componentTag: ComponentTag = {
      attributes: attributes,
      description: description
    };

    tags[tagName] = componentTag;
  });

  // 生成到 dist 目录
  const distPath = resolve(__dirname, '../dist/tags.json');
  writeFileSync(distPath, JSON.stringify(tags, null, 2));

  console.log(`已生成 tags.json，包含 ${Object.keys(tags).length} 个组件`);
}

generateTags();
