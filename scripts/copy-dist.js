import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

const rootDir = resolve(process.cwd())
const distDir = join(rootDir, 'dist')

// 确保目标目录存在
mkdirSync(distDir, { recursive: true })

// 拷贝 components 构建结果
const componentsDistDir = join(rootDir, 'packages/components/dist')
if (statSync(componentsDistDir).isDirectory()) {
  copyDir(componentsDistDir, join(distDir, 'components'))
}

// 拷贝 utils 构建结果
const utilsDistDir = join(rootDir, 'packages/utils/dist')
if (statSync(utilsDistDir).isDirectory()) {
  copyDir(utilsDistDir, join(distDir, 'utils'))
}

// 递归拷贝目录
function copyDir (src, dest) {
  mkdirSync(dest, { recursive: true })
  const entries = readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

console.log('Build results copied successfully!')
