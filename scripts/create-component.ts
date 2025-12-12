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

function createFile(filePath: string, content: string, overwrite = false) {
  if (fs.existsSync(filePath) && !overwrite) {
    console.warn(`⚠️  文件已存在，跳过: ${filePath}`);
    return false;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ 创建文件: ${filePath}`);
  return true;
}

function appendIfNotExists(filePath: string, content: string) {
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  文件不存在: ${filePath}`);
    return false;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  if (!fileContent.includes(content.trim())) {
    fs.appendFileSync(filePath, content, 'utf-8');
    console.log(`✅ 追加内容到: ${filePath}`);
    return true;
  }
  console.log(`ℹ️  内容已存在，跳过: ${filePath}`);
  return false;
}

function updateSidebarJson(componentName: string, category: string, chineseName?: string) {
  const sidebarPath = path.join(paths.docsRoot, '.vitepress', 'sidebar.json');
  if (!fs.existsSync(sidebarPath)) {
    console.error(`❌ 文件不存在: ${sidebarPath}`);
    return false;
  }

  const sidebar = JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'));
  const categoryObj = sidebar.find((item: any) => item.text === category);
  if (!categoryObj) {
    console.error(`❌ 未找到分类: ${category}`);
    return false;
  }

  // 构建显示文本：如果有中文名称则使用 "英文名 中文名" 格式，否则只使用英文名
  const displayText = chineseName ? `${componentName} ${chineseName}` : componentName;

  if (!categoryObj.items.some((item: any) => item.text === displayText)) {
    categoryObj.items.push({
      text: displayText,
      link: `/components/${componentName}/`,
      activeMatch: `/components/${componentName}/`
    });
    // 按字母顺序排序
    categoryObj.items.sort((a: any, b: any) => {
      const textA = a.text.toLowerCase();
      const textB = b.text.toLowerCase();
      return textA.localeCompare(textB, 'zh-CN');
    });
    fs.writeFileSync(sidebarPath, JSON.stringify(sidebar, null, 2) + '\n', 'utf-8');
    console.log(`✅ 已更新 sidebar.json`);
    return true;
  }
  console.log(`ℹ️  组件已在 sidebar.json 中存在`);
  return false;
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

  return `import type { ExtractPublicPropTypes } from 'vue';

export interface ${pascalName}Props {
  // TODO: 定义属性
}

export const ${pascalNameFirstLower}Props = {} as const;

export type ${pascalNameFirstLower}Instance = ExtractPublicPropTypes<typeof ${pascalNameFirstLower}Props>;
`;
}

function genTestFile(name: string, pascalName: string) {
  return `import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ${pascalName} from '../src/${name}.vue';

describe('${pascalName}', () => {
  it('渲染正常', () => {
    const wrapper = mount(${pascalName});
    expect(wrapper.exists()).toBe(true);
  });
});
`;
}

function genScssFile(name: string) {
  return `.${COMPONENT_PREFIX}-${name} {\n  // 组件样式\n}\n`;
}

function genDocFile(compDirName: string, rawPascal: string, chineseName?: string) {
  const title = rawPascal;
  const description = chineseName ? `${chineseName}组件` : `${compDirName}组件`;
  const heading = chineseName ? `${rawPascal} ${chineseName}` : `${rawPascal}`;

  return `---
title: ${title}
description: ${description}
---

# ${heading}

## 说明

基于相关组件封装，用于${chineseName || compDirName}功能。

## 用法示例

### 基础用法

:::demo

${compDirName}/test

:::

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| — | — | — | — |

### Slots

| 名称 | 说明 | 参数 |
|--------|------|------------|
| — | — | — |

### Events

| 事件名 | 说明 | 类型 |
|--------|------|----------|
| — | — | — |

### Exposes

| 名称 | 说明 | 类型 |
|--------|------|------------|
| — | — | — |

### CSS Variables

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| — | — | — |
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
  if (!fs.existsSync(compTsPath)) {
    console.error(`❌ 文件不存在: ${compTsPath}`);
    return false;
  }

  const importLine = `import { ${pascalName} } from './src/${compDirName}';`;
  let content = fs.readFileSync(compTsPath, 'utf-8');
  let lines = content.split('\n');

  // 1. 插入import语句（在最后一个import后）
  const lastImportIdx = lines
    .map(l => l.trim())
    .reduce((lastIdx, line, idx) => (line.startsWith('import') ? idx : lastIdx), -1);

  if (lastImportIdx === -1) {
    console.error(`❌ 未找到import语句位置: ${compTsPath}`);
    return false;
  }

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
      // 替换为多行，最后一项不加逗号
      const arrLines = [
        lines[exportIdx].substring(0, arrStart + 1),
        ...members.map((m, idx) =>
          idx === members.length - 1 ? `  ${m}` : `  ${m},`
        ),
        `] as Plugin[];`
      ];
      lines.splice(exportIdx, 1, ...arrLines);
    } else {
      // 多行数组
      arrEndIdx = exportIdx + 1;
      while (arrEndIdx < lines.length && !lines[arrEndIdx].includes(']')) arrEndIdx++;
      for (let i = exportIdx + 1; i < arrEndIdx; i++) {
        // 移除所有尾随逗号、移除 'as Plugin[' 和 ']'，然后提取组件名
        const m = lines[i]
          .replace(/,+$/, '') // 移除所有尾随逗号（一个或多个）
          .replace(/as Plugin\[/, '')
          .replace(/\]/, '')
          .trim();
        if (m && m !== ']' && m !== '') members.push(m);
      }
      if (!members.includes(pascalName)) members.push(pascalName);
      // 最后一项不加逗号，其他项都加逗号
      const arrLines = members.map((m, idx) =>
        idx === members.length - 1 ? `  ${m}` : `  ${m},`
      );
      lines.splice(exportIdx + 1, arrEndIdx - exportIdx - 1, ...arrLines);
    }
  } else {
    console.warn(`⚠️  未找到 export default 数组: ${compTsPath}`);
    return false;
  }

  // 清理多余空行（保留import和export之间的一个空行）
  const cleaned: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    // 如果是空行
    if (line.trim() === '') {
      // 保留import和export之间的空行，以及数组前后的空行
      const isAfterImport = prevLine.trim().startsWith('import');
      const isBeforeExport = nextLine.trim().startsWith('export');
      const isAroundArray = prevLine.includes(']') || nextLine.includes('[');

      if (isAfterImport || isBeforeExport || isAroundArray) {
        // 检查是否已经有空行
        if (cleaned.length === 0 || cleaned[cleaned.length - 1].trim() !== '') {
          cleaned.push(line);
        }
      }
    } else {
      cleaned.push(line);
    }
  }

  fs.writeFileSync(compTsPath, cleaned.join('\n'), 'utf-8');
  console.log(`✅ 已插入组件到: ${compTsPath}`);
  return true;
}

async function main() {
  try {
    const categories = getCategories();
    if (categories.length === 0) {
      console.error('❌ 未找到任何分类，请检查 sidebar.json 文件');
      process.exit(1);
    }

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
          // 检查组件是否已存在
          const compDirName = names.getComponentDirName(input.trim());
          const compDir = path.join(paths.compRoot, 'src', compDirName);
          if (fs.existsSync(compDir)) {
            return `组件 ${compDirName} 已存在，请使用其他名称`;
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
    const compDirName = names.getComponentDirName(name);

    console.log('\n开始创建组件文件...\n');

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
      ? `\n✅ 组件 ${pascalName}（${chineseName}）创建成功!\n`
      : `\n✅ 组件 ${pascalName} 创建成功!\n`;
    console.log(successMessage);
  } catch (error) {
    console.error('\n❌ 创建组件时发生错误:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ 未处理的错误:', error);
  process.exit(1);
});
