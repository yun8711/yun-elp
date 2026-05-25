/**
 * monorepo 内 Vite 共享配置：alias、SCSS 预处理器等
 */
import path from 'path';
import type { Alias, AliasOptions } from 'vite';
import { compRoot, projRoot, styleRoot } from './paths';

/** 统一的 SCSS 预处理器配置 */
export const scssPreprocessorOptions = {
  scss: {
    api: 'modern-compiler' as const
  }
};

/** components 包内部 alias（构建 / 测试用） */
export function createComponentsAliases(packageRoot: string): AliasOptions {
  return {
    '@': path.join(packageRoot, 'src'),
    '~': packageRoot,
    '@yun-elp/theme-chalk': path.join(styleRoot, 'src')
  };
}

/**
 * yun-elp monorepo 开发态通用 Vite alias
 * play、docs 等子项目共用，保证源码引用路径一致
 */
export function createYunElpAliases(
  options: {
    /** 子项目根目录，配置 `@` → `{projectRoot}/src` */
    projectRoot?: string;
    /** docs 专用：`.vitepress` 目录，配置 `~/` 别名 */
    vitepressDir?: string;
  } = {}
): AliasOptions {
  const aliases: Alias[] = [
    {
      find: '@yun-elp/components/locale',
      replacement: path.join(compRoot, 'locale')
    },
    {
      find: '@yun-elp/components/hooks',
      replacement: path.join(compRoot, 'hooks')
    },
    {
      find: /^@yun-elp\/components$/,
      replacement: path.join(compRoot, 'index.ts')
    },
    {
      find: /^@yun-elp(\/(es|lib))?$/,
      replacement: path.join(compRoot, 'index.ts')
    },
    {
      find: /^@yun-elp\/(es|lib)\/(.*)$/,
      replacement: `${path.join(projRoot, 'packages')}/$2`
    },
    {
      find: '@yun-elp/theme-chalk',
      replacement: path.join(styleRoot, 'src')
    },
    {
      find: /^yun-elp$/,
      replacement: path.join(compRoot, 'index.ts')
    },
    {
      find: /^yun-elp\/theme-chalk\/src\/(.+)$/,
      replacement: `${path.join(styleRoot, 'src')}/$1`
    },
    {
      find: /^yun-elp\/theme-chalk\/(.+)$/,
      replacement: `${path.join(styleRoot)}/$1`
    }
  ];

  if (options.projectRoot) {
    aliases.unshift({
      find: '@',
      replacement: path.join(options.projectRoot, 'src')
    });
  }

  if (options.vitepressDir) {
    aliases.push({
      find: '~/',
      replacement: `${options.vitepressDir}/`
    });
  }

  return aliases;
}
