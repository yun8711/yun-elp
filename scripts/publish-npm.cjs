#!/usr/bin/env node

/**
 * 人工发布到 npm，支持传入 OTP：
 *   pnpm publish:main -- --otp=123456
 *   pnpm publish:mcp -- --otp=123456
 * 也可设置环境变量 NPM_OTP=123456；未提供时 npm 会交互式提示输入。
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const target = process.argv[2];

if (!target || !['main', 'mcp'].includes(target)) {
  console.error('Usage: node scripts/publish-npm.cjs <main|mcp> [--otp=xxxxxx]');
  process.exit(1);
}

const otpArg = process.argv.slice(3).find(arg => arg.startsWith('--otp='));
const otp = otpArg || (process.env.NPM_OTP ? `--otp=${process.env.NPM_OTP}` : '');

function run(command, cwd = rootDir) {
  execSync(command, { stdio: 'inherit', cwd, env: process.env });
}

run('node scripts/pre-publish-check.cjs --artifacts');

if (target === 'main') {
  run(`npm publish --registry=https://registry.npmjs.org/ ${otp}`.trim(), path.join(rootDir, 'dist'));
} else {
  run(`pnpm publish -F yun-elp-mcp --access public --no-git-checks ${otp}`.trim());
}
