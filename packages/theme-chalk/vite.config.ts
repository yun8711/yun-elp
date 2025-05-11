import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import copyScssPlugin from './vite-plugin-copy-scss';

const __dirname = dirname(fileURLToPath(import.meta.url));

// 获取所有组件目录
const componentsDir = resolve(__dirname, 'src');
const components = readdirSync(componentsDir).filter(file => {
  const fullPath = resolve(componentsDir, file);
  return !statSync(fullPath).isDirectory();
});

// console.log('components', components);
//  [ 'app-wrap.scss', 'index.scss', 'label.scss' ]

// 生成样式入口文件
const styleEntries = components.reduce(
  (entries, component) => {
    // 检查组件目录下的 index.scss
    const stylePath = resolve(componentsDir, component);
    if (existsSync(stylePath)) {
      entries[component] = stylePath;
    }
    return entries;
  },
  {} as Record<string, string>
);

// console.log('styleEntries', styleEntries);
// {
//   'app-wrap.scss': 'C:\\Users\\liuyun\\Documents\\ly\\yun-elp\\packages\\theme-chalk\\src\\app-wrap.scss',
//   'index.scss': 'C:\\Users\\liuyun\\Documents\\ly\\yun-elp\\packages\\theme-chalk\\src\\index.scss',
//   'label.scss': 'C:\\Users\\liuyun\\Documents\\ly\\yun-elp\\packages\\theme-chalk\\src\\label.scss'
// }

export default defineConfig({
  plugins: [copyScssPlugin()],
  build: {
    outDir: '../../dist/theme-chalk',
    emptyOutDir: true,
    lib: {
      entry: styleEntries,
      formats: ['es']
    },
    rollupOptions: {
      output: {
        // 确保样式文件保持原始目录结构
        preserveModules: true,
        preserveModulesRoot: 'src',
        // 自定义输出文件名
        entryFileNames: chunkInfo => {
          // console.log('chunkInfo', chunkInfo);
          const name = chunkInfo.name;
          if (name === 'index') {
            return 'index.css';
          }
          return `${name}/index.css`;
        }
      }
    },
    // 确保 CSS 文件被正确处理
    cssCodeSplit: true
  }
});
