import fs from 'fs';
import path from 'path';
// camelize 用于将字符串转换为驼峰命名
import { camelize } from '@vue/shared';
import glob from 'fast-glob';
import { docRoot, docsDirName, docsRoot, projRoot } from '../../../scripts/paths';
// import { REPO_BRANCH, REPO_PATH } from '@element-plus/build-constants'
// import { getLang, languages } from '../utils/lang'
// import footerLocale from '../i18n/component/footer.json'

import type { Plugin } from 'vite';

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;

let compPaths: string[];

// vite插件，用于处理 Markdown 文件，增加文档，并把它转换为vue组件
export function MarkdownTransform(): Plugin {
  return {
    name: 'yun-elp-md-transform',
    // 要求为前置处理，确保在其他插件之前运行，这样可以优先处理 Markdown 内容
    enforce: 'pre',
    // 组件路径收集：
    // 1、在构建开始时收集所有组件文档的路径
    // 2、支持多语言，如 en-US、zh-CN
    // 3、使用 fast-glob 库进行路径匹配
    // 4、将结果存储在 compPaths 数组中，供后续使用
    async buildStart() {
      // console.log('langs', languages);
      const pattern = `/component`;

      compPaths = await glob(pattern, {
        cwd: docsRoot,
        absolute: true,
        onlyDirectories: true
      });
      console.log('compPaths', compPaths);
    },
    // Markdown 转换：
    // 1、只处理 .md 文件
    // 2、为每个组件文档添加：示例代码、文档头部内容、文档底部内容（源码链接、贡献者信息等）
    // code: 文档内容, id: 文档路径
    async transform(code, id) {
      // 只处理 .md 文件
      if (!id.endsWith('.md')) return;
      // 获取路径中的最后一级文件名部分，去除后缀，作为组件ID
      const componentId = path.basename(id, '.md');
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId)
      };

      code = transformVpScriptSetup(code, append);

      if (compPaths.some(compPath => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append);
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      );
    }
  };
}

const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`;

const combineMarkdown = (code: string, headers: string[], footers: string[]) => {
  const frontmatterEnds = code.indexOf('---\n\n');
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  const sliceIndex =
    firstHeader < 0 ? (frontmatterEnds < 0 ? 0 : frontmatterEnds + 4) : firstHeader;

  if (headers.length > 0)
    code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  code += footers.join('\n');

  return `${code}\n`;
};

// 特殊标签处理
// 1、<vp-script setup> 标签处理：将标签内容提取并添加到 scriptSetups 中
const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/;

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE);
  if (matches) code = code.replace(matches[0], '');
  const scriptSetup = matches?.[3] ?? '';
  if (scriptSetup) append.scriptSetups.push(scriptSetup);
  return code;
};

// 组件文档增强

const GITHUB_BLOB_URL = `https://github.com/${REPO_PATH}/blob/${REPO_BRANCH}`;
const GITHUB_TREE_URL = `https://github.com/${REPO_PATH}/tree/${REPO_BRANCH}`;
const transformComponentMarkdown = (
  id: string,
  componentId: string,
  code: string,
  append: Append
) => {
  // 支持多语言
  const lang = getLang(id);
  // 文档源码链接
  const docUrl = `${GITHUB_BLOB_URL}/${docsDirName}/en-US/component/${componentId}.md`;
  // 组件源码链接
  const componentUrl = `${GITHUB_TREE_URL}/packages/components/${componentId}`;
  // 样式源码链接
  const styleUrl = `${GITHUB_TREE_URL}/packages/theme-chalk/src/${componentId}.scss`;

  const componentPath = path.resolve(projRoot, `packages/components/${componentId}`);
  const stylePath = path.resolve(projRoot, `packages/theme-chalk/src/${componentId}.scss`);

  const isComponent = fs.existsSync(componentPath);
  const isHaveComponentStyle = fs.existsSync(stylePath);

  // 添加贡献者信息
  const links = [[footerLocale[lang].docs, docUrl]];

  if (isComponent && isHaveComponentStyle) links.unshift([footerLocale[lang].style, styleUrl]);

  if (isComponent) links.unshift([footerLocale[lang].component, componentUrl]);

  const linksText = links
    .filter(i => i)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ');

  const sourceSection = `
## ${footerLocale[lang].source}

${linksText}`;

  const contributorsSection = `
## ${footerLocale[lang].contributors}

<Contributors id="${componentId}" />`;

  append.footers.push(sourceSection, isComponent ? contributorsSection : '');

  return code;
};

// 示例代码导入
const getExampleImports = (componentId: string) => {
  // 示例代码路径
  const examplePath = path.resolve(docsRoot, 'examples', componentId);
  if (!fs.existsSync(examplePath)) return [];
  // 读取示例代码文件
  const files = fs.readdirSync(examplePath);
  const imports: string[] = [];
  // 遍历示例代码文件，只处理 .vue 文件，并转换为EP前缀驼峰命名的组件
  for (const item of files) {
    if (!/\.vue$/.test(item)) continue;
    const file = item.replace(/\.vue$/, '');
    const name = camelize(`Ep-${componentId}-${file}`);

    imports.push(`import ${name} from '../../examples/${componentId}/${file}.vue'`);
  }

  return imports;
};
