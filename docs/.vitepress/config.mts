import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'docs.of.paste.then.ac',
  lang: 'zh-CN',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '使用手册', link: '/usage' },
      { text: 'API', link: '/api' },
    ],

    sidebar: {
      '/usage/': [
        {
          text: '使用手册',
          items: [
            { text: '快速上手', link: '/usage/' },
            { text: '常见问题', link: '/usage/faq' },
            { text: '限制与约定', link: '/usage/limits' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API',
          items: [
            { text: '概述', link: '/api/' },
            { text: 'Piece API', link: '/api/piece' },
            { text: 'Statistics API', link: '/api/statistics' },
            { text: 'Misc API', link: '/api/misc' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/thenAC/paste' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 bLue',
    },

    externalLinkIcon: true,

    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到明亮主题',
    darkModeSwitchTitle: '切换到暗黑主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    outlineTitle: '目录',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
  },
});
