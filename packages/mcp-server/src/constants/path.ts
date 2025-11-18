import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

// 项目根目录，yun-elp
const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../../');

// 组件库输出目录，yun-elp/dist
const DIST_DIR = resolve(ROOT_DIR, 'dist');

// 组件文档目录，yun-elp/docs/components/xxx
const DOC_DIR = resolve(ROOT_DIR, 'docs/components');

export { ROOT_DIR, DIST_DIR, DOC_DIR };
