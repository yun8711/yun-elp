import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'path';
import generateTypes from './vite-plugin-generate-types';

export default defineConfig({
  /**
   * 插件配置
   *
   * @see plugins https://cn.vitejs.dev/config/shared-options.html#plugins
   */
  plugins: [
    /**
     * vue 插件
     *
     * @see vite-plugin-vue https://github.com/vitejs/vite-plugin-vue
     * @see defineModel https://github.com/vuejs/rfcs/discussions/503
     */
    vue(),
    /**
     * 打包类型声明文件
     * @see vite-plugin-dts https://github.com/qmhc/vite-plugin-dts
     */
    dts({
      include: [
        'src/**/*.ts',
        'src/**/*.vue',
        'src/**/*.vue.ts',
        'hooks/*.ts',
        'locale/**/*.ts',
        'locale/index.ts',
        'utils/*.ts',
        'index.ts',
        'components.ts',
        'default.ts'
      ],
      outDir: '../../dist/es',
      staticImport: true,
      compilerOptions: {
        sourceMap: false,
        // 确保类型声明文件可以在 JS 项目中使用
        skipLibCheck: true,
        // 将类型依赖标记为可选
        types: ['vue']
      },
      // 在类型声明文件中添加类型引用
      beforeWriteFile: (filePath, content) => {
        if (filePath.endsWith('.d.ts')) {
          return {
            filePath,
            content: `/// <reference types="vue" />\n${content}`
          };
        }
        return { filePath, content };
      }
    }),
    generateTypes(),
    /**
     * 可视化分析构建后的文件
     * @see rollup-plugin-visualizer https://github.com/btd/rollup-plugin-visualizer
     */
    visualizer({
      projectRoot: resolve(__dirname, '../../'),
      filename: '../../stats.html', // 分析图生成的文件名
      open: false, // 自动打开分析图
      gzipSize: true, // 收集 gzip 大小
      brotliSize: false, // 收集 brotli 大小，太新了，不一定支持
      template: 'treemap' // 图表类型，可选 sunburst、treemap、network
    }) as PluginOption
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/styles/variables.scss" as *;`,
        api: 'modern-compiler',
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    }
  },
  build: {
    /**
     * 传递给 Terser 的更多 minify 选项
     * @see https://terser.org/docs/api-reference/#minify-options
     *
     */
    // 禁用代码压缩
    minify: false,
    // 使用更保守的压缩配置
    terserOptions: {
      compress: {
        keep_fnames: true, // 保留函数名
        keep_classnames: true // 保留类名
      },
      mangle: {
        keep_fnames: true, // 保留函数名
        keep_classnames: true // 保留类名
      }
    },
    /**
     * 库模式
     *
     * @see 库模式 https://cn.vitejs.dev/guide/build.html#library-mode
     */
    lib: {
      // 库模式下，必须声明入口文件
      entry: {
        index: resolve(__dirname, 'index.ts')
        // resolvers: resolve(__dirname, 'resolvers/index.ts')
      },
      formats: ['es'],
      // 自定义构建结果中的入口文件名称
      fileName: (format, entryName) => {
        return `${format}/${entryName}.mjs`;
      }
    },
    /**
     * rollup 配置项
     * @see https://cn.rollupjs.org/configuration-options/
     */
    rollupOptions: {
      external: [
        'vue',
        '@vue/runtime-core',
        'vue-router',
        'element-plus',
        'lodash-es',
        /^element-plus\/.*/,
        /^@element-plus\/.*/,
        /^node_modules\/.*/,
        '@constants'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        preserveModules: true,
        preserveModulesRoot: '',
        exports: 'named',
        // 确保样式文件被正确处理
        assetFileNames: assetInfo => {
          const name = assetInfo.name!;
          if (name.endsWith('.css')) {
            return 'style/[name][extname]';
          }
          return '[name][extname]';
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: true,
    outDir: '../../dist',
    emptyOutDir: true
  },
  resolve: {
    // Vite 的模块解析机制：
    // 首先检查是否是相对路径（以 ./ 或 ../ 开头）
    // 如果不是相对路径，会检查是否是绝对路径（以 / 开头）
    // 如果都不是，会尝试从 node_modules 中查找
    // 最后会检查 resolve.alias 配置
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, '.'),
      '@yun-elp/theme-chalk': resolve(__dirname, '../theme-chalk/src')
    }
  }
});
