import mdPlugin from './plugins';
import getViteConfig from './vite';
import head from './head';
import type { UserConfig } from 'vitepress';

import sidebarList from '../sidebar.json';
const firstLink = sidebarList.find((x: { items: string | any[] }) => x.items.length > 0)?.items?.[0]
  ?.link;
export const baseUrl = '/yun-elp/';

const setupConfig = configEnv => {
  const config: UserConfig = {
    title: 'YUN-ELP',
    description: '基于element-plus的业务组件库',
    lang: 'zh-CN',
    // 在html 的head 标签中显现的其他元素，这里添加了icon 图标
    head,
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
      outline: {
        level: 'deep',
        label: '内容大纲'
      },
      lastUpdatedText: '',
      siteTitle: false,
      // 显示在导航栏中网站标题
      logo: '/logo_title.png',
      // 搜索框
      search: {
        // 使用本地搜索
        provider: 'local'
      },
      // 社交链接
      socialLinks: [{ icon: 'github', link: 'https://github.com/yun-elp' }],
      nav: [
        { text: '指南', link: '/guide/overview/', activeMatch: '^/guide/' },
        { text: '组件', link: firstLink!, activeMatch: '^/components/' }
        // { text: '工具函数', link: '/utils/', activeMatch: '^/utils/' }
      ],

      sidebar: {
        '/guide/': [
          {
            text: '基础',
            items: [
              { text: '总览', link: '/guide/overview' },
              { text: '快速开始', link: '/guide/quickstart' }
            ]
          },
          {
            text: '进阶',
            items: [
              { text: '国际化', link: '/guide/i18n' },
              { text: '主题', link: '/guide/theme' }
              // { text: 'MCP', link: '/guide/mcp' }
            ]
          },
          {
            text: '开发',
            items: [{ text: '开发指南', link: '/guide/development' }]
          }
        ],
        '/components/': sidebarList
        // '/utils/': [
        //   {
        //     text: '工具函数',
        //     items: [
        //       { text: '日期工具', link: '/utils/date' },
        //       { text: '字符串工具', link: '/utils/string' },
        //       { text: '对象工具', link: '/utils/object' }
        //     ]
        //   }
        // ]
      },

      footer: {
        message: '',
        copyright: ''
      }
    },
    vite: getViteConfig(configEnv) as any,

    markdown: {
      config: md => mdPlugin(md)
    }
  };

  return config;
};

export default setupConfig;
