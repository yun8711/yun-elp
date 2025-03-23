export default {
  root: true,
  env: {
    // 浏览器环境
    browser: true,
    // ES2021特性支持
    es2021: true,
    // Node环境
    node: true
  },
  extends: [
    // ESLint推荐规则
    "eslint:recommended",
    // Vue3推荐规则
    "plugin:vue/vue3-recommended",
    // TypeScript推荐规则
    "plugin:@typescript-eslint/recommended",
    // Prettier兼容规则
    "plugin:prettier/recommended"
  ],
  // 使用Vue ESLint解析器
  parser: "vue-eslint-parser",
  parserOptions: {
    // 使用最新的ECMAScript版本
    ecmaVersion: "latest",
    // 使用TypeScript解析器解析脚本
    parser: "@typescript-eslint/parser",
    // 使用ESM模块系统
    sourceType: "module",
    // 使用ESM模块系统
    ecmaFeatures: {
      jsx: true,
      // 开始全局严格模式
      impliedStrict: true,
      // 是否允许全局环境中使用return
      globalReturn: false
    }
  },
  globals: {
    // 允许使用Promise
    Promise: true,
    // 允许使用fetch
    fetch: true,
    // window对象
    window: true,
    // document对象
    document: true,
    // localStorage和sessionStorage
    localStorage: true,
    sessionStorage: true,
    // 定时器函数
    setTimeout: true,
    setInterval: true,
    clearTimeout: true,
    clearInterval: true,
    // 请求相关
    FormData: true,
    File: true,
    FileReader: true,
    Blob: true,
    // Vue相关全局变量
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  },
  // 使用的插件
  plugins: ["vue", "@typescript-eslint", "prettier"],
  // 针对不同文件类型的特定配置
  overrides: [
    // 纯JavaScript文件配置
    {
      files: ["*.js"],
      rules: {
        // JS文件中关闭TS规则
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off"
      }
    },
    // TypeScript文件配置
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // 在TS文件中强制使用类型注解
        "@typescript-eslint/explicit-module-boundary-types": "warn",
        // 禁止使用namespace
        "@typescript-eslint/no-namespace": "error"
      }
    },
    // Vue文件配置
    {
      files: ["*.vue"],
      rules: {
        // Vue文件中的复杂度要求
        "vue/max-attributes-per-line": ["error", {
          "singleline": {
            "max": 3
          },
          "multiline": {
            "max": 1
          }
        }],
        // 组件名格式
        "vue/component-name-in-template-casing": ["error", "PascalCase"],
        // 允许单文件组件有多个根元素（适用于Vue 3）
        "vue/no-multiple-template-root": "off"
      }
    },
    // 测试文件配置
    {
      files: ["**/__tests__/**/*.{js,ts}", "**/*.{spec,test}.{js,ts}"],
      env: {
        jest: true
      },
      rules: {
        // 测试文件中允许使用any
        "@typescript-eslint/no-explicit-any": "off",
        // 测试文件中允许使用console
        "no-console": "off",
        // 测试文件可以有较长的行
        "max-len": "off"
      }
    },
    // 配置文件配置
    {
      files: ["**/vite.config.js", "**/vite.config.ts", "**/webpack.config.js", "**/*.config.js"],
      rules: {
        // 配置文件中允许使用require
        "@typescript-eslint/no-var-requires": "off",
        // 配置文件中允许使用Node API
        "no-process-env": "off"
      }
    },
    // 演示项目特殊配置（针对play目录）
    {
      files: ["play/**/*.{js,vue}"],
      rules: {
        // play目录下对JS文件和Vue文件放宽要求
        "no-console": "off",
        "vue/require-default-prop": "off"
      }
    }
  ],
  rules: {
    // 允许单个单词的组件名
    "vue/multi-word-component-names": "off",
    // 允许使用v-html指令
    "vue/no-v-html": "off",
    // 限制console使用，但允许console.warn和console.error
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    // 禁止使用debugger
    "no-debugger": "warn",
    // 允许使用any类型
    "@typescript-eslint/no-explicit-any": "off",
    // 未使用的变量警告，但忽略以_开头的参数
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  },
}