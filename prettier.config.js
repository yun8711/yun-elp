export default {
  // 每行代码最大长度，超过将自动换行
  printWidth: 100,
  // 缩进的空格数
  tabWidth: 2,
  // 使用空格而不是制表符(tab)
  useTabs: false,
  // 行尾分号 (true：有，false：没有)
  semi: true,
  // 使用单引号 (true：单引号，false：双引号)
  singleQuote: true,
  // 对象字面量的 key 是否用引号，可选值 "<as-needed|consistent|preserve>"
  quoteProps: 'as-needed', // 仅在需要时给对象属性添加引号
  // 在JSX中使用单引号而不是双引号 (true：单引号，false：双引号)
  jsxSingleQuote: false,
  // 多行时末尾逗号，可选值"<none|es5|all>"
  trailingComma: 'none',
  // 在对象，数组括号与文字之间加空格，(true：有，false：没有)
  bracketSpacing: true,
  // 将 > 多行元素放在最后一行的末尾，而不是单独放在下一行 (true：放末尾，false：单独一行)
  bracketSameLine: true,
  // 箭头函数参数只有一个时是否要有小括号 (avoid：省略括号，always：不省略括号)
  arrowParens: 'avoid',
  // 仅格式化在文件顶部以特殊注释标明的代码（称为编译指示）
  requirePragma: false,
  // 是否在文件顶部插入一个特殊标记，指定该文件已使用 Prettier 格式化
  insertPragma: false,
  // 控制文本是否应该被换行以及如何进行换行，preserve保持原样；always超宽自动换行；never不换行
  proseWrap: 'preserve',
  // 遵循CSS的display属性的HTML空白敏感度，
  // css-遵守CSS显示属性的默认值;strict - 空格被认为是敏感的;"ignore" - 空格被认为是不敏感的
  htmlWhitespaceSensitivity: 'css',
  // 控制在 Vue SFC中 <script> 和 <style> 标签内的代码缩进方式
  vueIndentScriptAndStyle: false,
  // 使用LF作为行尾序列
  endOfLine: 'auto',
  // [2.1+] 自动格式化嵌套的代码
  embeddedLanguageFormatting: 'off',
  // [2.6+] 在 HTML、Vue 和 JSX 中强制每行使用单一属性
  singleAttributePerLine: false,
  // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
  //  rangeStart：开始，rangeEnd：结束
  rangeStart: 0,
  rangeEnd: Infinity
};
