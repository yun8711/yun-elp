#!/usr/bin/env node

/**
 * 工作流完整测试脚本
 * 模拟 GitHub Actions 环境的完整构建流程
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 开始完整工作流测试...\n');

// 设置环境变量（模拟生产环境）
process.env.NODE_ENV = 'production';

const steps = [
  {
    name: '清理旧构建文件',
    command: 'rimraf dist docs/.vitepress/dist',
    description: '清理之前的构建产物'
  },
  {
    name: '安装依赖',
    command: 'pnpm install --frozen-lockfile',
    description: '安装项目依赖'
  },
  {
    name: '构建组件库',
    command: 'pnpm build:comp',
    description: '构建 Vue 组件库核心代码'
  },
  {
    name: '构建样式',
    command: 'pnpm build:style',
    description: '构建组件样式文件'
  },
  {
    name: '构建解析器',
    command: 'pnpm build:resolver',
    description: '构建 IDE 解析器'
  },
  {
    name: '构建文档',
    command: 'pnpm build:docs',
    description: '构建 VitePress 文档网站'
  },
  {
    name: '复制包配置',
    command: 'pnpm build:pkg',
    description: '复制发布包配置到 dist 目录'
  }
];

let successCount = 0;

for (const step of steps) {
  try {
    console.log(`📦 执行: ${step.name}`);
    console.log(`   ${step.description}`);

    execSync(step.command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log(`✅ ${step.name} 成功\n`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${step.name} 失败:`, error.message);
    console.log('');
  }
}

// 检查构建产物
console.log('🔍 检查构建产物...');

const checks = [
  {
    path: 'dist/es/index.mjs',
    description: '组件库 ESM 入口文件'
  },
  {
    path: 'dist/theme-chalk/index.css',
    description: '组件样式文件'
  },
  {
    path: 'dist/resolver.mjs',
    description: 'IDE 解析器文件'
  },
  {
    path: 'docs/.vitepress/dist/index.html',
    description: '文档网站首页'
  },
  {
    path: 'dist/package.json',
    description: '发布包配置文件'
  }
];

let artifactCount = 0;
checks.forEach(check => {
  const fullPath = path.join(__dirname, '..', check.path);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${check.description}`);
    artifactCount++;
  } else {
    console.log(`❌ 缺少: ${check.description}`);
  }
});

console.log(`\n📊 测试结果:`);
console.log(`   构建步骤: ${successCount}/${steps.length} 成功`);
console.log(`   产物检查: ${artifactCount}/${checks.length} 通过`);

if (successCount === steps.length && artifactCount === checks.length) {
  console.log('\n🎉 完整工作流测试通过！GitHub Actions 应该可以正常工作');
  console.log('\n📝 接下来的步骤:');
  console.log('   1. 推送到 GitHub main 分支');
  console.log('   2. 在仓库 Settings → Pages 中选择 "GitHub Actions" 作为源');
  console.log('   3. 等待自动部署完成');
  console.log('   4. 访问 https://username.github.io/yun-elp 查看文档');
} else {
  console.log('\n⚠️ 部分测试失败，请检查错误信息并修复问题');
  process.exit(1);
}
