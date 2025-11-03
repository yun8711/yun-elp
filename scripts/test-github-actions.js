#!/usr/bin/env node

/**
 * GitHub Actions 配置测试脚本
 * 用于验证工作流配置是否正确
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 测试 GitHub Actions 配置...\n');

// 检查工作流文件是否存在
const workflowPath = path.join(__dirname, '..', '.github', 'workflows', 'deploy-docs.yml');
if (!fs.existsSync(workflowPath)) {
  console.error('❌ 找不到工作流文件:', workflowPath);
  process.exit(1);
}

console.log('✅ 工作流文件存在');

// 读取工作流内容
const workflowContent = fs.readFileSync(workflowPath, 'utf8');
console.log('✅ 工作流文件已读取');
const checks = [
  { pattern: 'name:', description: '工作流名称' },
  { pattern: 'on:', description: '触发条件' },
  { pattern: 'push:', description: '推送触发' },
  { pattern: 'branches:', description: '分支配置' },
  { pattern: 'main', description: 'main分支监听' },
  { pattern: 'workflow_dispatch:', description: '手动触发' },
  { pattern: 'permissions:', description: '权限配置' },
  { pattern: 'contents: read', description: '读取权限' },
  { pattern: 'pages: write', description: 'Pages写入权限' },
  { pattern: 'id-token: write', description: '令牌权限' },
  { pattern: 'concurrency:', description: '并发控制' },
  { pattern: 'jobs:', description: '作业定义' },
  { pattern: 'build:', description: '构建作业' },
  { pattern: 'deploy:', description: '部署作业' },
  { pattern: 'needs: build', description: '作业依赖' },
  { pattern: 'actions/checkout', description: '代码检出' },
  { pattern: 'actions/setup-node', description: 'Node.js设置' },
  { pattern: 'pnpm/action-setup', description: 'pnpm设置' },
  { pattern: 'actions/configure-pages', description: 'Pages配置' },
  { pattern: 'actions/upload-pages-artifact', description: '产物上传' },
  { pattern: 'actions/deploy-pages', description: 'Pages部署' }
];

console.log('\n🔍 检查配置项...');
let passed = 0;
checks.forEach(check => {
  if (workflowContent.includes(check.pattern)) {
    console.log(`✅ ${check.description}`);
    passed++;
  } else {
    console.log(`❌ 缺少: ${check.description}`);
  }
});

console.log(`\n📊 配置检查结果: ${passed}/${checks.length} 项通过`);

if (passed === checks.length) {
  console.log('🎉 GitHub Actions 配置验证通过！');
} else {
  console.log('⚠️ 部分配置项缺失，请检查工作流文件');
  process.exit(1);
}

// 检查 package.json 脚本
console.log('\n🔍 检查 package.json 脚本...');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredScripts = ['build:comp', 'build:style', 'build:resolver', 'build:docs'];

  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ 脚本 ${script} 存在`);
    } else {
      console.log(`❌ 脚本 ${script} 缺失`);
    }
  });
} else {
  console.log('❌ 找不到 package.json 文件');
}

console.log('\n✨ 本地验证完成！');
console.log('📝 下一步: 推送到 GitHub 并启用 Pages，或在 Actions 中手动触发测试');
