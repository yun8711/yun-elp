#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import componentObject from '../src/metadata/components.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(projectRoot, '../..')

const distExamplesDir = path.join(projectRoot, 'dist', 'examples')

console.log('📁 Generating examples...')

fs.rmSync(distExamplesDir, { recursive: true, force: true })
fs.mkdirSync(distExamplesDir, { recursive: true })

let generatedCount = 0

for (const component of Object.values(componentObject)) {
  const examples = component.examples || []
  if (examples.length === 0) {
    continue
  }

  const componentExamplesDir = path.join(distExamplesDir, component.tagName)
  fs.mkdirSync(componentExamplesDir, { recursive: true })

  for (const example of examples) {
    const sourcePath = path.join(repoRoot, example.sourcePath)

    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️ 示例文件不存在: ${sourcePath}`)
      continue
    }

    fs.copyFileSync(sourcePath, path.join(componentExamplesDir, `${example.name}.vue`))
    generatedCount += 1
  }
}

console.log(`✅ Examples generated: ${generatedCount}`)
