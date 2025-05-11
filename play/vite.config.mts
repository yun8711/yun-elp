import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import type { UserConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
        // additionalData: `@use "~/styles/element/index.scss" as *;`,
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@yun-elp/components': resolve(__dirname, '../packages/components/src'),
      '@yun-elp/components/locale': resolve(__dirname, '../packages/components/src/locale'),
      '@yun-elp/components/hooks': resolve(__dirname, '../packages/components/src/hooks'),
      '~': resolve(__dirname, '../packages/components/src')
      // '@kd-elp/utils': resolve(__dirname, '../packages/utils/src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['vue', 'element-plus']
  }
} as UserConfig);
