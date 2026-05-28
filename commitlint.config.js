const COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert'
];

const SCOPES = [
  'components',
  'docs',
  'locale',
  'utils',
  'theme',
  'resolver',
  'play',
  'scripts',
  'build',
  'mcp',
  'release',
  'other'
];

const SCOPE_LABELS = {
  components: 'components: 组件相关（源码、测试、类型等）',
  docs: 'docs:       文档相关（VitePress、示例等）',
  locale: 'locale:     国际化翻译（components/locale）',
  utils: 'utils:      工具函数和公共方法（components/utils）',
  theme: 'theme:      样式和主题（theme-chalk）',
  resolver: 'resolver:   按需导入解析器（packages/resolver）',
  play: 'play:       开发演示子项目',
  scripts: 'scripts:   项目脚本（构建、模板等）',
  build: 'build:     构建工具和依赖（pnpm、vite 等）',
  mcp: 'mcp:        MCP server',
  release: 'release:    版本发布与 changelog',
  other: 'other:      其他杂项'
};

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 允许的提交类型，与 prompt.types 保持一致
    'type-enum': [2, 'always', COMMIT_TYPES],
    // 允许的 scope 白名单，与 SCOPES 保持一致
    'scope-enum': [2, 'always', SCOPES],
    // scope 不可为空
    'scope-empty': [2, 'never'],
    // 关闭 subject 大小写限制，便于中文描述
    'subject-case': [0],
    // commit header 最大长度（含 type、scope、subject、emoji）
    'header-max-length': [2, 'always', 100]
  },
  prompt: {
    messages: {
      type: '选择提交类型:',
      scope: '选择影响范围:',
      subject: '填写简短的变更描述:',
      breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      confirmCommit: '是否提交或修改commit ?'
    },
    // 自定义选择类型提示
    types: [
      { value: 'feat', name: 'feat:     新功能 | A new feature', emoji: ':sparkles:' },
      { value: 'fix', name: 'fix:      问题修复 | A bug fix', emoji: ':bug:' },
      { value: 'docs', name: 'docs:     文档更新 | Documentation only changes', emoji: ':memo:' },
      {
        value: 'style',
        name: 'style:    代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:'
      },
      {
        value: 'refactor',
        name: 'refactor: 代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:'
      },
      {
        value: 'perf',
        name: 'perf:     性能优化 | A code change that improves performance',
        emoji: ':zap:'
      },
      {
        value: 'test',
        name: 'test:     测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:'
      },
      {
        value: 'build',
        name: 'build:    构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:'
      },
      {
        value: 'ci',
        name: 'ci:       CI 配置 | Changes to CI configuration files and scripts',
        emoji: ':construction_worker:'
      },
      { value: 'revert', name: 'revert:   回退代码 | Revert to a commit', emoji: ':rewind:' },
      {
        value: 'chore',
        name: 'chore:    其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:'
      }
    ],
    // 自定义选择 scope 提示，与 SCOPES 保持一致
    scopes: SCOPES.map(value => ({ value, name: SCOPE_LABELS[value] })),
    // 是否开启 commit message 带有 Emoji 字符
    useEmoji: true,
    // 设置 Emoji 字符的位于头部位置 "left" | "center" | "right"
    emojiAlign: 'center',
    // 是否在选择模块范围时允许自定义
    allowCustomScopes: false,
    // 是否允许模块范围为空
    allowEmptyScopes: false,
    // 设置模块范围的位于底部位置 "top" | "bottom"
    customScopesAlign: 'bottom',
    // 自定义模块范围的别名
    customScopesAlias: 'custom',
    // 空模块范围的别名
    emptyScopesAlias: 'empty',
    // 是否自动将简短描述(subject)第一个字符进行大写处理
    upperCaseSubject: false,
    // 允许出现重大变更的特定 type
    allowBreakingChanges: ['feat', 'fix', 'refactor'],
    // 详细描述(body)和重大变更(BREAKING CHANGES)中根据字符超过该数值自动换行
    breaklineNumber: 100,
    // 详细描述(body)和重大变更(BREAKING CHANGES)中换行字符
    breaklineChar: '|',
    // 指定跳过哪些问题:'scope' | 'body' | 'breaking' | 'footerPrefix' | 'footer' | 'confirmCommit'
    skipQuestions: ['body', 'footerPrefix', 'footer', 'confirmCommit'],
    // 自定义选择 issue 前缀
    issuePrefixs: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    // 设置自定义选择 issue 前缀的位于头部位置 "top" | "bottom"
    customIssuePrefixsAlign: 'top',
    // 空自定义选择 issue 前缀的别名
    emptyIssuePrefixsAlias: 'skip',
    // 自定义选择 issue 前缀的别名
    customIssuePrefixsAlias: 'custom',
    // 是否允许自定义选择 issue 前缀
    allowCustomIssuePrefixs: true,
    // 是否允许自定义选择 issue 前缀为空
    allowEmptyIssuePrefixs: true,
    // 是否开启确认提示颜色
    confirmColorize: true,
    // 设置 commit header 的最大长度（与 rules.header-max-length 保持一致）
    maxHeaderLength: 100,
    // 设置 subject 的最大长度
    maxSubjectLength: Infinity,
    // 设置 subject 的最小长度
    minSubjectLength: 0
  }
};
