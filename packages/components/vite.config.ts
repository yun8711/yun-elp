import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';
import { resolve } from 'node:path';
import { createComponentsAliases, scssPreprocessorOptions } from '../../scripts/vite-shared';
import generateTypes from './vite-plugin-generate-types';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

/**
 * 清洗 preserveModules 产物名，避免 `.vue` 或 `?vue` 痕迹在消费端被再次识别为 SFC。
 */
function sanitizeModuleName(name: string) {
  return name
    .replace(/\.vue\?vue&type=script&setup=true&lang(?:\.[a-z]+)?$/, '-script-setup')
    .replace(/\.vue\?vue&type=script&lang(?:\.[a-z]+)?$/, '-script')
    .replace(/\.vue\?vue&type=template.*$/, '-template')
    .replace(/\.vue$/, '')
    .replace(/[?&=]/g, '_');
}

function toModuleFileName(chunk: { name: string }) {
  return `es/${sanitizeModuleName(chunk.name)}.mjs`;
}

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
    vue({
      template: {
        compilerOptions: {
          hoistStatic: true
        }
      }
    }),
    /**
     * 组件自动导入插件
     * 用于在构建组件库时自动导入 Element Plus 组件
     */
    Components({
      resolvers: [ElementPlusResolver()],
      dts: false
    }) as unknown as PluginOption,
    /**
     * 打包类型声明文件
     * @see vite-plugin-dts https://github.com/qmhc/vite-plugin-dts
     */
    dts({
      include: [
        'src/**/*.ts',
        'src/**/*.vue',
        'hooks/*.ts',
        'locale/**/*.ts',
        'locale/index.ts',
        'utils/*.ts',
        'index.ts',
        'components.ts',
        'defaults.ts'
      ],
      outDirs: ['../../dist/es'],
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
    preprocessorOptions: scssPreprocessorOptions as Record<string, unknown>
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
    terserOptions: {} as Record<string, unknown>,
    /**
     * 库模式
     *
     * @see 库模式 https://cn.vitejs.dev/guide/build.html#library-mode
     */
    lib: {
      // 库模式下，必须声明入口文件
      entry: {
        index: resolve(__dirname, 'index.ts')
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
        'vue-router',
        'element-plus',
        'lodash-es',
        /^element-plus\/.*/,
        /^@element-plus\/.*/,
        /^node_modules\/.*/,
        '@constants',
        '@vueuse/shared',
        '@vueuse/core',
        /^echarts\/.*/,
        'cron-parser'
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        },
        preserveModules: true,
        preserveModulesRoot: '',
        exports: 'named',
        // 清洗 `.vue` 相关中间产物命名，避免在 Vite 8 / Rolldown 下被误判为 SFC。
        entryFileNames: toModuleFileName,
        chunkFileNames: toModuleFileName,
        assetFileNames: assetInfo => {
          const name = assetInfo.name!;
          if (name.endsWith('.css')) {
            return 'style/[name][extname]';
          }
          return '[name][extname]';
        }
      },
      onwarn(warning, warn) {
        // 忽略特定的未使用导入警告
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        warn(warning);
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
    alias: createComponentsAliases(__dirname)
  }
});
