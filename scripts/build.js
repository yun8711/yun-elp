/**
 * 构建脚本 - 将子项目的构建结果复制到根目录
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const packagesDir = path.resolve(rootDir, 'packages')
const distDir = path.resolve(rootDir, 'dist')

// 确保根目录的dist目录存在
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

// 将所有子项目的dist内容复制到根目录的dist中
const packages = ['components', 'utils'] // 需要构建的子项目

// 复制函数
function copyFiles (source, target, packageName) {
  if (!fs.existsSync(source)) {
    console.warn(`警告：子项目 ${packageName} 的构建目录不存在`)
    return
  }

  // 确保目标目录存在
  const targetDir = path.join(target, packageName)
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // 复制文件和目录
  copyRecursive(source, targetDir)
}

// 递归复制函数
function copyRecursive (source, target) {
  if (fs.statSync(source).isDirectory()) {
    // 是目录，递归复制
    const files = fs.readdirSync(source)
    for (const file of files) {
      const srcFile = path.join(source, file)
      const destFile = path.join(target, file)
      copyRecursive(srcFile, destFile)
    }
  } else {
    // 是文件，直接复制
    // 确保目标目录存在
    const targetDir = path.dirname(target)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }
    fs.copyFileSync(source, target)
  }
}

// 复制每个子项目
for (const pkg of packages) {
  const sourceDir = path.join(packagesDir, pkg, 'dist')
  copyFiles(sourceDir, distDir, pkg)
  console.log(`子项目 ${pkg} 的构建文件已复制到根目录的 dist/${pkg}`)
}

// 复制组件库构建文件
const componentsDistDir = path.join(packagesDir, 'components/dist')
const componentsTargetDir = path.join(distDir, 'components')
if (fs.existsSync(componentsDistDir)) {
  fs.cpSync(componentsDistDir, componentsTargetDir, { recursive: true })
  console.log('已复制 components 构建文件')
} else {
  console.warn('警告：components 构建文件不存在')
}

// 确保解析器文件夹存在
const resolversTargetDir = path.join(distDir, 'components/resolvers')
if (!fs.existsSync(resolversTargetDir)) {
  fs.mkdirSync(resolversTargetDir, { recursive: true })
}

// 创建入口文件
const indexFile = path.join(distDir, 'index.js')
const indexContent = `/**
 * KD-ELP 组件库入口文件
 */
export * from './components/index.js'
export * from './utils/index.js'

// 导出默认 Vue 插件
export { default } from './components/index.js'
`

fs.writeFileSync(indexFile, indexContent)
console.log('已创建根目录入口文件 dist/index.js')

// 创建ES模块入口文件
const indexMjsFile = path.join(distDir, 'index.mjs')
const indexMjsContent = `/**
 * KD-ELP 组件库入口文件 (ES模块)
 */
export * from './components/index.mjs'
export * from './utils/index.mjs'

// 导出默认 Vue 插件
export { default } from './components/index.mjs'
`

fs.writeFileSync(indexMjsFile, indexMjsContent)
console.log('已创建根目录ES模块入口文件 dist/index.mjs')

// 创建类型声明入口文件
const indexDtsFile = path.join(distDir, 'index.d.ts')
const indexDtsContent = `/**
 * KD-ELP 组件库类型声明入口文件
 */
export * from './components/index';
export * from './utils/index';

// 导出默认 Vue 插件
export { default } from './components/index';
`

fs.writeFileSync(indexDtsFile, indexDtsContent)
console.log('已创建根目录类型声明入口文件 dist/index.d.ts')

// 删除子目录中的package.json文件
const componentsPackagePath = path.join(distDir, 'components/package.json')
const utilsPackagePath = path.join(distDir, 'utils/package.json')
if (fs.existsSync(componentsPackagePath)) {
  fs.unlinkSync(componentsPackagePath)
}
if (fs.existsSync(utilsPackagePath)) {
  fs.unlinkSync(utilsPackagePath)
}
console.log('已删除子目录中的 package.json 文件')

console.log('构建完成！')
