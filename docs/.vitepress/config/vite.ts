import path from 'path';
// import Inspect from 'vite-plugin-inspect'
import UnoCSS from 'unocss/vite';
// import mkcert from 'vite-plugin-mkcert'
// import glob from 'fast-glob';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { loadEnv } from 'vitepress';
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import type { PluginOption } from 'vite';
// import { docPackage, epPackage, getPackageDependencies, projRoot } from '@element-plus/build-utils';
// import { MarkdownTransform } from '../plugins/markdown-transform';
import { MdTransform } from '../plugins/md-transform';
import type { Plugin, UserConfig } from 'vite';
import { createLogger } from 'vite';
import { pkgRoot, projRoot } from '../../../scripts/paths';

type ViteConfig = Required<UserConfig>;
type ResolveOptions = Required<ViteConfig>['resolve'];
type AliasOptions = Required<ResolveOptions>['alias'];

// const { dependencies: epDeps } = getPackageDependencies(epPackage);
// const { dependencies: docsDeps } = getPackageDependencies(docPackage);
// const optimizeDeps = [...new Set([...epDeps, ...docsDeps])].filter(
//   dep => !dep.startsWith('@types/') && !['@element-plus/metadata', 'element-plus'].includes(dep)
// );
// optimizeDeps.push(
//   ...(await glob(['dayjs/plugin/*.js'], {
//     cwd: path.resolve(projRoot, 'node_modules'),
//     onlyFiles: true
//   }))
// );

// 基础依赖预构建配置
const optimizeDeps = ['vue', 'vue-router', 'dayjs', '@vueuse/core', 'markdown-it', 'prismjs'];

const alias: AliasOptions = [
  {
    find: '~/',
    replacement: `${path.resolve(__dirname, '../')}/`
  },
  {
    find: /^@yun-elp(\/(es|lib))?$/,
    replacement: path.resolve(pkgRoot, 'components/index.ts')
  },
  {
    find: /^@yun-elp\/(es|lib)\/(.*)$/,
    replacement: `${path.resolve(projRoot, 'packages')}/$2`
  },
];

const getViteConfig = ({ mode }: { mode: string }): ViteConfig => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    // root: process.cwd(),
    // base: '/',
    // publicDir: 'public',
    // cacheDir: 'node_modules/.vite',
    // mode,
    // define: {},
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use "@yun-elp/theme-chalk/src/themes/kd.scss" as *;`
        }
      }
    },
    server: {
      host: true,
      fs: {
        allow: [process.cwd()]
      }
    },
    resolve: {
      alias
      // dedupe: ['vue']
    },
    plugins: [
      vueJsx() as PluginOption,
      // 自动导入组件
      Components({
        dirs: ['.vitepress/vitepress/components'],
        allowOverrides: true,
        resolvers: [
          IconsResolver()
          // name => {
          //   if (name.startsWith('Yun')) {
          //     return {
          //       name,
          //       from: '@yun-elp/components'
          //     };
          //   }
          // }
        ],
        include: [/\.vue$/, /\.vue\?vue/]
      }) as PluginOption,

      // 图标自动导入
      Icons({
        autoInstall: true
      }) as PluginOption,

      // UnoCSS
      UnoCSS({
        inspector: false
      }) as PluginOption,

      MdTransform() as PluginOption,

      // 图标分组插件
      groupIconVitePlugin() as PluginOption
    ],
    optimizeDeps: {
      include: optimizeDeps
      // exclude: ['@yun-elp/theme-chalk']
    }
    // build: {
    //   target: 'es2020',
    //   minify: 'terser',
    //   cssCodeSplit: true,
    //   rollupOptions: {
    //     output: {
    //       manualChunks: {
    //         'vue-vendor': ['vue', 'vue-router'],
    //         'markdown-vendor': ['markdown-it', 'prismjs']
    //       }
    //     }
    //   }
    // },
    // html: {},
    // json: {
    //   stringify: true
    // },
    // esbuild: {
    //   target: 'es2020'
    // },
    // assetsInclude: [],
    // ssr: {
    //   noExternal: []
    // },
    // worker: {
    //   format: 'es'
    // },
    // preview: {
    //   port: 4173,
    //   strictPort: true,
    //   host: true
    // },
    // logLevel: 'info',
    // clearScreen: false,
    // envPrefix: ['VITE_', 'VITEPRESS_'],
    // appType: 'custom',
    // experimental: {
    //   renderBuiltUrl: undefined
    // },
    // legacy: {},
    // customLogger: createLogger(),
    // envDir: process.cwd()
  };
};

export default getViteConfig;
