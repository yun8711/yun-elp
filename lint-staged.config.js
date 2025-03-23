export default {
  // JavaScript、TypeScript和Vue文件的处理
  // 1. 使用ESLint进行代码质量检查和自动修复
  // 2. 使用Prettier进行代码格式化
  '*.{js,jsx,ts,tsx,vue}': [
    'eslint --fix',
    'prettier --write'
  ],

  // CSS、SCSS和Vue文件的样式处理
  // 1. 使用StyleLint进行样式规范检查和自动修复
  // 2. 使用Prettier进行代码格式化
  // 注意：Vue文件同时需要ESLint和StyleLint的处理
  '*.{css,scss,vue}': [
    'stylelint --fix',
    'prettier --write'
  ],

  // JSON和Markdown文件的格式化
  // 只需要使用Prettier进行格式化，不需要Lint检查
  '*.{json,md}': [
    'prettier --write'
  ],

  // 图片文件的处理
  // 使用git add重新添加图片，确保图片的Git属性正确
  '*.{png,jpg,jpeg,gif,svg}': [
    'git add'
  ],

  // 忽略特定文件
  // 使用!符号来排除不需要处理的文件
  '!(*{test,spec}.{js,ts})': [
    'eslint --fix',
    'prettier --write'
  ],

  // 为不同目录设置不同的处理规则
  'packages/**/*.{js,ts}': [
    'eslint --fix',
    'prettier --write'
  ],

  // 可以添加自定义的处理脚本
  // 例如：对于特定文件运行特定的脚本
  // 'scripts/**/*.{js,ts}': ['node ./scripts/custom-lint.js']
}
