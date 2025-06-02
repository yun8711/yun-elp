import { baseUrl } from './index';
import type { HeadConfig } from 'vitepress';

export default [
  //
  ['link', { rel: 'icon', type: 'image/svg+xml', href: baseUrl + 'logo.svg' }],
  ['meta', { name: 'og:description', content: '基于element-plus 的业务组件库' }],
  // 添加谷歌字体
  [
    'script',
    {
      async: 'true'
    },
    `
  var resource = document.createElement('link');
  resource.setAttribute("rel", "stylesheet");
  resource.setAttribute("href","https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,800|Open+Sans:400,600;display=swap");
  resource.setAttribute("type","text/css");
  var head = document.querySelector('head');
  head.appendChild(resource);
    `
  ]
] as HeadConfig[];
