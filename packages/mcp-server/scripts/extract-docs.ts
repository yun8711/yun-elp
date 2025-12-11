import { dirname, resolve, join } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
  ComponentModel,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  ComponentMethod
} from '../src/types/index.ts';

// =============================================
// 配置路径：yun-elp组件路径
// =============================================
// 本项目绝对路径
const projectPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');
// yun-elp组件源码目录
const COMPONENTS_SRC = resolve(projectPath, 'packages/components/src');
// yun-elp文档目录
const DOCS_DIR_ZH = join(projectPath, 'docs/components');
// web-types.json路径
const WEB_TYPES_PATH = join(projectPath, 'dist/web-types.json');
// 输出组件数据文件路径
const OUTPUT = resolve(projectPath, 'packages/mcp-server/src/metadata/components.ts');
// 输出文档和类型文件目录
const DOCS_OUTPUT_DIR = resolve(projectPath, 'packages/mcp-server/src/examples');

// =========================================================
// 读取 web-types.json
// =========================================================
function loadWebTypes() {
  if (!fs.existsSync(WEB_TYPES_PATH)) {
    console.warn('⚠️ web-types.json not found:', WEB_TYPES_PATH);
    return null;
  }
  return JSON.parse(fs.readFileSync(WEB_TYPES_PATH, 'utf-8'));
}

// =========================================================
// 读取组件的 index.md 文档
// =========================================================
function readComponentDoc(componentName: string): string {
  const docPath = join(DOCS_DIR_ZH, componentName, 'index.md');
  if (!fs.existsSync(docPath)) {
    return '';
  }
  return fs.readFileSync(docPath, 'utf-8');
}

// =========================================================
// 从 markdown 提取说明部分和用法示例信息
// =========================================================
function parseMarkdown(md: string) {
  const lines = md.split('\n');
  let description = '';
  let inDescriptionSection = false;
  let inExamplesSection = false;
  const examples: Array<{ title: string; description: string; file: string }> = [];
  let currentExampleTitle = '';
  let currentExampleDesc = '';
  let currentExampleFile = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 检测 "## 说明" 部分
    if (trimmedLine === '## 说明' || trimmedLine.startsWith('## 说明')) {
      inDescriptionSection = true;
      inExamplesSection = false;
      continue;
    }

    // 检测 "## 用法示例" 部分
    if (trimmedLine === '## 用法示例' || trimmedLine.startsWith('## 用法示例')) {
      inDescriptionSection = false;
      inExamplesSection = true;
      continue;
    }

    // 检测下一个主要章节（## 开头），结束当前部分
    if (trimmedLine.startsWith('## ') && trimmedLine !== '## 说明' && trimmedLine !== '## 用法示例') {
      inDescriptionSection = false;
      inExamplesSection = false;
    }

    // 提取说明部分内容
    if (inDescriptionSection && !trimmedLine.startsWith('##')) {
      if (trimmedLine) {
        description += (description ? '\n' : '') + trimmedLine;
      }
    }

    // 提取用法示例部分
    if (inExamplesSection) {
      // 检测示例标题（### 开头）
      if (trimmedLine.startsWith('### ')) {
        // 保存上一个示例
        if (currentExampleFile) {
          examples.push({
            title: currentExampleTitle,
            description: currentExampleDesc,
            file: currentExampleFile
          });
        }
        // 开始新示例
        currentExampleTitle = trimmedLine.replace(/^###\s+/, '');
        currentExampleDesc = '';
        currentExampleFile = '';
        continue;
      }

      // 检测 :::demo 块开始
      if (trimmedLine.includes(':::demo')) {
        // 提取描述（可能在 :::demo 同一行）
        const demoMatch = trimmedLine.match(/:::demo\s+(.+)/);
        if (demoMatch) {
          currentExampleDesc = demoMatch[1].trim();
        }
        continue;
      }

      // 检测 :::demo 块结束
      if (trimmedLine === ':::') {
        // 如果已经有文件路径，保存示例
        if (currentExampleFile) {
          examples.push({
            title: currentExampleTitle,
            description: currentExampleDesc,
            file: currentExampleFile
          });
          // 重置当前示例状态
          currentExampleTitle = '';
          currentExampleDesc = '';
          currentExampleFile = '';
        }
        continue;
      }

      // 检测示例文件路径（格式：组件名/文件名，在 :::demo 和 ::: 之间）
      if (trimmedLine && !trimmedLine.startsWith(':::')) {
        const fileMatch = trimmedLine.match(/^([\w-]+\/[\w-]+)$/);
        if (fileMatch) {
          // 提取文件名部分（去掉组件名前缀）
          const parts = fileMatch[1].split('/');
          if (parts.length === 2) {
            currentExampleFile = parts[1]; // 只保留文件名部分
          } else {
            currentExampleFile = fileMatch[1];
          }
        } else if (!currentExampleFile && trimmedLine && !trimmedLine.startsWith('#')) {
          // 如果还没有文件路径，且不是空行或标题，可能是描述文本
          if (!currentExampleDesc) {
            currentExampleDesc = trimmedLine;
          }
        }
      }
    }
  }

  // 保存最后一个示例（如果还有未保存的）
  if (currentExampleFile) {
    examples.push({
      title: currentExampleTitle,
      description: currentExampleDesc,
      file: currentExampleFile
    });
  }

  return { description: description.trim(), examples };
}

// =========================================================
// 整合示例文件到 markdown
// =========================================================
function buildExamplesMarkdown(
  componentName: string,
  examples: Array<{ title: string; description: string; file: string }>
): string {
  const componentDocDir = join(DOCS_DIR_ZH, componentName);
  const lines: string[] = [];

  for (const example of examples) {
    if (!example.title || !example.file) continue;

    // 添加示例标题
    lines.push(`### ${example.title}`);
    lines.push('');

    // 添加示例描述（如果有）
    if (example.description) {
      lines.push(example.description);
      lines.push('');
    }

    // 读取示例文件
    const exampleFilePath = join(componentDocDir, `${example.file}.vue`);
    if (fs.existsSync(exampleFilePath)) {
      const exampleContent = fs.readFileSync(exampleFilePath, 'utf-8');
      lines.push('```vue');
      lines.push(exampleContent);
      lines.push('```');
      lines.push('');
    } else {
      console.warn(`⚠️ 示例文件不存在: ${exampleFilePath}`);
    }
  }

  return lines.join('\n');
}

// =========================================================
// 将 kebab-case 转换为 PascalCase（如 text-tooltip -> TextTooltip）
// =========================================================
function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// =========================================================
// 将 PascalCase 转换为 kebab-case（如 YTextTooltip -> y-text-tooltip）
// =========================================================
function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

// =========================================================
// 将组件名转换为 y- 前缀格式
// =========================================================
function toComponentTagName(componentName: string): string {
  // 如果已经是 y- 开头，直接返回
  if (componentName.startsWith('y-')) {
    return componentName;
  }
  // 如果是 Y 开头的大驼峰，转换为 y- 前缀
  if (componentName.startsWith('Y')) {
    return pascalToKebab(componentName);
  }
  // 其他情况，添加 y- 前缀
  return `y-${componentName.toLowerCase()}`;
}

// =========================================================
// 主流程
// =========================================================
function generate() {
  console.warn('📚 Loading web-types...');
  const webTypes = loadWebTypes();

  console.warn('📦 Reading component dirs...');
  const COMPONENTS_DIR = COMPONENTS_SRC;
  const componentNames = fs
    .readdirSync(COMPONENTS_DIR)
    .filter(name => {
      const fullPath = join(COMPONENTS_DIR, name);
      const stat = fs.statSync(fullPath);
      return stat.isDirectory() && name !== 'utils' && name !== 'hooks' && name !== 'locale';
    });

  const components: Record<string, ComponentModel> = {};

  for (const comp of componentNames) {
    const compDir = join(COMPONENTS_DIR, comp);
    const tsPath = join(compDir, 'src', `${comp}.ts`);

    // 查找 web-types entry（支持 YComponentName 格式）
    // 目录名是 kebab-case（如 text-tooltip），需要转换为 YTextTooltip 格式匹配
    const expectedComponentName = `Y${kebabToPascal(comp)}`;
    const wtEntry = webTypes?.contributions?.html?.['vue-components']?.find(
      (el: any) => el.name === expectedComponentName
    );

    if (!wtEntry) {
      console.warn(`⚠️ 未找到组件 ${comp} 在 web-types.json 中`);
      continue;
    }

    // 组件标签名：y-component-name
    const componentName = toComponentTagName(wtEntry.name);

    // 读取组件的 index.md 文档
    const md = readComponentDoc(comp);
    const mdParsed = parseMarkdown(md);

    // 从 web-types.json 提取 API 信息
    const props: ComponentProp[] = (wtEntry.props || []).map((wp: any) => ({
      name: wp.name,
      description: wp.description || '',
      type: { raw: Array.isArray(wp.type) ? wp.type.join(' | ') : (wp.type || 'any') },
      required: wp.required ?? false,
      default: wp.default
    }));

    const events: ComponentEvent[] = (wtEntry.js?.events || []).map((we: any) => ({
      name: we.name,
      description: we.description || '',
      parameters: we.type
        ? [{ raw: Array.isArray(we.type) ? we.type.join(' | ') : we.type }]
        : []
    }));

    const slots: ComponentSlot[] = (wtEntry.slots || []).map((ws: any) => ({
      name: ws.name,
      description: ws.description || ''
    }));

    const methods: ComponentMethod[] = (wtEntry.exposes || []).map((ex: any) => ({
      name: ex.name,
      description: ex.description || '',
      parameters: ex.type
        ? [{ raw: Array.isArray(ex.type) ? ex.type.join(' | ') : ex.type }]
        : []
    }));

    // Doc URL
    const docUrl = wtEntry['doc-url'] || `https://your-project-docs.com/component/${comp}`;

    // 保存示例 markdown 和 TS 文件到输出目录
    fs.mkdirSync(DOCS_OUTPUT_DIR, { recursive: true });

    // 只有当有示例时才输出 markdown 文件
    if (mdParsed.examples.length > 0) {
      const examplesMd = buildExamplesMarkdown(comp, mdParsed.examples);
      const docFileName = `${componentName}.md`;
      const docFilePath = join(DOCS_OUTPUT_DIR, docFileName);
      fs.writeFileSync(docFilePath, examplesMd, 'utf-8');
    }

    // 保存 TS 文件为 .ts.txt 格式，避免被 TypeScript 编译器处理
    const tsFileName = `${componentName}.ts.txt`;
    const tsOutputPath = join(DOCS_OUTPUT_DIR, tsFileName);
    if (fs.existsSync(tsPath)) {
      // 读取源文件内容并添加注释说明
      let tsContent = fs.readFileSync(tsPath, 'utf-8');
      // 在文件开头添加注释，说明这些导入仅用于类型定义，不会被实际解析
      if (!tsContent.includes('// NOTE: 此文件仅作为文本内容使用')) {
        tsContent = `// NOTE: 此文件仅作为文本内容使用，不会被 TypeScript 编译或导入
// 文件中的导入路径可能不正确，但不影响使用，因为此文件仅作为字符串内容返回
${tsContent}`;
      }
      fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
    }

    // 构建 ComponentModel
    // description: 保留 web-types.json 中的简短描述
    // detailedDescription: 使用 markdown 中的 "## 说明" 部分作为详细说明
    components[componentName] = {
      tagName: componentName,
      description: wtEntry.description || '',
      detailedDescription: mdParsed.description || undefined,
      docUrl,
      props,
      events,
      slots,
      methods
    };
  }

  fs.mkdirSync(dirname(OUTPUT), { recursive: true });

  // 输出为 ES 模块
  const jsContent = `// Auto-generated by extract-docs.ts
// Do not edit this file manually

export default ${JSON.stringify(components, null, 2)};
`;

  fs.writeFileSync(OUTPUT, jsContent, 'utf-8');

  console.warn('🎉 Done! Output generated:', OUTPUT);
}

generate();
