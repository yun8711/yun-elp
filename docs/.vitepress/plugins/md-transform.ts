import { docsRoot, projRoot } from '../../../scripts/paths';
import { camelize } from '@vue/shared';
import glob from 'fast-glob';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;
// 需要转换的组件路径
let compPaths: string[];

export function MdTransform(): Plugin {
  return {
    name: 'yun-elp-md-transform',
    enforce: 'pre',
    // 在构建开始时收集所有组件文档的路径，即examples目录下的所有子目录
    async buildStart() {
      // console.log('docsRoot', docsRoot);
      compPaths = await glob('examples/*/', {
        cwd: docsRoot,
        absolute: true,
        onlyDirectories: true
      });
      // console.log('compPaths', compPaths);
    },
    // 处理每一个文件
    async transform(code, id) {
      // console.log('id', id);
      // console.log('code', code);
      // 1、处理 .md 文件
      if (!id.endsWith('.md')) return;
      // 获取路径中的倒数第二级的目录名作为组件ID
      const componentId = id.split('/').slice(-2, -1)[0];
      // 声明一个 Append 对象，用于存储文档头部内容、文档底部内容（源码链接、贡献者信息等）
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: getExampleImports(componentId)
      };

      // 2、处理 <vp-script setup> 标签，将标签内容提取并添加到 scriptSetups 中
      code = transformVpScriptSetup(code, append);

      // 3、处理组件文档增强
      // if (compPaths.some(compPath => id.startsWith(compPath))) {
      //   code = transformComponentMarkdown(id, componentId, code, append);
      // }
      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers
      );
    }
  };
}

// 动态的导入示例代码组件，返回一个数组，数组中是导入示例代码组件的语句
const getExampleImports = (componentId: string) => {
  // console.log('getExampleImports-componentId', componentId);
  const examplePath = path.resolve(docsRoot, 'examples', componentId);
  // console.log('examplePath', examplePath);
  if (!fs.existsSync(examplePath)) return [];
  const files = fs.readdirSync(examplePath);
  const imports: string[] = [];

  for (const item of files) {
    if (!/\.vue$/.test(item)) continue;
    const file = item.replace(/\.vue$/, '');
    const name = camelize(`Ep-${componentId}-${file}`);

    imports.push(`import ${name} from './${file}.vue'`);
  }

  return imports;
};

// 特殊标签处理
// 1、<vp-script setup> 标签处理：将标签内容提取并添加到 scriptSetups 中
const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/vp-script>/;

const transformVpScriptSetup = (code: string, append: Append) => {
  // 1. 查找匹配的标签
  const matches = code.match(vpScriptSetupRE);
  // 2. 如果找到匹配，从原代码中移除这个标签
  if (matches) code = code.replace(matches[0], '');
  // 3. 获取标签内的内容（第三个捕获组）
  const scriptSetup = matches?.[3] ?? '';
  // 4. 如果有内容，添加到 append.scriptSetups 数组中
  if (scriptSetup) append.scriptSetups.push(scriptSetup);
  return code;
};

// 合并 Markdown 文档
const combineMarkdown = (code: string, headers: string[], footers: string[]) => {
  // 1. 获取 frontmatter 结束位置
  const frontmatterEnds = code.indexOf('---\n\n');
  // 2. 获取第一个标题的位置，如：## 标题
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  // 3. 如果第一个标题不存在，则使用 frontmatter 结束位置，否则使用第一个标题的位置
  const sliceIndex =
    firstHeader < 0 ? (frontmatterEnds < 0 ? 0 : frontmatterEnds + 4) : firstHeader;
  // 4. 如果 headers 数组有内容，则将 headers 数组的内容插入到 code 中
  if (headers.length > 0)
    code = code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  code += footers.join('\n');

  return `${code}\n`;
};

// 合并 script setup 代码
const combineScriptSetup = (codes: string[]) =>
  `\n<script setup>
${codes.join('\n')}
</script>
`;
