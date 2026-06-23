import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';
import { docsRoot, projRoot } from './paths';
import { getCamelCaseName, getComponentName } from './names';

const siteOrigin = process.env.YUN_ELP_SITE_ORIGIN || 'https://yun8711.github.io';
const siteBase = normalizeBase(process.env.YUN_ELP_SITE_BASE || '/yun-elp/');
const siteUrl = `${siteOrigin}${siteBase}`;
const docsPublicRoot = resolve(docsRoot, 'public');
const metadataRoot = resolve(docsPublicRoot, 'metadata');
const packageJson = JSON.parse(readFileSync(resolve(projRoot, 'package.json'), 'utf-8'));
const sidebarList = JSON.parse(
  readFileSync(resolve(docsRoot, '.vitepress/sidebar.json'), 'utf-8')
) as SidebarGroup[];

interface SidebarItem {
  text: string;
  link: string;
  activeMatch?: string;
}

interface SidebarGroup {
  text: string;
  items: SidebarItem[];
}

interface MarkdownTableRow {
  [key: string]: string;
}

interface ApiItem {
  name: string;
  description?: string;
  type?: string;
  default?: string;
}

interface ComponentMetadata {
  name: string;
  tag: string;
  title: string;
  description: string;
  category: string;
  docPath: string;
  docUrl: string;
  source: string;
  style: string;
  examples: ComponentExample[];
  props: ApiItem[];
  events: ApiItem[];
  slots: ApiItem[];
  exposes: ApiItem[];
  elementPlusReferences: string[];
}

interface ComponentExample {
  name: string;
  path: string;
  source: string;
}

interface ComponentsMetadata {
  name: string;
  version: string;
  description: string;
  homepage: string;
  source: string;
  components: ComponentMetadata[];
}

function normalizeBase(base: string) {
  const withStart = base.startsWith('/') ? base : `/${base}`;
  return withStart.endsWith('/') ? withStart : `${withStart}/`;
}

function joinUrl(path: string) {
  const cleanPath = path.replace(/^\//, '');
  return `${siteUrl}${cleanPath}`;
}

function getSidebarMap() {
  const map = new Map<string, { category: string; text: string }>();

  sidebarList.forEach(group => {
    group.items.forEach(item => {
      map.set(normalizeDocPath(item.link), {
        category: group.text,
        text: item.text
      });
    });
  });

  return map;
}

function normalizeDocPath(path: string) {
  const cleanPath = path.split('#')[0].replace(/\/$/, '');
  return cleanPath || '/';
}

function parseMarkdownTable(content: string): MarkdownTableRow[] {
  if (!content.trim()) {
    return [];
  }

  const lines = content.split('\n').filter(line => line.trim());
  const tableStartIndex = lines.findIndex(line => /^\s*\|.+\|\s*$/.test(line));

  if (tableStartIndex === -1 || lines.length < tableStartIndex + 3) {
    return [];
  }

  const headers = splitTableLine(lines[tableStartIndex]);
  const bodyLines = lines.slice(tableStartIndex + 2);

  return bodyLines
    .filter(line => /^\s*\|.+\|\s*$/.test(line))
    .map(line => {
      const cells = splitTableLine(line);

      return headers.reduce((row, header, index) => {
        row[header] = cells[index] || '';
        return row;
      }, {} as MarkdownTableRow);
    })
    .filter(row => Object.values(row).some(value => value && !value.includes('---')));
}

function splitTableLine(line: string) {
  return line
    .replace(/\\\|/g, '___PIPE___')
    .split('|')
    .slice(1, -1)
    .map(cell => cell.trim().replace(/___PIPE___/g, '\\|'));
}

function extractApiSection(content: string, section: string) {
  const apiMatch = content.match(/## API\s*\n([\s\S]*?)(?=\n## |$)/);

  if (!apiMatch) {
    return '';
  }

  const sectionRegex = new RegExp(`### ${section}\\s*\\n([\\s\\S]*?)(?=\\n### |$)`);
  return apiMatch[1].match(sectionRegex)?.[1]?.trim() || '';
}

function getCell(row: MarkdownTableRow, keys: string[]) {
  return keys
    .map(key => row[key])
    .find(Boolean)
    ?.trim();
}

function normalizeEmptyValue(value?: string) {
  if (!value || value === '—') {
    return undefined;
  }

  return value.replace(/\s+/g, ' ').trim();
}

function stripMarkdown(value?: string) {
  return normalizeEmptyValue(value)
    ?.replace(/\^\[([^\]]+)\]`([^`]+)`/g, '$2')
    .replace(/\^\[([^\]]+)\]/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\\\|/g, '|');
}

function parseApiItems(content: string, section: string, nameKeys: string[]): ApiItem[] {
  const headerNames = new Set(['属性名', '参数', '名称', '插槽名', '事件名', 'name']);

  const items = parseMarkdownTable(extractApiSection(content, section))
    .map(row => ({
      name: getCell(row, nameKeys) || '',
      description: stripMarkdown(getCell(row, ['说明', 'description'])),
      type: stripMarkdown(getCell(row, ['类型', '回调参数', '参数', 'type'])),
      default: stripMarkdown(getCell(row, ['默认值', 'default']))
    }))
    .filter(item => item.name && !headerNames.has(item.name));

  return [...new Map(items.map(item => [item.name, item])).values()];
}

function parseExamples(content: string): ComponentExample[] {
  const examples: ComponentExample[] = [];
  const demoRegex = /:{3,4}demo[^\n]*\n\s*([a-z0-9-]+\/[a-z0-9-]+)\s*\n:{3,4}/g;
  let match: RegExpExecArray | null;

  while ((match = demoRegex.exec(content))) {
    const demoPath = match[1];
    const name = demoPath.split('/').at(-1) || demoPath;

    examples.push({
      name,
      path: demoPath,
      source: `docs/components/${demoPath}.vue`
    });
  }

  return examples;
}

function parseElementPlusReferences(content: string) {
  const refs = new Set<string>();
  const linkRegex = /\[[^\]]+\]\((https:\/\/element-plus\.org\/[^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(content))) {
    refs.add(match[1]);
  }

  return [...refs];
}

function buildComponentsMetadata(): ComponentsMetadata {
  const sidebarMap = getSidebarMap();
  const componentsDir = resolve(docsRoot, 'components');
  const componentFiles = glob.sync('*/index.md', { cwd: componentsDir }).sort();

  const components = componentFiles.map(file => {
    const slug = file.split('/')[0];
    const filePath = resolve(componentsDir, file);
    const raw = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const docPath = `/components/${slug}/`;
    const sidebarInfo = sidebarMap.get(normalizeDocPath(docPath));
    const title = data.title || getCamelCaseName(slug);
    const componentName = title.startsWith('Y') ? title : getCamelCaseName(slug, true);
    const tag = getComponentName(slug);

    return {
      name: componentName,
      tag,
      title: sidebarInfo?.text || `${slug} ${title}`,
      description: data.description || extractFirstParagraph(content),
      category: sidebarInfo?.category || '其他',
      docPath,
      docUrl: joinUrl(docPath),
      source: `packages/components/src/${slug}`,
      style: `packages/theme-chalk/src/${slug}.scss`,
      examples: parseExamples(content),
      props: parseApiItems(content, 'Attributes', ['属性名', '参数', 'name']),
      events: parseApiItems(content, 'Events', ['事件名', '名称', 'name']),
      slots: parseApiItems(content, 'Slots', ['名称', '插槽名', 'name']),
      exposes: parseApiItems(content, 'Exposes', ['名称', 'name']),
      elementPlusReferences: parseElementPlusReferences(content)
    };
  });

  return {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    homepage: siteUrl,
    source: 'docs/components/*/index.md',
    components
  };
}

function extractFirstParagraph(content: string) {
  return (
    content
      .split('\n')
      .map(line => line.trim())
      .find(line => line && !line.startsWith('#') && !line.startsWith(':::')) || ''
  );
}

function writeTextFile(path: string, content: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${content.trim()}\n`);
}

function buildLlmsTxt(metadata: ComponentsMetadata) {
  const componentLinks = metadata.components
    .map(component => `- ${component.name} (${component.tag}): ${component.docUrl}`)
    .join('\n');

  return `
# YUN-ELP

YUN-ELP 是基于 Element Plus 的 Vue 3 业务组件库，提供业务场景中的二次封装组件、自动导入 resolver、主题和国际化能力。

## 核心入口

- 文档首页: ${siteUrl}
- 快速开始: ${joinUrl('/guide/quickstart')}
- AI 使用指南: ${joinUrl('/guide/ai-usage')}
- 组件列表: ${joinUrl('/components/button/')}
- 组件元数据: ${joinUrl('/metadata/components.json')}
- npm: https://www.npmjs.com/package/yun-elp
- GitHub: https://github.com/yun8711/yun-elp

## 使用约定

- 推荐使用 Vue 3.5+、Element Plus 2.14+ 和 TypeScript。
- 推荐通过 YunElpResolver 和 YunElpAutoImportResolver 配置自动导入。
- 组件标签统一使用 y- 前缀，例如 y-button、y-form、y-form-item。
- YUN-ELP 是 Element Plus 的业务封装，不是 Element Plus 的替代品；未扩展的 API 通常透传给 Element Plus 原组件。

## 组件文档

${componentLinks}
`;
}

function buildLlmsFullTxt(metadata: ComponentsMetadata) {
  const componentSections = metadata.components
    .map(component => {
      const props = component.props
        .slice(0, 20)
        .map(
          prop => `  - ${prop.name}: ${prop.description || ''}${prop.type ? ` (${prop.type})` : ''}`
        )
        .join('\n');
      const events = component.events
        .map(
          event =>
            `  - ${event.name}: ${event.description || ''}${event.type ? ` (${event.type})` : ''}`
        )
        .join('\n');
      const slots = component.slots
        .map(slot => `  - ${slot.name}: ${slot.description || ''}`)
        .join('\n');

      return `
## ${component.name} (${component.tag})

${component.description}

- 分类: ${component.category}
- 文档: ${component.docUrl}
- 源码: ${component.source}

### Props

${props || '  - 无扩展属性或文档未声明'}

### Events

${events || '  - 无扩展事件或文档未声明'}

### Slots

${slots || '  - 无扩展插槽或文档未声明'}
`;
    })
    .join('\n');

  return `${buildLlmsTxt(metadata)}

# 组件摘要

${componentSections}
`;
}

function buildRobotsTxt() {
  return `
User-agent: *
Allow: /

Sitemap: ${joinUrl('/sitemap.xml')}
`;
}

function buildSitemapXml(metadata: ComponentsMetadata) {
  const staticPaths = [
    '/',
    '/guide/overview',
    '/guide/quickstart',
    '/guide/i18n',
    '/guide/theme',
    '/guide/mcp',
    '/guide/ai-usage',
    '/guide/development',
    '/llms.txt',
    '/llms-full.txt',
    '/metadata/components.json'
  ];
  const urls = [...staticPaths, ...metadata.components.map(component => component.docPath)];
  const uniqueUrls = [...new Set(urls)];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls
  .map(
    url => `  <url>
    <loc>${joinUrl(url)}</loc>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

function generateAiDocs() {
  // 创建 metadata 目录
  mkdirSync(metadataRoot, { recursive: true });

  const metadata = buildComponentsMetadata();

  writeTextFile(resolve(metadataRoot, 'components.json'), JSON.stringify(metadata, null, 2));
  writeTextFile(resolve(docsPublicRoot, 'llms.txt'), buildLlmsTxt(metadata));
  writeTextFile(resolve(docsPublicRoot, 'llms-full.txt'), buildLlmsFullTxt(metadata));
  writeTextFile(resolve(docsPublicRoot, 'robots.txt'), buildRobotsTxt());
  writeTextFile(resolve(docsPublicRoot, 'sitemap.xml'), buildSitemapXml(metadata));

  console.log(`已生成 AI 文档资源，包含 ${metadata.components.length} 个组件`);
}

generateAiDocs();
