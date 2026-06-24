#!/usr/bin/env node

/**
 * 发布流程检查脚本
 * - --quality（check:release）：audit（仅警告）→ 组件库 lint / typecheck → 覆盖率测试
 * - --publish（check:publish）：版本 → build → dist 校验
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const isPublish = process.argv.includes('--publish');

/** 随 yun-elp 主包发布的源码包，不含 play / docs / mcp-server */
const LIB_ROOTS = ['packages/components', 'packages/theme-chalk', 'packages/resolver'];
const LIB_STYLELINT = [
  'packages/components/**/*.{vue,scss,css}',
  'packages/theme-chalk/**/*.{scss,css}'
];

function readPkg(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

function run(command) {
  execSync(command, { stdio: 'inherit', cwd: rootDir });
}

function libLintCheck() {
  const prettierTargets = LIB_ROOTS.map((dir) => `"${dir}/**/*"`).join(' ');
  const stylelintTargets = LIB_STYLELINT.map((glob) => `"${glob}"`).join(' ');

  run(`pnpm exec prettier --check ${prettierTargets}`);
  run(`pnpm exec eslint ${LIB_ROOTS.join(' ')}`);
  run(`pnpm exec stylelint ${stylelintTargets}`);
}

const auditCheck = {
  name: '依赖安全检查',
  command: 'pnpm audit --audit-level moderate',
  description: '检查依赖的安全漏洞（失败仅警告，不阻断发版）',
  allowFailure: true
};

const qualityChecks = [
  auditCheck,
  {
    name: '代码规范检查',
    check: libLintCheck,
    description: '检查 components、theme-chalk、resolver 的 ESLint / Prettier / Stylelint'
  },
  {
    name: 'TypeScript 类型检查',
    command: 'pnpm -C packages/components typecheck',
    description: '检查 packages/components 的类型'
  },
  {
    name: '单元测试',
    command: 'pnpm test',
    description: '运行组件测试并校验覆盖率阈值'
  }
];

const VERSION_TARGETS = ['packages/elp/package.json', 'packages/mcp-server/package.json'];

const versionCheck = {
  name: '版本一致性检查',
  check: () => {
    const rootPkg = readPkg('package.json');

    for (const relativePath of VERSION_TARGETS) {
      const targetPkg = readPkg(relativePath);

      if (rootPkg.version !== targetPkg.version) {
        throw new Error(
          `版本不一致: 根目录 ${rootPkg.version} vs ${relativePath} ${targetPkg.version}，请先运行 release 或 sync-version`
        );
      }
    }

    console.log(`✅ 版本一致性检查通过: v${rootPkg.version}`);
    return true;
  },
  description: '检查根目录与 packages/elp、mcp-server 的版本是否一致'
};

const buildCheck = {
  name: '构建检查',
  command: 'pnpm build',
  description: '确保构建成功且生成正确的输出'
};

const DIST_REQUIRED_PATHS = [
  'es/index.mjs',
  'es/index.d.ts',
  'global.d.ts',
  'package.json',
  'web-types.json',
  'tags.json',
  'theme-chalk/index.css',
  'resolver.mjs',
  'resolver.d.ts'
];

const distCheck = {
  name: '构建产物检查',
  check: () => {
    const distPath = path.join(rootDir, 'dist');
    const rootPkg = readPkg('package.json');

    if (!fs.existsSync(distPath)) {
      throw new Error('dist 目录不存在，请先运行构建');
    }

    for (const relativePath of DIST_REQUIRED_PATHS) {
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

const publishChecks = [versionCheck, buildCheck, distCheck];
const checks = isPublish ? publishChecks : qualityChecks;
const modeLabel = isPublish ? '发布构建' : '发版前质量';

console.log(`🚀 开始检查（${modeLabel}）...\n`);

let allPassed = true;

for (const check of checks) {
  try {
    console.log(`🔍 执行: ${check.name}`);
    console.log(`   ${check.description}`);

    if (check.check) {
      check.check();
    } else {
      execSync(check.command, {
        stdio: 'inherit',
        cwd: rootDir
      });
    }

    console.log(`✅ ${check.name} 通过\n`);
  } catch (error) {
    if (check.allowFailure) {
      console.log(`⚠️  ${check.name} 发现问题，但不阻断发版: ${error.message}\n`);
    } else {
      console.log(`❌ ${check.name} 失败: ${error.message}\n`);
      allPassed = false;
    }
  }
}

if (allPassed) {
  if (isPublish) {
    console.log('🎉 发布构建检查通过，可以执行 pnpm publish。');
  } else {
    console.log('🎉 发版前质量检查通过，可以执行 pnpm release。');
  }
  process.exit(0);
}

console.log('💥 检查失败，请修复问题后重试。');
process.exit(1);
