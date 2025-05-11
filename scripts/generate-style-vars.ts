import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { COMPONENT_PREFIX } from './base-config';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const scssContent = `
// 此文件由构建脚本自动生成，请勿手动修改
$namespace: '${COMPONENT_PREFIX}' !default;
`;

writeFileSync(resolve(__dirname, '../packages/theme-chalk/src/mixins/namespace.scss'), scssContent);
