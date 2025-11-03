export default {
  extends: [
    // 使用标准stylelint配置
    'stylelint-config-standard',
    // SCSS标准配置
    'stylelint-config-standard-scss',
    // Vue标准配置
    'stylelint-config-standard-vue',
    // CSS属性排序配置
    'stylelint-config-recess-order'
  ],
  plugins: [
    // 添加属性排序插件
    'stylelint-order'
  ],
  rules: {
    // BEM命名规范
    // 格式: block__element--modifier
    'selector-class-pattern': [
      '^[a-z]+(?:[-]?[a-z0-9]+)*(?:__[a-z0-9]+(?:[-]?[a-z0-9]+)*)?(?:--[a-z0-9]+(?:[-]?[a-z0-9]+)*)?$',
      {
        message: '类名应该遵循 BEM 命名规范 (block__element--modifier)'
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        // 允许Vue特定的伪类
        ignorePseudoClasses: ['deep', 'global']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        // 允许Vue特定的伪元素
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
      }
    ],
    // 禁用标准at-rule-no-unknown规则，改用SCSS版本
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        // 允许Tailwind指令
        ignoreAtRules: ['tailwind', 'layer', 'apply', 'screen']
      }
    ],
    'value-keyword-case': [
      'lower',
      {
        // 允许v-bind表达式，它可能包含驼峰式命名
        ignoreFunctions: ['v-bind', 'var', 'nth-child']
      }
    ],
    // 允许空源
    'no-empty-source': null,
    // 允许未知单位，因为某些CSS变量可能使用自定义单位
    'unit-no-unknown': null,
    // 允许在calc中使用无单位的0
    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties']
      }
    ],
    // 允许sass的插值语法
    'scss/at-rule-conditional-no-parentheses': null,
    // 允许空规则
    'block-no-empty': null,
    // 允许空规则块
    'rule-empty-line-before': null,
    // 禁用有弃用警告的双斜杠注释规则
    'scss/double-slash-comment-whitespace-inside': null
  }
};
