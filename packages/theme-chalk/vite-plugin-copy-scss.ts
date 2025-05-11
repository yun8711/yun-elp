import type { Plugin } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 递归复制目录
function copyDir(sourceDir: string, targetDir: string) {
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const files = readdirSync(sourceDir);
  files.forEach(file => {
    const sourcePath = resolve(sourceDir, file);
    const targetPath = resolve(targetDir, file);

    if (statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else if (file.endsWith('.scss')) {
      copyFileSync(sourcePath, targetPath);
    }
  });
}

export default function copyScssPlugin(): Plugin {
  return {
    name: 'vite-plugin-copy-scss',
    closeBundle: async () => {
      const sourceDir = resolve(__dirname, 'src');
      const outputDir = resolve(__dirname, '../../dist/theme-chalk/src');

      // 复制整个 src 目录下的所有 SCSS 文件
      copyDir(sourceDir, outputDir);
    }
  };
}
