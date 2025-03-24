#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')
const componentsDir = path.resolve(packagesDir, 'components/src/components')

// 创建命令行交互界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 将短横线命名转换为大驼峰命名
function toPascalCase (name) {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

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
  }
}

// 生成Vue组件模板
function generateVueTemplate (componentName, pascalCaseName) {
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
@use './${componentName}.scss';
</style>
`
}

// 生成JSX组件模板
function generateJsxTemplate (componentName, pascalCaseName) {
  return `import { defineComponent } from 'vue';
import './${componentName}.scss';

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
function generateStyleTemplate (componentName) {
  return `/**
 * ${componentName} 样式入口
 * 提供给使用者按需导入样式
 */

// 导入组件样式
import './${componentName}.scss';

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
function createComponent (name, type) {
  // 确保组件名称格式正确（k-开头的短横线命名）
  if (!name.startsWith('k-')) {
    name = `k-${name}`
    console.log(`组件名称已调整为: ${name}`)
  }

  const pascalCaseName = toPascalCase(name)
  const componentDir = path.join(componentsDir, name)
  const isJsx = type.toLowerCase() === 'jsx'
  const fileExtension = isJsx ? 'tsx' : 'vue'

  // 创建组件目录
  createDir(componentDir)

  // 创建组件文件
  createFile(
    path.join(componentDir, `${name}.${fileExtension}`),
    isJsx ? generateJsxTemplate(name, pascalCaseName) : generateVueTemplate(name, pascalCaseName)
  )

  // 创建样式文件
  createFile(
    path.join(componentDir, `${name}.scss`),
    generateScssTemplate(name)
  )

  // 创建样式入口文件
  createFile(
    path.join(componentDir, 'style.ts'),
    generateStyleTemplate(name)
  )

  // 创建索引文件
  createFile(
    path.join(componentDir, 'index.ts'),
    generateIndexTemplate(name, pascalCaseName, isJsx)
  )

  // 创建测试文件
  createFile(
    path.join(componentDir, `${name}.test.ts`),
    generateTestTemplate(name, pascalCaseName, isJsx)
  )

  // 更新组件索引文件
  updateComponentsIndex(name, pascalCaseName)

  console.log(`\n✅ 组件 ${pascalCaseName} 创建成功!`)
}

// 主函数
function main () {
  console.log('=== 组件生成器 ===')

  rl.question('请输入组件名称 (例如: k-button 或 button): ', (name) => {
    rl.question('请选择组件类型 (vue/jsx) [默认: vue]: ', (type) => {
      const componentType = type.trim() || 'vue'

      if (!['vue', 'jsx'].includes(componentType.toLowerCase())) {
        console.error('错误: 组件类型必须是 vue 或 jsx')
        rl.close()
        return
      }

      createComponent(name.trim(), componentType)
      rl.close()
    })
  })
}

// 执行主函数
main()