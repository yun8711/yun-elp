import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueEslint from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

export default [
  // 忽略配置：只检查 packages/ 目录，排除测试文件
  {
    ignores: [
      'docs/**',
      'play/**',
      'scripts/**',
      'dist/**',
      'node_modules/**',
      '**/*.config.{js,ts}',
      '**/*.d.ts',
      '**/__tests__/**',
      '**/*.{spec,test}.{js,ts,vue}',
      'packages/**/*.test.{js,ts,vue}',
      'packages/**/__tests__/**',
      '*.config.js',
      '*.config.ts',
      'release-it.config.cjs',
      'packages/components/vitest.config.ts',
      'packages/components/vitest.setup.ts'
    ]
  },
  // ESLint 推荐规则
  js.configs.recommended,
  // Vue 3 推荐规则，但禁用 prefer-import-from-vue
  ...vueEslint.configs['flat/recommended'].map(config => ({
    ...config,
    rules: {
      ...config.rules,
      'vue/prefer-import-from-vue': 'off'
    }
  })),
  // TypeScript 推荐规则
  {
    files: ['packages/**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
          impliedStrict: true,
          globalReturn: false
        }
      },
      globals: {
        // 使用 globals 包提供的预定义全局变量
        ...globals.browser,
        ...globals.es2021,
        ...globals.vue,
        // 额外的 Web API
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
        PerformanceObserver: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier: prettier
    },
    rules: {
      // 允许单个单词的组件名
      'vue/multi-word-component-names': 'off',
      // 允许使用v-html指令
      'vue/no-v-html': 'off',
      // 限制console使用，但允许console.warn和console.error
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 禁止使用debugger
      'no-debugger': 'warn',
      // 允许使用any类型
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用的变量警告，但忽略以_开头的参数和常见的回调函数参数
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_|.*_.*',
        varsIgnorePattern: '^(props|app|ElAutocomplete)$',
        args: 'after-used'
      }],
      // 忽略未使用的变量（只对特定模式生效）
      'no-unused-vars': 'off', // 关闭基础规则，使用 TypeScript 版本
      // 关闭函数返回类型警告，因为这些是工具函数
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    }
  },
  // JavaScript文件特殊配置
  {
    files: ['packages/**/*.js'],
    rules: {
      // JS文件中关闭TS规则
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  },
  // TypeScript文件特殊配置
  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],
    rules: {
      // 禁止使用namespace
      '@typescript-eslint/no-namespace': 'error',
      // 允许从 @vue/runtime-core 导入
      // 'no-restricted-imports': 'off',
      // '@typescript-eslint/no-restricted-imports': 'off'
    }
  },
  // Vue文件特殊配置
  {
    files: ['packages/**/*.vue'],
    rules: {
      // Vue文件中的复杂度要求
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 3
          },
          multiline: {
            max: 1
          }
        }
      ],
      // 允许单文件组件有多个根元素（适用于Vue 3）
      'vue/no-multiple-template-root': 'off',
      // 允许 v-for 的 key 在子元素上
      'vue/no-v-for-template-key-on-child': 'off',
      // 允许单行 HTML 元素不换行
      'vue/singleline-html-element-content-newline': 'off',
      // 允许结束标签在同一行
      'vue/html-closing-bracket-newline': 'off',
      // 允许 Mustache 插值不强制空格
      'vue/mustache-interpolation-spacing': 'off',
      // 允许从 @vue/runtime-core 导入
      'no-restricted-imports': 'off',
      '@typescript-eslint/no-restricted-imports': 'off',
      // 在 catch 块中忽略未使用的 error 参数
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^(_|scope|value|row|prop|item|params|form|e|obj|event|el|element|error)|.*_.*',
        varsIgnorePattern: '^(props|app|ElAutocomplete|error|slots)$',
        args: 'after-used',
        ignoreRestSiblings: true
      }]
    }
  },
  // 回调函数和事件处理函数的宽松规则
  {
    files: ['packages/**/*.{ts,vue}'],
    rules: {
      // 对回调函数参数更宽松
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^(_|scope|value|row|prop|item|params|form|e|obj|event|el|element)$',
        varsIgnorePattern: '^(props|app|ElAutocomplete|slots)$',
        args: 'after-used',
        ignoreRestSiblings: true
      }]
    }
  }
];
