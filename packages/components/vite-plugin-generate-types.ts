// vite-plugin-generate-types.ts
import { Plugin } from 'vite';
import { resolve } from 'path';
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { getCamelCaseName } from '../../scripts/names';
import { compRoot, distDir } from '../../scripts/paths';

export default function generateTypes(): Plugin {
  return {
    name: 'vite-plugin-generate-types',
    closeBundle: async () => {
      const componentsDir = resolve(compRoot, 'src');
      const components = readdirSync(componentsDir)
        .filter(x => {
          return !x.startsWith('.') && !x.endsWith('.ts');
        })
        .map(dir => ({
          name: getCamelCaseName(dir, true),
          path: `./es/src/${dir}`
        }));

      const typeContent = `
declare module 'vue' {
  export interface GlobalComponents {
    ${components
      .map(comp => `${comp.name}: typeof import('${comp.path}')['default']`)
      .join('\n    ')}
  }

  interface ComponentCustomProperties {
    // 全局属性类型声明
  }
}

export {}
`;

      // 确保目录存在
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }
      writeFileSync(resolve(distDir, 'global.d.ts'), typeContent, 'utf-8');
    }
  };
}
