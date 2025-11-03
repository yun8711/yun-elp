import { pkgRoot, distDir } from './paths';
import path from 'path';
import fs from 'fs';
// 复制 elp 包的 package.json 到 dist 目录
const elpPkgPath = path.join(pkgRoot, 'elp', 'package.json');
const distPkgPath = path.join(distDir, 'package.json');

if (fs.existsSync(elpPkgPath)) {
  // 直接复制 elp 包的 package.json 到 dist 目录
  // 注意：版本号已在 release 时通过 sync-version.ts 脚本同步
  fs.copyFileSync(elpPkgPath, distPkgPath);
  console.log('已复制 package.json 到 dist 目录');
} else {
  console.warn('警告：elp 包的 package.json 文件不存在');
}
