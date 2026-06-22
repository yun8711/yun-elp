# 介绍

YUN-ELP 是一个基于 Element Plus 的业务组件库，专为企业内部业务场景设计。它在 Element Plus 的基础上进行二次封装，提供了更符合业务需求的组件和工具函数。

## 特性

- **基于 Element Plus**：继承 Element Plus 的设计风格和使用体验
- **TypeScript 支持**：使用 TypeScript 开发，提供完整的类型定义
- **业务定制**：针对特定业务场景定制，提高开发效率
- **易于扩展**：组件设计考虑扩展性，便于根据业务需求进行二次开发

## 技术栈

- Vue 3.5+
- TypeScript
- Vite 5
- Sass
- Element Plus

## 兼容策略

YUN-ELP 基于 Element Plus 二次封装，采用单线维护策略，仅维护当前最新版本。

当前版本要求：

- Vue: ^3.5.0
- Element Plus: ^2.14.0

组件库通过 peerDependencies 声明基础库版本范围，使用方需要自行安装兼容版本的 Vue 与 Element Plus。

## 推荐 IDE 设置

我们推荐使用 [VSCode](https://code.visualstudio.com/) 作为开发 IDE，并安装以下插件：

- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)
