import path from 'path';
import fs from 'fs';
// import { docRoot } from '@element-plus/build-utils';
import { docsRoot } from '../../../scripts/paths';
import type { MarkdownRenderer } from 'vitepress';

// const docRoot = path.resolve(__dirname, '..', '..');

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?: MarkdownRenderer['renderer']['rules']['container'];
}
function createDemoContainer(md: MarkdownRenderer): ContainerOpts {
  return {
    // 验证语法
    validate(params) {
      // 匹配 ::: demo 或 ::: demo 描述文本 这样的语法
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      // 1. 获取描述文本
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1 /* means the tag is opening */) {
        const description = m && m.length > 1 ? m[1] : '';
        // 2. 获取源码文件
        const sourceFileToken = tokens[idx + 2];
        let source = '';
        const sourceFile = sourceFileToken.children?.[0].content ?? '';
        // console.log('sourceFile', sourceFile, sourceFileToken);
        // sourceFile=label/basic
        // sourceFileToken = {
        //   type: 'inline',
        //   tag: '',
        //   attrs: null,
        //   map: [7, 8],
        //   nesting: 0,
        //   level: 2,
        //   children: [
        //     // Token 对象，同sourceFileToken
        //   ],
        //   content: 'label/basic',
        //   markup: '',
        //   info: '',
        //   meta: null,
        //   block: true,
        //   hidden: false
        // };

        // 3. 读取源码内容
        if (sourceFileToken.type === 'inline') {
          // 获取文件内容
          source = fs.readFileSync(
            path.resolve(docsRoot, 'examples', `${sourceFile}.vue`),
            'utf-8'
          );
        }
        if (!source) throw new Error(`Incorrect source file: ${sourceFile}`);

        // 4。生成组件
        return `<Demo source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``)
        )}" path="${sourceFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(md.render(description))}">
  <template #source><ep-${sourceFile.replace(/\//g, '-')}/></template>`;
      } else {
        return '</Demo>\n';
      }
    }
  };
}

export default createDemoContainer;
