/**
 * 构建脚本 - 生成Vetur配置文件
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')
const componentsDir = path.resolve(packagesDir, 'components/src/components')
const distDir = path.resolve(rootDir, 'dist')
const veturDir = path.resolve(distDir, 'vetur')

// 确保vetur目录存在
if (!fs.existsSync(veturDir)) {
  fs.mkdirSync(veturDir, { recursive: true })
}

/**
 * 获取组件列表
 */
function getComponents () {
  const components = []
  const dirs = fs.readdirSync(componentsDir)

  dirs.forEach(dir => {
    // 仅处理 k- 开头的目录
    if (dir.startsWith('k-')) {
      const indexPath = path.join(componentsDir, dir, 'index.ts')
      if (fs.existsSync(indexPath)) {
        components.push({
          name: dir,
          pascalName: toPascalCase(dir),
          kebabName: dir // 已经是 kebab-case
        })
      }
    }
  })

  return components
}

/**
 * 转换为 PascalCase
 */
function toPascalCase (str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * 生成 Vetur 标签配置
 */
function generateTags (components) {
  const tags = {}

  components.forEach(component => {
    tags[component.kebabName] = {
      attributes: [], // 这里可以从组件props中提取
      description: `${component.pascalName} 组件`
    }
  })

  return tags
}

/**
 * 生成 Vetur 属性配置
 */
function generateAttributes (components) {
  const attributes = {}

  // 简化版本，实际应该从组件props中提取
  components.forEach(component => {
    attributes[`${component.kebabName}/type`] = {
      type: 'string',
      description: '按钮类型'
    }
    attributes[`${component.kebabName}/size`] = {
      type: 'string',
      options: ['large', 'default', 'small'],
      description: '按钮尺寸'
    }
  })

  return attributes
}

// 获取组件列表
const components = getComponents()
console.log(`找到 ${components.length} 个组件`)

// 生成tags.json
const tags = generateTags(components)
fs.writeFileSync(
  path.join(veturDir, 'tags.json'),
  JSON.stringify(tags, null, 2)
)
console.log('已生成 Vetur tags.json')

// 生成attributes.json
const attributes = generateAttributes(components)
fs.writeFileSync(
  path.join(veturDir, 'attributes.json'),
  JSON.stringify(attributes, null, 2)
)
console.log('已生成 Vetur attributes.json')

console.log('Vetur 配置生成完成！')
