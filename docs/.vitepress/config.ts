import { defineConfig } from 'vitepress';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock';
import sidebarList from './sidebar.json';
const firstLink = sidebarList.find((x: { items: string | any[] }) => x.items.length > 0)?.items?.[0]
  ?.link;
const baseUrl = '/kd-elp/';
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

export default defineConfig({
  title: 'KD-ELP',
  description: 'KD-ELP 组件文档',
  lang: 'zh-CN',
  // 在html 的head 标签中显现的其他元素，这里添加了icon 图标
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: baseUrl + 'logo.svg' }]],
  appearance: false, // 不启用深色模式
  // 使用 Git 获取每个页面的最后更新时间戳
  lastUpdated: true,
  // 干净路由，即去掉url 中的 .html 后缀
  cleanUrls: true,

  // 项目部署的相对url
  base: baseUrl,

  // 主题配置
  themeConfig: {
    // 每个页面右侧大纲标题
    outline: {
      level: 'deep',
      label: '内容大纲'
    },
    lastUpdatedText: '上次更新',
    // 显示在导航栏中网站标题
    logo: baseUrl + 'logo.svg',
    // 搜索框
    search: {
      // 使用本地搜索
      provider: 'local'
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '指南', link: '/guide/', activeMatch: '^/guide/' },
      { text: '组件', link: firstLink!, activeMatch: '^/components/' },
      { text: '工具函数', link: '/utils/', activeMatch: '^/utils/' },
      {
        text: '更新日志',
        link: 'http://gitlab.keendata.net/keentech-fe/kd-elp/-/blob/main/CHANGELOG.md'
      }
    ],

    sidebar: {
      '/guide/': [
        {
          items: [
            {
              text: '使用',
              items: [
                { text: '安装', link: '/guide/installation' },
                { text: '快速开始', link: '/guide/quickstart' }
              ]
            },
            {
              text: '开发指南',
              items: [
                { text: '设计', link: '/guide/design' },
                { text: '规范', link: '/guide/standard' },
                { text: '流程', link: '/guide/workflow' }
              ]
            },
            {
              text: '技术方案',
              items: [
                { text: '主题', link: '/guide/theme-toggle' },
                { text: '样式', link: '/guide/style' },
                { text: '图标', link: '/guide/icon' }
              ]
            }
          ]
        }
      ],
      '/components/': sidebarList,
      '/utils/': [
        {
          text: '工具函数',
          items: [
            { text: '日期工具', link: '/utils/date' },
            { text: '字符串工具', link: '/utils/string' },
            { text: '对象工具', link: '/utils/object' }
          ]
        }
      ]
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present KeenData'
    }
  },

  vite: {
    plugins: [demoblockVitePlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, '../../packages/components/src')
      }
    }
  },

  markdown: {
    config: md => {
      md.use(demoblockPlugin, {});
    }
  }
});
