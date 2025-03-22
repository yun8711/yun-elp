import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, '../src/components')
const outputPath = path.resolve(__dirname, '../dist/web-types.json')

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
          name: toPascalCase(dir),
          path: dir
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
 * 生成 web-types.json 内容
 */
function generateWebTypes (components) {
  const webTypes = {
    $schema: 'https://json.schemastore.org/web-types',
    framework: 'vue',
    name: '@kd-elp/components',
    version: '1.0.0',
    contributions: {
      html: {
        'vue-components': components.map(comp => ({
          name: comp.name,
          'doc-url': '', // 可以链接到在线文档
          description: `${comp.name} 组件`,
          'vue-properties': [],
          attributes: []
        }))
      }
    }
  }

  return JSON.stringify(webTypes, null, 2)
}

/**
 * 保存文件
 */
function saveWebTypes (content) {
  // 确保目录存在
  const dir = path.dirname(outputPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  fs.writeFileSync(outputPath, content)
  console.log('web-types.json 生成成功！')
}

// 执行生成过程
const components = getComponents()
const webTypesContent = generateWebTypes(components)
saveWebTypes(webTypesContent) 