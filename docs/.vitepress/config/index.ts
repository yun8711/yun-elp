// import { fileURLToPath } from 'url';
import mdPlugin from './plugins';
import getViteConfig from './vite';
import type { UserConfig } from 'vitepress';

import sidebarList from '../sidebar.json';
const firstLink = sidebarList.find((x: { items: string | any[] }) => x.items.length > 0)?.items?.[0]
  ?.link;
const baseUrl = '/';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = resolve(__filename, '..');

const setupConfig = configEnv => {
  const config: UserConfig = {
    title: 'KD-ELP',
    description: 'KD-ELP 组件文档',
    lang: 'zh-CN',
    // 在html 的head 标签中显现的其他元素，这里添加了icon 图标
    head: [['link', { rel: 'icon', type: 'image/svg+xml', href: baseUrl + 'logo.svg' }]],
    appearance: false, // 不启用深色模式
    // 使用 Git 获取每个页面的最后更新时间戳
    lastUpdated: false,
    // 干净路由，即去掉url 中的 .html 后缀
    cleanUrls: true,

    // 项目部署的相对url
    base: baseUrl,

    outDir: 'dist',
    srcDir: '.',

    // 主题配置
    themeConfig: {
      // 每个页面右侧大纲标题
      outline: false,
      lastUpdatedText: '',
      // 显示在导航栏中网站标题
      logo: baseUrl + 'logo.svg',
      // 搜索框
      search: {
        // 使用本地搜索
        provider: 'local'
      },
      nav: [
        { text: '主页', link: '/', activeMatch: '^/$' },
        { text: '指南', link: '/guide/', activeMatch: '^/guide/' },
        { text: '组件', link: firstLink!, activeMatch: '^/examples/' },
        { text: '工具函数', link: '/utils/', activeMatch: '^/utils/' }
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
              }
            ]
          }
        ],
        '/examples/': sidebarList,
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

      socialLinks: [],

      footer: {
        message: '',
        copyright: ''
      }
    },
    vite: getViteConfig(configEnv) as any,

    // vite: {
    //   resolve: {
    //     alias: {
    //       '@': resolve(__dirname, '../../packages/components/src')
    //     }
    //   }
    // },

    markdown: {
      config: md => mdPlugin(md)
    }
  };

  return config;
};

export default setupConfig;
