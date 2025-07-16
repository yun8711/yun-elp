#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import * as paths from './paths';
import * as names from './names';
import { COMPONENT_PREFIX } from './base-config';

function createDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`创建目录: ${dir}`);
  }
}

function createFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`创建文件: ${filePath}`);
}

function appendIfNotExists(filePath: string, content: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  if (!fileContent.includes(content.trim())) {
    fs.appendFileSync(filePath, content);
    console.log(`追加内容到: ${filePath}`);
  }
}

function updateSidebarJson(componentName: string, category: string, chineseName?: string) {
  const sidebarPath = path.join(paths.docsRoot, '.vitepress', 'sidebar.json');
  const sidebar = JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'));
  const categoryObj = sidebar.find((item: any) => item.text === category);
  if (!categoryObj) {
    console.error(`未找到分类: ${category}`);
    return;
  }

  // 构建显示文本：如果有中文名称则使用 "英文名 中文名" 格式，否则只使用英文名
  const displayText = chineseName ? `${componentName} ${chineseName}` : componentName;

  if (!categoryObj.items.some((item: any) => item.text === displayText)) {
    categoryObj.items.push({
      text: displayText,
      link: `/components/${componentName}/`,
      activeMatch: `/components/${componentName}/`
    });
    fs.writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2));
    console.log('已更新 sidebar.json');
  }
}

function genVueFile(name: string, pascalName: string) {
  return `<template>\n  <div class="${COMPONENT_PREFIX}-${name}">\n    <slot></slot>\n  </div>\n</template>\n\n<script setup lang="ts">\ndefineOptions({\n  name: '${pascalName}',\n  inheritAttrs: true\n});\n</script>\n`;
}

function genIndexTs(name: string, pascalName: string) {
  const rawPascal = names.getCamelCaseName(name, false);
  return `import ${rawPascal} from './src/${name}.vue';
import { withInstall } from '../../utils/install';
import type { SFCWithInstall } from 'element-plus/es/utils';

export const ${pascalName}: SFCWithInstall<typeof ${rawPascal}> = withInstall(${rawPascal});
export default ${pascalName};

export * from './src/${name}';
`;
}

// name：app-wrap
function genTypeFile(name: string) {
  const pascalName = names.getCamelCaseName(name, false);
  // 首字母小写
  const pascalNameFirstLower = pascalName.charAt(0).toLowerCase() + pascalName.slice(1);

  return `import type { ExtractPublicPropTypes, PropType } from '@vue/runtime-core';

export interface ${pascalName}Props {\n  // TODO: 定义属性\n};

export const ${pascalNameFirstLower}Props = {} as const;

export type ${pascalNameFirstLower}Instance = ExtractPublicPropTypes<typeof ${pascalNameFirstLower}Props>;
`;
}

function genTestFile(name: string, pascalName: string) {
  return `import { describe, it, expect } from 'vitest';\nimport { mount } from '@vue/test-utils';\nimport ${pascalName} from '../src/${name}.vue';\n\ndescribe('${pascalName}', () => {\n  it('渲染正常', () => {\n    const wrapper = mount(${pascalName});\n    expect(wrapper.exists()).toBe(true);\n  });\n});\n`;
}

function genScssFile(name: string) {
  return `.${COMPONENT_PREFIX}-${name} {\n  // 组件样式\n}\n`;
}

function genDocFile(compDirName: string, rawPascal: string, chineseName?: string) {
  const title = chineseName ? `${chineseName} 组件` : `${compDirName} 组件`;
  return `---
title: ${rawPascal} ${chineseName}
description: ${rawPascal} ${chineseName}
---

# ${rawPascal} ${chineseName}

## 基础用法

:::demo

${compDirName}/test

:::

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| - | - | - | - |

### Slots

| 名称 | 说明 | 类型 |
|--------|------|------------|
| - | - | - |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|----------|
| - | - | - |

### Exposes

| 名称 | 说明 | 类型 |
|--------|------|------------|
| - | - | - |

### CSS Variables

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| - | - | - |
`;
}

function genDocTestFile(compDirName: string) {
  return `<template>
    <${COMPONENT_PREFIX}-${compDirName} />
</template>

<script setup lang="ts">

</script>`;
}

function getCategories(): string[] {
  const sidebarPath = path.join(paths.docsRoot, '.vitepress', 'sidebar.json');
  const sidebar = JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'));
  return sidebar.map((item: any) => item.text);
}

function insertComponentToComponentsTs(pascalName: string, compDirName: string) {
  const compTsPath = path.join(paths.compRoot, 'components.ts');
  const importLine = `import { ${pascalName} } from './src/${compDirName}';`;
  let content = fs.readFileSync(compTsPath, 'utf-8');
  let lines = content.split('\n');

  // 1. 插入import语句（在最后一个import后）
  const lastImportIdx = lines
    .map(l => l.trim())
    .reduce((lastIdx, line, idx) => (line.startsWith('import') ? idx : lastIdx), -1);
  if (!lines.some(line => line.trim() === importLine)) {
    lines.splice(lastImportIdx + 1, 0, importLine);
  }

  // 2. 处理export default数组
  let exportIdx = lines.findIndex(line => line.includes('export default ['));
  if (exportIdx !== -1) {
    // 检查是否为单行数组
    const singleLineArr =
      lines[exportIdx].includes('[') &&
      lines[exportIdx].includes(']') &&
      lines[exportIdx].includes('export default [');
    let members: string[] = [];
    let arrEndIdx = exportIdx;

    if (singleLineArr) {
      // 单行数组，提取成员
      const arrStart = lines[exportIdx].indexOf('[');
      const arrEnd = lines[exportIdx].indexOf(']');
      const arrContent = lines[exportIdx].substring(arrStart + 1, arrEnd);
      members = arrContent
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      if (!members.includes(pascalName)) members.push(pascalName);
      // 替换为多行
      const arrLines = [
        lines[exportIdx].substring(0, arrStart + 1),
        ...members.map(m => `  ${m},`),
        `] as Plugin[];`
      ];
      lines.splice(exportIdx, 1, ...arrLines);
    } else {
      // 多行数组
      arrEndIdx = exportIdx + 1;
      while (arrEndIdx < lines.length && !lines[arrEndIdx].includes(']')) arrEndIdx++;
      for (let i = exportIdx + 1; i < arrEndIdx; i++) {
        const m = lines[i].replace(/,?$/, '').replace('as Plugin[', '').trim();
        if (m && m !== ']') members.push(m);
      }
      if (!members.includes(pascalName)) members.push(pascalName);
      const arrLines = members.map(m => `  ${m},`);
      lines.splice(exportIdx + 1, arrEndIdx - exportIdx - 1, ...arrLines);
    }
  }

  // 清理多余空行
  const cleaned = lines.filter((line, idx, arr) => {
    if (line.trim() === '' && (idx === 0 || arr[idx - 1].trim() === '')) return false;
    return true;
  });

  fs.writeFileSync(compTsPath, cleaned.join('\n'));
  console.log(`已插入组件到: ${compTsPath}`);
}

async function main() {
  const categories = getCategories();

  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入组件英文名（如 button）：',
      validate: (input: string) => {
        if (!input.trim()) {
          return '组件名称不能为空';
        }
        if (!/^[a-z][a-z0-9-]*$/.test(input)) {
          return '组件名称只能包含小写字母、数字和连字符，且必须以字母开头';
        }
        return true;
      }
    }
  ]);

  const { chineseName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'chineseName',
      message: '请输入组件中文名称（可选，如：按钮）：',
      default: ''
    }
  ]);

  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: '请选择组件分类：',
      choices: categories
    }
  ]);

  // 组件名称，带前缀：YAppWrap
  const pascalName = names.getCamelCaseName(name, true);
  // 组件名称，不带前缀：AppWrap
  const rawPascal = names.getCamelCaseName(name, false);
  // 组件目录名，也是组件文件名：app-wrap
  // 组件文件名：app-wrap.vue
  const compDirName = names.getComponentDirName(name);

  // 1. 组件源码目录
  const compDir = path.join(paths.compRoot, 'src', compDirName, 'src');
  createDir(compDir);

  // 2. 组件类型文件
  createFile(path.join(compDir, `${compDirName}.ts`), genTypeFile(compDirName));

  // 3. 组件源码
  createFile(path.join(compDir, `${compDirName}.vue`), genVueFile(compDirName, pascalName));

  // 4. 组件主文件
  const compIndex = path.join(paths.compRoot, 'src', compDirName, 'index.ts');
  createFile(compIndex, genIndexTs(compDirName, pascalName));

  // 5. 组件测试文件
  const testDir = path.join(paths.compRoot, 'src', compDirName, '__tests__');
  createDir(testDir);
  createFile(path.join(testDir, `${compDirName}.test.ts`), genTestFile(compDirName, pascalName));

  // 6. theme-chalk下样式文件
  createFile(path.join(paths.styleRoot, 'src', `${compDirName}.scss`), genScssFile(compDirName));

  // 7. docs/components下文档
  const docDir = path.join(paths.docsRoot, 'components', compDirName);
  createDir(docDir);
  createFile(path.join(docDir, 'index.md'), genDocFile(compDirName, rawPascal, chineseName));
  createFile(path.join(docDir, 'test.vue'), genDocTestFile(compDirName));

  // 8. 修改 packages/components/src/index.ts
  appendIfNotExists(
    path.join(paths.compRoot, 'src', 'index.ts'),
    `export * from './${compDirName}';\n`
  );

  // 9. 修改 packages/components/components.ts
  insertComponentToComponentsTs(pascalName, compDirName);

  // 10. 修改 packages/theme-chalk/src/index.scss
  appendIfNotExists(
    path.join(paths.styleRoot, 'src', 'index.scss'),
    `@use './${compDirName}.scss';\n`
  );

  // 11. 修改 docs/.vitepress/sidebar.json
  updateSidebarJson(compDirName, category, chineseName);

  const successMessage = chineseName
    ? `\n✅ 组件 ${pascalName}（${chineseName}）创建成功!`
    : `\n✅ 组件 ${pascalName} 创建成功!`;
  console.log(successMessage);
}

main();
