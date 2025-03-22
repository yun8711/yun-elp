import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'KD-ELP',
  description: '基于 Element Plus 的业务组件库',
  lang: 'zh-CN',
  lastUpdated: true,
  
  // 部署相关配置
  base: '/',
  
  // 主题配置
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: '组件', link: '/components/' },
      { text: '工具函数', link: '/utils/' },
      { text: 'GitHub', link: 'https://github.com/your-org/kd-elp' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/k-button' }
          ]
        }
      ],
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
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/kd-elp' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024'
    }
  }
}) 