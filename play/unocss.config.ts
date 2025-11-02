import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';



export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        // 使用 ant-design 图标集
        ad: () => import('@iconify-json/ant-design/icons.json').then(i => i.default as any),
        // 加载本地 SVG 图标
        icon: FileSystemIconLoader('./src/assets/svg/icon')
      },
      // 图标相关配置
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  content: {
    pipeline: {
      include: [`./src/**/*.{vue,js,ts,jsx,tsx}`],
      exclude: [`./node_modules/**/*`]
    }
  },
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1920px'
    },
    colors: {
      primary: {
        DEFAULT: '#2563eb',
        deep: '#1d4ed8'
      }
    }
  }
});
