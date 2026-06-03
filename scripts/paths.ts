/**
 * 定义各类项目中使用到的路径
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
export const projRoot = path.resolve(__dirname, '..');
// 组件库核心目录
export const pkgRoot = path.resolve(projRoot, 'packages');
// 组件库子项目目录
export const compRoot = path.resolve(pkgRoot, 'components');
// 组件库 locale 目录（位于 components 包内）
export const localeRoot = path.resolve(compRoot, 'locale');
// 组件样式目录
export const styleRoot = path.resolve(pkgRoot, 'theme-chalk');

// 组件文档子项目目录
export const docsRoot = path.resolve(projRoot, 'docs');

// 组件库打包输出目录
export const distDir = path.resolve(projRoot, 'dist');
