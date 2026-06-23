import { pkgRoot } from './paths';
import path from 'path';
import fs from 'fs';

const SYNC_TARGETS = ['elp/package.json', 'mcp-server/package.json'] as const;

/**
 * 同步根目录版本号到子包 package.json
 * 用于 release 时确保 elp、mcp-server 与根目录版本一致
 */
function syncPackageVersion(relativePath: string, newVersion: string) {
  const pkgPath = path.join(pkgRoot, relativePath);

  if (!fs.existsSync(pkgPath)) {
    console.error(`❌ 找不到 ${relativePath}`);
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const oldVersion = pkg.version;

  if (oldVersion === newVersion) {
    console.log(`✅ ${relativePath} 版本号已是最新: ${newVersion}`);
    return;
  }

  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`✅ 已同步 ${relativePath}: ${oldVersion} → ${newVersion}`);
}

function syncVersion() {
  const rootPkgPath = path.join(pkgRoot, '..', 'package.json');

  if (!fs.existsSync(rootPkgPath)) {
    console.error('❌ 找不到根目录 package.json 文件');
    process.exit(1);
  }

  try {
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
    const newVersion = rootPkg.version;

    SYNC_TARGETS.forEach(relativePath => syncPackageVersion(relativePath, newVersion));
  } catch (error) {
    console.error('❌ 同步版本号失败:', error);
    process.exit(1);
  }
}

syncVersion();
