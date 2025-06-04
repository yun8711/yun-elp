import { pkgRoot, distDir } from './paths';
import path from 'path';
import fs from 'fs';
// 复制根目录的 package.json 到 dist 目录
const elpPkgPath = path.join(pkgRoot, 'elp', 'package.json');
const distPkgPath = path.join(distDir, 'package.json');
if (fs.existsSync(elpPkgPath)) {
  fs.copyFileSync(elpPkgPath, distPkgPath);
  console.log('已复制 package.json 到 dist 目录');
} else {
  console.warn('警告：根目录的 package.json 文件不存在');
}
