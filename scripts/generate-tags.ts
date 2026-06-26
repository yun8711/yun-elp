import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import {
  extractApiSection,
  isValidTableRow,
  normalizeApiPropName,
  parseMarkdownTable
} from './markdown-table';

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

// 将驼峰命名转换为小写连字符格式
function toKebabCase(str: string | undefined): string {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
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
        return normalizeApiPropName(attrName);
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
