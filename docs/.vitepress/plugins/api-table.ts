/**
 * 这是一个用于处理 API 文档表格的 markdown-it 插件
 * 通过识别 ```api 代码块来渲染 API 表格
 */
import type { MarkdownRenderer } from 'vitepress';
const ApiTableContainer = (md: MarkdownRenderer) => {
  // 1. 保存原始的 fence 渲染器
  const fence = md.renderer.rules.fence!;

  // 2. 重写 fence 渲染器
  md.renderer.rules.fence = (...args) => {
    // 获取参数
    // 1、tokens 数组，包含所有 token
    // 2、idx 索引，表示当前 token 的索引
    // 3、options 对象，包含代码块的选项
    // 4、env 对象，包含环境变量
    const [tokens, idx, ...rest] = args;
    const [options, env] = rest;
    // 获取当前 token
    const token = tokens[idx];
    // token = {
    //   type: 'fence',
    //   tag: 'code',
    //   attrs: null,
    //   map: [0, 7],
    //   nesting: 0,
    //   level: 0,
    //   children: null,
    //   content:
    //     '<template>\n' +
    //     '  <div class="mb-4">\n' +
    //     '    <el-button>Default</el-button>\n' +
    //     '  </div>\n' +
    //     '</template>\n',
    //   markup: '```',
    //   info: ' vue',
    //   meta: null,
    //   block: true,
    //   hidden: false
    // };
    // 3. 检查是否是 api 代码块
    if (token.info === 'api') {
      console.log('token', token);
      // 4. 解析 api 内容
      const newTokens = md.parse(token.content, env);

      // 5. 渲染处理
      let result = '';
      const { rules } = md.renderer;
      newTokens.forEach((newToken, idx) => {
        const { type } = newToken;
        // 处理不同类型的 token
        if (type === 'inline') {
          result += md.renderer.renderInline(newToken.children!, options, env);
        } else if (typeof rules[type] !== 'undefined') {
          result += rules[newToken.type]!(newTokens, idx, options, env, md.renderer);
        } else {
          result += md.renderer.renderToken(newTokens, idx, options);
        }
      });
      return result;
    }
    // 6. 如果不是 api 代码块，使用原始渲染器
    return fence.call(md, ...args);
  };
};

export default ApiTableContainer;
