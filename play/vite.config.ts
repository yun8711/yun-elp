import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import ElementPlus from 'unplugin-element-plus/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { YunElpResolver } from '../packages/resolver/index.ts';
import { createYunElpAliases, scssPreprocessorOptions } from '../scripts/vite-shared';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    vueJsx(),
    vue(),
    ElementPlus({
      useSource: true
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        })
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass'
        }),
        YunElpResolver({
          importStyle: 'scss',
          importElementStyle: 'sass'
        })
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      ...scssPreprocessorOptions,
      scss: {
        ...scssPreprocessorOptions.scss,
        additionalData: `
@use "element-plus/theme-chalk/src/mixins/config.scss" as element-config with ($namespace: "ep");
@use "yun-elp/theme-chalk/src/mixins/config.scss" as yun-config with ($namespace: "yp");
`
      }
    } as unknown as { scss: Record<string, unknown> }
  },
  resolve: {
    alias: createYunElpAliases({ projectRoot: __dirname })
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['vue', 'element-plus']
  }
});
