import { pkgRoot } from './paths';
import path from 'path';
import fs from 'fs';

/**
 * 同步根目录版本号到 elp 包的 package.json
 * 用于在 release 时确保版本号一致
 */
function syncVersion() {
  const rootPkgPath = path.join(pkgRoot, '..', 'package.json');
  const elpPkgPath = path.join(pkgRoot, 'elp', 'package.json');

  if (!fs.existsSync(rootPkgPath)) {
    console.error('❌ 找不到根目录 package.json 文件');
    process.exit(1);
  }

  if (!fs.existsSync(elpPkgPath)) {
    console.error('❌ 找不到 elp 包的 package.json 文件');
    process.exit(1);
  }

  try {
    // 读取根目录版本号
    const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'));
    const newVersion = rootPkg.version;

    // 更新 elp 包版本号
    const elpPkg = JSON.parse(fs.readFileSync(elpPkgPath, 'utf-8'));
    const oldVersion = elpPkg.version;

    if (oldVersion === newVersion) {
      console.log(`✅ elp 包版本号已是最新版本: ${newVersion}`);
      return;
    }

    elpPkg.version = newVersion;
    fs.writeFileSync(elpPkgPath, JSON.stringify(elpPkg, null, 2));

    console.log(`✅ 已同步 elp 包版本号: ${oldVersion} → ${newVersion}`);
  } catch (error) {
    console.error('❌ 同步版本号失败:', error);
    process.exit(1);
  }
}

syncVersion();
