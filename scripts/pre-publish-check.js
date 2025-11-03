#!/usr/bin/env node

/**
 * 发布前检查脚本
 * 确保发布版本的质量和完整性
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始发布前检查...\n');

// 检查清单
const checks = [
  {
    name: '代码规范检查',
    command: 'pnpm lint',
    description: '运行ESLint、Prettier和StyleLint检查'
  },
  {
    name: '单元测试',
    command: 'pnpm test --run',
    description: '运行所有组件测试'
  },
  {
    name: '构建检查',
    command: 'pnpm build',
    description: '确保构建成功且生成正确的输出'
  },
  {
    name: '版本一致性检查',
    check: () => {
      const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const componentsPkg = JSON.parse(fs.readFileSync('packages/components/package.json', 'utf8'));

      if (rootPkg.version !== componentsPkg.version) {
        throw new Error(`版本不一致: 根目录 ${rootPkg.version} vs 组件包 ${componentsPkg.version}`);
      }

      console.log(`✅ 版本一致性检查通过: v${rootPkg.version}`);
      return true;
    },
    description: '检查所有包的版本是否一致'
  },
  {
    name: '构建产物检查',
    check: () => {
      const distPath = path.join(__dirname, '..', 'dist');

      if (!fs.existsSync(distPath)) {
        throw new Error('dist目录不存在，请先运行构建');
      }

      const files = fs.readdirSync(distPath);
      const requiredFiles = ['es', 'global.d.ts', 'index.mjs'];

      for (const file of requiredFiles) {
        if (!files.includes(file)) {
          throw new Error(`缺少必要的构建产物: ${file}`);
        }
      }

      console.log('✅ 构建产物完整性检查通过');
      return true;
    },
    description: '检查构建产物是否完整'
  },
  {
    name: '依赖安全检查',
    command: 'pnpm audit --audit-level moderate',
    description: '检查依赖的安全漏洞',
    allowFailure: true // 允许警告但不阻断发布
  }
];

let allPassed = true;

for (const check of checks) {
  try {
    console.log(`🔍 执行: ${check.name}`);
    console.log(`   ${check.description}`);

    if (check.check) {
      check.check();
    } else {
      execSync(check.command, {
        stdio: check.allowFailure ? 'pipe' : 'inherit',
        cwd: path.join(__dirname, '..')
      });
    }

    console.log(`✅ ${check.name} 通过\n`);
  } catch (error) {
    if (check.allowFailure) {
      console.log(`⚠️  ${check.name} 发现问题，但允许继续: ${error.message}\n`);
    } else {
      console.log(`❌ ${check.name} 失败: ${error.message}\n`);
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log('🎉 所有发布前检查都通过了！准备发布...');
  process.exit(0);
} else {
  console.log('💥 发布前检查失败，请修复问题后再发布。');
  process.exit(1);
}
