import { defineConfig } from 'vitepress'

// Locale layout: English is the default (root) locale; Chinese (简体中文) is
// secondary at /zh/. English files live in docs/en/ but the 'en/' prefix is
// stripped from URLs via rewrites, so English is served at root paths (/).
// docs/en/index.md rewrites to '/' directly — no root redirect page.
// Top-level themeConfig is English (inherited by the root locale); 'zh'
// overrides with Chinese nav/sidebar/labels.
export default defineConfig({
  title: 'Glory',
  description: 'Glory — Tauri v2 + React 19 desktop app documentation',
  lang: 'en',

  // Local dev: base '/' (env unset). CI sets DOCS_BASE='/Glory/' so the site
  // resolves under https://invictuslab.github.io/Glory/. VitePress auto-prefixes
  // internal nav/sidebar links with base; rewrites map source paths pre-base.
  base: process.env.DOCS_BASE || '/',

  // Internal specs/plans live under docs/superpowers/ — keep them out of the
  // published site. (dist is already gitignored repo-wide.)
  srcExclude: ['superpowers/**'],

  // Strip the 'en/' prefix so English (the default locale) is served at root
  // URLs (docs/en/getting-started.md → /getting-started). Both source AND
  // target use the repeating ':rest*' param — a non-repeating ':rest' target
  // errors with "Expected rest to not repeat, but got an array" in vitepress
  // 1.6.4's path-to-regexp. Chinese stays at /zh/.
  rewrites: {
    'en/:rest*': ':rest*',
  },

  themeConfig: {
    // English (default) — links are root URLs ('en/' stripped by rewrites).
    nav: [
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Contributing', link: '/contributing' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],
  },

  locales: {
    // Default locale: English, served at root URLs.
    root: {
      label: 'English',
      lang: 'en',
      // inherits the top-level English themeConfig
    },
    // Secondary locale: 简体中文, served under /zh/.
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
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
    },
  },
})
