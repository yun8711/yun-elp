import path from 'path';
import UnoCSS from 'unocss/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { loadEnv } from 'vitepress';
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import type { PluginOption } from 'vite';
import { MdTransform } from '../plugins/md-transform';
import type { UserConfig } from 'vite';
import { createYunElpAliases, scssPreprocessorOptions } from '../../../scripts/vite-shared';

type ViteConfig = Required<UserConfig>;

const optimizeDeps = ['vue', 'vue-router', 'dayjs', '@vueuse/core', 'markdown-it', 'prismjs'];

const getViteConfig = ({ mode }: { mode: string }): ViteConfig => {
  loadEnv(mode, process.cwd(), '');

  return {
    css: {
      preprocessorOptions: {
        scss: {
          ...scssPreprocessorOptions.scss,
          additionalData: `@use "@yun-elp/theme-chalk/themes/kd.scss" as *;`
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
      alias: createYunElpAliases({
        vitepressDir: path.resolve(__dirname, '../')
      })
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
