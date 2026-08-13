import { defineConfig } from 'vitepress'

// Locale layout: both locales live in subdirectories — docs/zh/ (简体中文,
// default landing) and docs/en/ (English). The root docs/index.md redirects
// / → /zh/ so the default landing is Chinese. Chinese nav/sidebar live in the
// top-level themeConfig and are inherited by the 'zh' locale (shallow merge);
// 'en' overrides with English. (rewrites to lift zh/* to / were tried but
// path-to-regexp in vitepress 1.6.4 rejects the repeating param — see spec §11.)
export default defineConfig({
  title: 'Glory',
  description: 'Glory — Tauri v2 + React 19 桌面应用文档',
  lang: 'zh-CN',

  // Internal specs/plans live under docs/superpowers/ — keep them out of the
  // published site. (dist is already gitignored repo-wide.)
  srcExclude: ['superpowers/**'],

  themeConfig: {
    nav: [
      { text: '快速开始', link: '/zh/getting-started' },
      { text: '架构', link: '/zh/architecture' },
      { text: '贡献指南', link: '/zh/contributing' },
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/zh/getting-started' },
          { text: '架构', link: '/zh/architecture' },
          { text: '贡献指南', link: '/zh/contributing' },
        ],
      },
    ],
    outline: { label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      // inherits the top-level Chinese themeConfig
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Getting Started', link: '/en/getting-started' },
          { text: 'Architecture', link: '/en/architecture' },
          { text: 'Contributing', link: '/en/contributing' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/en/getting-started' },
              { text: 'Architecture', link: '/en/architecture' },
              { text: 'Contributing', link: '/en/contributing' },
            ],
          },
        ],
      },
    },
  },
})
