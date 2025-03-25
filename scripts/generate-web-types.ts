import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

interface WebType {
  name: string;
  description?: string;
  'doc-url'?: string;
  attributes?: {
    name: string;
    description?: string;
    value?: {
      type: string;
      kind: string;
    };
    default?: string;
  }[];
  slots?: {
    name: string;
    description?: string;
  }[];
  events?: {
    name: string;
    description?: string;
    arguments?: {
      name: string;
      type: string;
      description?: string;
    }[];
  }[];
  exposes?: {
    name: string;
    description?: string;
    type: string;
  }[];
}

function parseMarkdownTable(content: string): Record<string, string>[] {
  const lines = content.split('\n');
  const headers = lines[0]
    .split('|')
    .filter(Boolean)
    .map(h => h.trim());
  const rows = lines.slice(2).map(line => {
    const cells = line
      .split('|')
      .filter(Boolean)
      .map(c => c.trim());
    return headers.reduce(
      (obj, header, index) => {
        obj[header] = cells[index];
        return obj;
      },
      {} as Record<string, string>
    );
  });
  return rows;
}

function extractApiSection(content: string, section: string): string {
  const regex = new RegExp(`### ${section}\\n\\n([\\s\\S]*?)(?=\n### |$)`);
  const match = content.match(regex);
  return match ? match[1] : '';
}

function generateWebTypes(): void {
  const docsDir = resolve(__dirname, '../docs');
  const componentsDir = resolve(docsDir, 'components');
  const componentFiles = glob.sync('**/index.md', { cwd: componentsDir });
  const webTypes: WebType[] = [];

  componentFiles.forEach(file => {
    const content = readFileSync(resolve(componentsDir, file), 'utf-8');
    const { data, content: markdownContent } = matter(content);
    const componentName = data.title.split(' ')[0];

    const attributes = parseMarkdownTable(extractApiSection(markdownContent, '属性'));
    const slots = parseMarkdownTable(extractApiSection(markdownContent, '插槽'));
    const events = parseMarkdownTable(extractApiSection(markdownContent, '事件'));
    const exposes = parseMarkdownTable(extractApiSection(markdownContent, '暴露'));

    const webType: WebType = {
      name: componentName,
      description: data.description,
      'doc-url': `/components/${file.replace('/index.md', '')}`,
      attributes: attributes.map(attr => ({
        name: attr['属性名'],
        description: attr['说明'],
        value: {
          type: attr['类型'],
          kind: 'expression'
        },
        default: attr['默认值'] === '—' ? undefined : attr['默认值']
      })),
      slots: slots.map(slot => ({
        name: slot['插槽名'],
        description: slot['说明']
      })),
      events: events.map(event => ({
        name: event['事件名'],
        description: event['说明'],
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
    name: 'kd-elp3',
    version: '1.0.0',
    contributions: {
      html: {
        'vue-components': webTypes
      }
    }
  };

  // 同时生成到 dist 目录和 packages/components 目录
  const distPath = resolve(__dirname, '../dist/web-types.json');
  const componentsPath = resolve(__dirname, '../packages/components/web-types.json');

  writeFileSync(distPath, JSON.stringify(output, null, 2));
  writeFileSync(componentsPath, JSON.stringify(output, null, 2));

  console.log(`已生成 web-types.json，包含 ${webTypes.length} 个组件`);
}

generateWebTypes();
