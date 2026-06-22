#!/usr/bin/env node

/**
 * 发布前检查脚本
 * - 默认（轻）：版本 → build → dist 校验
 * - --full：额外包含 lint、测试、依赖 audit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const isFull = process.argv.includes('--full');

function readPkg(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

const versionCheck = {
  name: '版本一致性检查',
  check: () => {
    const rootPkg = readPkg('package.json');
    const elpPkg = readPkg('packages/elp/package.json');

    if (rootPkg.version !== elpPkg.version) {
      throw new Error(
        `版本不一致: 根目录 ${rootPkg.version} vs packages/elp ${elpPkg.version}，请先运行 release 或 sync-version`
      );
    }

    console.log(`✅ 版本一致性检查通过: v${rootPkg.version}`);
    return true;
  },
  description: '检查根目录与 packages/elp 的版本是否一致'
};

const buildCheck = {
  name: '构建检查',
  command: 'pnpm build',
  description: '确保构建成功且生成正确的输出'
};

const distCheck = {
  name: '构建产物检查',
  check: () => {
    const distPath = path.join(rootDir, 'dist');
    const rootPkg = readPkg('package.json');

    if (!fs.existsSync(distPath)) {
      throw new Error('dist 目录不存在，请先运行构建');
    }

    const requiredPaths = ['es/index.mjs', 'es/index.d.ts', 'global.d.ts', 'package.json'];

    for (const relativePath of requiredPaths) {
      if (!fs.existsSync(path.join(distPath, relativePath))) {
        throw new Error(`缺少必要的构建产物: ${relativePath}`);
      }
    }

    const distPkgPath = path.join(distPath, 'package.json');
    const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));
    if (distPkg.version !== rootPkg.version) {
      throw new Error(
        `dist 版本不一致: dist ${distPkg.version} vs 根目录 ${rootPkg.version}，请重新运行 pnpm build`
      );
    }

    console.log('✅ 构建产物完整性检查通过');
    return true;
  },
  description: '检查构建产物是否完整，且 dist 版本与根目录一致'
};

const fullChecks = [
  {
    name: '代码规范检查',
    command: 'pnpm lint',
    description: '运行 ESLint、Prettier 和 StyleLint 检查'
  },
  {
    name: '单元测试',
    command: 'pnpm -C packages/components test:run',
    description: '运行所有组件测试'
  },
  {
    name: '依赖安全检查',
    command: 'pnpm audit --audit-level moderate',
    description: '检查依赖的安全漏洞',
    allowFailure: true
  }
];

const lightChecks = [versionCheck, buildCheck, distCheck];
const checks = isFull ? [...fullChecks.slice(0, 2), ...lightChecks, fullChecks[2]] : lightChecks;

console.log(`🚀 开始发布前检查（${isFull ? '完整' : '轻量'}模式）...\n`);

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
        cwd: rootDir
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
}

console.log('💥 发布前检查失败，请修复问题后再发布。');
process.exit(1);
