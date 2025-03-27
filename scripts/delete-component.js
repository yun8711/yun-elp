#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import {
  getComponentName,
  getComponentDirName,
  toPascalCase,
  COMPONENT_PREFIX
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

// 读取 sidebar.json
function readSidebar () {
  const content = fs.readFileSync(sidebarPath, 'utf-8')
  return JSON.parse(content)
}

// 更新 sidebar.json
function updateSidebar (componentName, componentDirName, isDirDeleted) {
  const sidebar = readSidebar()
  let updated = false

  // 遍历所有分类
  sidebar.forEach(category => {
    if (category.items) {
      // 找到并删除组件
      const index = category.items.findIndex(item =>
        item.link === `/components/${componentDirName}/`
      )
      if (index !== -1) {
        category.items.splice(index, 1)
        updated = true
      }
    }
  })

  if (updated) {
    fs.writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2))
    console.log(`更新文档菜单: ${sidebarPath}`)
  }

  if (isDirDeleted) {
    console.log(`✅ 删除组件目录: ${componentName}`)
    console.log(`✅ 删除文档目录: ${componentName}`)
  }
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
function updateComponentsIndex (componentDirName, pascalCaseName, isDirDeleted) {
  const indexPath = path.join(componentsDir, 'index.ts')
  let content = fs.readFileSync(indexPath, 'utf-8')

  // 删除导入语句
  content = content.replace(`import ${pascalCaseName} from './${componentDirName}';`, '')

  // 从导出语句中删除组件
  const exportRegex = new RegExp(`export\\s*{\\s*([^}]*?)\\s*${pascalCaseName}\\s*([^}]*?)\\s*}`, 'g')
  content = content.replace(exportRegex, (match, before, after) => {
    const parts = [before, after].filter(Boolean).join(',').split(',').filter(Boolean)
    return parts.length ? `export { ${parts.join(', ')} }` : ''
  })

  fs.writeFileSync(indexPath, content)
  console.log(`更新组件索引文件: ${indexPath}`)
  formatFile(indexPath)

  if (isDirDeleted) {
    console.log(`✅ 删除组件目录: ${componentDirName}`)
    console.log(`✅ 删除文档目录: ${componentDirName}`)
  }
}

// 更新组件样式入口文件
function updateComponentsStyle (componentDirName, componentName, isDirDeleted) {
  const stylePath = path.join(componentsDir, 'style.ts')
  let content = fs.readFileSync(stylePath, 'utf-8')

  // 删除导入语句
  content = content.replace(`'${componentName}': () => importStyle('${componentDirName}')`, '').replaceAll(`,,`, ',')

  fs.writeFileSync(stylePath, content)
  console.log(`更新组件样式入口文件: ${stylePath}`)
  formatFile(stylePath)

  if (isDirDeleted) {
    console.log(`✅ 删除组件样式导入: ${componentDirName}`)
  }
}

// 删除组件
function deleteComponent (name) {
  // 获取组件名称（带前缀）和目录名（不带前缀）
  const componentName = getComponentName(name)
  const componentDirName = getComponentDirName(name)
  const pascalCaseName = toPascalCase(componentName)
  const componentDir = path.join(componentsDir, componentDirName)
  const docDir = path.join(docsDir, 'components', componentDirName)

  // 删除组件目录
  if (fs.existsSync(componentDir)) {
    fs.rmSync(componentDir, { recursive: true, force: true })
    console.log(`✅ 删除组件目录: ${componentDirName}`)
  }

  // 删除文档目录
  if (fs.existsSync(docDir)) {
    fs.rmSync(docDir, { recursive: true, force: true })
    console.log(`✅ 删除文档目录: ${componentDirName}`)
  }

  // 更新组件索引文件
  updateComponentsIndex(componentDirName, pascalCaseName, true)

  // 更新文档菜单
  updateSidebar(componentName, componentDirName, true)

  // 更新组件样式入口文件
  updateComponentsStyle(componentDirName, componentName, true)

  console.log(`\n✅ 组件 ${pascalCaseName} 删除成功!`)
}

// 主函数
function main () {
  console.log('=== 组件删除器 ===')
  console.log(`提示: 组件名称可以省略 ${COMPONENT_PREFIX}- 前缀，例如输入 "button" 会自动处理为 "${COMPONENT_PREFIX}-button"`)

  rl.question(`请输入要删除的组件名称 (例如: button): `, (name) => {
    const inputName = name.trim()
    if (!inputName) {
      console.error('错误: 组件名称不能为空')
      rl.close()
      return
    }

    // 检查组件是否存在
    const componentName = getComponentName(inputName)
    const componentDirName = getComponentDirName(inputName)
    const pascalCaseName = toPascalCase(componentName)
    const componentDir = path.join(componentsDir, componentDirName)
    const docDir = path.join(docsDir, 'components', componentDirName)

    if (!fs.existsSync(componentDir) && !fs.existsSync(docDir)) {
      console.error(`错误: 组件 ${pascalCaseName} 不存在`)
      rl.close()
      return
    }

    rl.question(`确定要删除组件 ${pascalCaseName} 吗？(y/N): `, (answer) => {
      if (answer.toLowerCase() === 'y') {
        deleteComponent(inputName)
      } else {
        console.log('操作已取消')
      }
      rl.close()
    })
  })
}

// 执行主函数
main()
