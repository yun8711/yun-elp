import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import vueEslint from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';

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
  // Vue 3 推荐规则
  ...vueEslint.configs['flat/recommended'],
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
        // 浏览器环境全局变量
        Promise: 'readonly',
        fetch: 'readonly',
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        FormData: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Blob: 'readonly',
        // Vue 全局变量
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly'
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
      // 未使用的变量警告，但忽略以_开头的参数
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
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
      // 在TS文件中强制使用类型注解
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      // 禁止使用namespace
      '@typescript-eslint/no-namespace': 'error'
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
      // 组件名格式
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // 允许单文件组件有多个根元素（适用于Vue 3）
      'vue/no-multiple-template-root': 'off'
    }
  }
];
