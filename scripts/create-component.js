#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import {
  getComponentName,
  getComponentNameWithoutPrefix,
  getComponentDirName,
  getComponentFileName,
  toPascalCase
} from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')
const componentsDir = path.resolve(packagesDir, 'components/src/components')
const docsDir = path.resolve(rootDir, 'docs')
const sidebarPath = path.resolve(docsDir, '.vitepress/sidebar.json')

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 创建目录
function createDir (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`创建目录: ${dir}`)
  }
}

// 创建文件
function createFile (filePath, content) {
  fs.writeFileSync(filePath, content)
  console.log(`创建文件: ${filePath}`)
}

// 读取 sidebar.json
function readSidebar () {
  const content = fs.readFileSync(sidebarPath, 'utf-8')
  return JSON.parse(content)
}

// 更新 sidebar.json
function updateSidebar (componentName, componentTitle, category) {
  console.log('updateSidebar', componentName, componentTitle, category)
  const sidebar = readSidebar()
  const categoryIndex = sidebar.findIndex(item => item.text === category)

  if (categoryIndex === -1) {
    console.error(`错误: 未找到分类 "${category}"`)
    return false
  }

  const newItem = {
    text: `${componentName} ${componentTitle}`,
    link: `/components/${componentName}/`
  }

  sidebar[categoryIndex].items.push(newItem)
  fs.writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2))
  console.log(`更新文档菜单: ${sidebarPath}`)
  return true
}

// 生成组件文档模板
function generateDocTemplate (componentName, pascalCaseName, description) {
  return `---
title: ${pascalCaseName} ${componentName}
description: ${description}
---

# ${pascalCaseName} ${componentName}

${description}

## 基础用法

:::demo

\`\`\`vue
<template>
  <${componentName}>基础用法</${componentName}>
</template>
\`\`\`

:::

## API

### 属性

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
|--------|------|------|--------|--------|
| - | - | - | - | - |

### 插槽

| 插槽名 | 说明 |
|--------|------|
| default | 默认插槽 |

### 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| - | - | - |

### 暴露

| 名称 | 说明 | 类型 |
|------|------|------|
| - | - | - |
`
}

// 格式化文件
function formatFile (filePath) {
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'ignore' })
    console.log(`✅ 格式化文件: ${filePath}`)
  } catch (error) {
    console.warn(`⚠️ 格式化文件失败: ${filePath}`)
  }
}

// 更新组件索引文件
function updateComponentsIndex (componentName, pascalCaseName) {
  const indexPath = path.join(componentsDir, 'index.ts')
  let content = fs.readFileSync(indexPath, 'utf-8')

  // 检查是否已经导出了该组件
  if (!content.includes(`import ${pascalCaseName} from './${componentName}'`)) {
    // 找到最后一个导入语句
    const lastImportIndex = content.lastIndexOf('import')
    const lastImportEndIndex = content.indexOf('\n', lastImportIndex)

    // 在最后一个导入语句后添加新的导入
    const newImport = `import ${pascalCaseName} from './${componentName}'\n`
    content = content.slice(0, lastImportEndIndex + 1) + newImport + content.slice(lastImportEndIndex + 1)

    // 找到导出语句并添加新组件
    const exportIndex = content.lastIndexOf('export {')
    if (exportIndex !== -1) {
      const exportEndIndex = content.indexOf('}', exportIndex)
      // 检查导出语句是否为空
      const exportContent = content.substring(exportIndex + 8, exportEndIndex).trim()
      const newExport = exportContent ? `${exportContent}, ${pascalCaseName}` : pascalCaseName
      content = content.slice(0, exportIndex + 8) + ' ' + newExport + ' ' + content.slice(exportEndIndex)
    } else {
      // 如果没有找到导出语句，则添加一个新的
      content += `\nexport { ${pascalCaseName} }`
    }

    fs.writeFileSync(indexPath, content)
    console.log(`更新组件索引文件: ${indexPath}`)
    formatFile(indexPath)
  }
}

// 更新组件样式入口文件
function updateComponentsStyle (componentName, componentDirName) {
  const stylePath = path.join(componentsDir, 'style.ts')
  let content = fs.readFileSync(stylePath, 'utf-8')

  // 检查是否已经导入了该组件的样式
  if (!content.includes(`'${componentName}': () => importStyle('${componentDirName}')`)) {
    // 找到 styleImporters 对象的结束位置
    const styleImportersEndIndex = content.lastIndexOf('};')
    if (styleImportersEndIndex !== -1) {
      // 在最后一个属性后添加新的导入
      const newImport = `,'${componentName}': () => importStyle('${componentDirName}'),`
      content = content.slice(0, styleImportersEndIndex) + newImport + content.slice(styleImportersEndIndex)
      fs.writeFileSync(stylePath, content)
      console.log(`更新组件样式入口文件: ${stylePath}`)
      formatFile(stylePath)
    }
  }
}

// 生成Vue组件模板
function generateVueTemplate (componentName, pascalCaseName, componentDirName) {
  return `<template>
  <div class="${componentName}">
    <!-- 组件内容 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: '${pascalCaseName}',
  inheritAttrs: false
});

// 定义组件属性
defineProps<{
  // 在此处定义组件属性
}>();

// 定义组件事件
const emit = defineEmits<{
  // 在此处定义组件事件
}>();
</script>

<style lang="scss">
@use './${componentDirName}.scss';
</style>
`
}

// 生成JSX组件模板
function generateJsxTemplate (componentName, pascalCaseName, componentDirName) {
  return `import { defineComponent } from 'vue';
import './${componentDirName}.scss';

export default defineComponent({
  name: '${pascalCaseName}',
  inheritAttrs: false,
  props: {
    // 在此处定义组件属性
  },
  emits: [
    // 在此处定义组件事件
  ],
  setup(props, { slots, emit, attrs }) {
    // 组件逻辑

    return () => (
      <div class="${componentName}" {...attrs}>
        {/* 组件内容 */}
        {slots.default?.()}
      </div>
    );
  }
});
`
}

// 生成样式文件模板
function generateScssTemplate (componentName) {
  return `.${componentName} {
  // 在此处添加组件样式
}
`
}

// 生成样式入口文件模板
function generateStyleTemplate (componentName, componentDirName) {
  return `/**
 * ${componentName} 样式入口
 * 提供给使用者按需导入样式
 */

// 导入组件样式
import './${componentDirName}.scss';

// 如果组件依赖其他组件，可以在这里导入它们的样式
// 例如: import '../other-component/style';
`
}

// 生成索引文件模板
function generateIndexTemplate (componentName, pascalCaseName, isJsx) {
  const extension = isJsx ? 'tsx' : 'vue'
  return `import ${pascalCaseName} from './${componentName}.${extension}';

// 导出组件
export { ${pascalCaseName} };
export default ${pascalCaseName};

// 导出样式路径，用于按需导入
export const style = './${componentName}.scss';
`
}

// 生成测试文件模板
function generateTestTemplate (componentName, pascalCaseName, isJsx) {
  const extension = isJsx ? 'tsx' : 'vue'
  return `import { describe, it, expect, vi } from 'vitest';
import { renderComponent } from '../../test-utils';
import ${pascalCaseName} from './${componentName}.${extension}';

describe('${pascalCaseName} 组件', () => {
  // 测试渲染
  it('应该正确渲染', () => {
    const { getByText } = renderComponent(${pascalCaseName}, {
      slots: {
        default: '测试内容'
      }
    });

    expect(getByText('测试内容')).toBeTruthy();
  });

  // 添加更多测试...
});
`
}

// 创建组件
function createComponent (name, type, category, description) {
  // 获取组件名称，带前缀
  const componentName = getComponentName(name)
  // 获取组件目录名，不带前缀
  const componentDirName = getComponentDirName(name)
  // 获取组件文件名，不带前缀，如：label
  const componentFileName = getComponentFileName(name)
  // 获取组件PascalCase名称，如：KLabel
  const pascalCaseName = toPascalCase(componentName)
  // 获取组件目录，如：packages/components/src/components/label
  const componentDir = path.join(componentsDir, componentDirName)
  // 获取组件文档目录，如：docs/components/label
  const docDir = path.join(docsDir, 'components', componentDirName)
  // 获取组件是否为JSX组件
  const isJsx = type.toLowerCase() === 'jsx'
  // 获取组件文件扩展名
  const fileExtension = isJsx ? 'tsx' : 'vue'

  // 创建组件目录
  createDir(componentDir)
  createDir(docDir)

  // 创建组件文件
  const componentFilePath = path.join(componentDir, `${componentFileName}.${fileExtension}`)
  createFile(componentFilePath, isJsx ? generateJsxTemplate(componentName, pascalCaseName, componentDirName) : generateVueTemplate(componentName, pascalCaseName, componentDirName))
  formatFile(componentFilePath)

  // 创建样式文件
  const scssFilePath = path.join(componentDir, `${componentFileName}.scss`)
  createFile(scssFilePath, generateScssTemplate(componentName))
  formatFile(scssFilePath)

  // 创建样式入口文件
  const styleFilePath = path.join(componentDir, 'style.ts')
  createFile(styleFilePath, generateStyleTemplate(componentName, componentDirName))
  formatFile(styleFilePath)

  // 创建索引文件
  const indexFilePath = path.join(componentDir, 'index.ts')
  createFile(indexFilePath, generateIndexTemplate(componentFileName, pascalCaseName, isJsx))
  formatFile(indexFilePath)

  // 创建测试文件
  const testFilePath = path.join(componentDir, `${componentFileName}.test.ts`)
  createFile(testFilePath, generateTestTemplate(componentFileName, pascalCaseName, isJsx))
  formatFile(testFilePath)

  // 创建文档文件
  const docFilePath = path.join(docDir, 'index.md')
  createFile(docFilePath, generateDocTemplate(componentName, pascalCaseName, description))
  formatFile(docFilePath)

  // 更新组件索引文件
  updateComponentsIndex(componentDirName, pascalCaseName)

  // 更新组件样式入口文件
  updateComponentsStyle(componentName, componentDirName)

  // 更新文档菜单
  updateSidebar(componentDirName, description, category)

  console.log(`\n✅ 组件 ${pascalCaseName} 创建成功!`)
}

// 主函数
function main () {
  console.log('=== 组件生成器 ===')

  // 读取组件分类
  const sidebar = readSidebar()
  const categories = sidebar.map(item => item.text)

  console.log('\n可用的组件分类:')
  categories.forEach((category, index) => {
    console.log(`${index + 1}. ${category}`)
  })

  rl.question('\n请选择组件分类 (输入序号): ', (categoryIndex) => {
    const category = categories[parseInt(categoryIndex) - 1]
    if (!category) {
      console.error('错误: 无效的分类序号')
      rl.close()
      return
    }

    rl.question(`请输入组件英文名称 (例如: button): `, (name) => {
      rl.question('请输入组件中文名称: ', (description) => {
        rl.question('请选择组件类型 (vue/jsx) [默认: vue]: ', (type) => {
          const componentType = type.trim() || 'vue'

          if (!['vue', 'jsx'].includes(componentType.toLowerCase())) {
            console.error('错误: 组件类型必须是 vue 或 jsx')
            rl.close()
            return
          }

          createComponent(name.trim(), componentType, category, description.trim())
          rl.close()
        })
      })
    })
  })
}

// 执行主函数
main()
