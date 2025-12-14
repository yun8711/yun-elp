export default {
  extends: ['@commitlint/config-conventional'],
  // rules: {
  //   'type-enum': [
  //     2,
  //     'always',
  //     ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build']
  //   ],
  //   'subject-case': [0]
  // },
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
      { value: 'revert', name: 'revert:   回退代码 | Revert to a commit', emoji: ':rewind:' },
      {
        value: 'chore',
        name: 'chore:    其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:'
      }
    ],
    scopes: [
      { value: 'components', name: 'components: 组件相关（源码、测试、类型等）' },
      { value: 'docs', name: 'docs:       文档相关（VitePress、示例等）' },
      { value: 'locale', name: 'locale:     国际化翻译' },
      { value: 'utils', name: 'utils:      工具函数和公共方法' },
      { value: 'theme', name: 'theme:      样式和主题（theme-chalk）' },
      { value: 'play', name: 'play:       开发演示子项目' },
      { value: 'scripts', name: 'scripts:   项目脚本（构建、模板等）' },
      { value: 'build', name: 'build:     构建工具和依赖（pnpm、vite等）' },
      { value: 'mcp', name: 'mcp:        MCP server' },
      { value: 'other', name: 'other:      其他杂项' }
    ],
    // 是否开启 commit message 带有 Emoji 字符
    useEmoji: true,
    // 设置 Emoji 字符 的 位于头部位置 "left" | "center" | "right"
    emojiAlign: 'center',
    // 是否在选择 模块范围 时允许自定义
    allowCustomScopes: true,
    // 是否允许 模块范围 为空
    allowEmptyScopes: false,
    // 设置 模块范围 的 位于底部位置 "top" | "bottom"
    customScopesAlign: 'bottom',
    // 自定义 模块范围 的 别名
    customScopesAlias: 'custom',
    // 空 模块范围 的 别名
    emptyScopesAlias: 'empty',
    // 是否自动将简短描述(subject)第一个字符进行大写处理
    upperCaseSubject: false,
    // 允许出现 重大变更 的特定type
    allowBreakingChanges: ['feat', 'fix', 'refactor'],
    // 详细描述(body)和重大变更(BREAKING CHANGES)中根据字符超过该数值自动换行
    breaklineNumber: 100,
    // 详细描述(body)和重大变更(BREAKING CHANGES)中换行字符
    breaklineChar: '|',
    // 指定的哪些问题不显示:'scope' | 'body' | 'breaking' | 'footerPrefix' | 'footer' | 'confirmCommit'
    skipQuestions: ['body', 'footerPrefix', 'footer', 'confirmCommit'],
    // 自定义选择issue前缀
    issuePrefixs: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    // 设置 自定义选择issue前缀 的 位于头部位置 "top" | "bottom"
    customIssuePrefixsAlign: 'top',
    // 空 自定义选择issue前缀 的 别名
    emptyIssuePrefixsAlias: 'skip',
    // 自定义选择issue前缀 的 别名
    customIssuePrefixsAlias: 'custom',
    // 是否允许 自定义选择issue前缀 为空
    allowCustomIssuePrefixs: true,
    // 是否允许 自定义选择issue前缀 为空
    allowEmptyIssuePrefixs: true,
    // 是否开启 自定义选择issue前缀 颜色
    confirmColorize: true,
    // 设置 变更描述 的最大长度
    maxHeaderLength: Infinity,
    // 设置 变更描述 的最大长度
    maxSubjectLength: Infinity,
    // 设置 变更描述 的最小长度
    minSubjectLength: 0
  }
};
