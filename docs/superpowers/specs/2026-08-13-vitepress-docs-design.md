# VitePress Documentation Site — Design Spec

- Date: 2026-08-13 (updated 2026-08-14)
- Status: Approved & Implemented
- Scope: VitePress docs for the Glory project, **English (default) + 简体中文** i18n, deployed to GitHub Pages.

## 1. Goal

A VitePress docs site served from `docs/`, with **English as the default (root) locale** and **简体中文** as secondary. English files live in `docs/en/` but the `en/` prefix is stripped from URLs via `rewrites`, so English is served at root paths (`/`, `/getting-started`, …). Chinese lives in `docs/zh/` at `/zh/…`. The site deploys to GitHub Pages at `https://invictuslab.github.io/Glory/`.

## 2. Approach

VitePress scaffolded in `docs/`, `vitepress` as a root devDependency. No pnpm workspace.

English is the default locale. `rewrites: { 'en/:rest*': ':rest*' }` strips `en/` so English pages resolve at root URLs; Chinese stays at `/zh/`. The root locale is English (top-level `themeConfig`); `zh` overrides with Chinese nav/sidebar/labels. No root redirect page — `docs/en/index.md` rewrites to `/` directly.

VitePress ships its own Vite; isolated from the app's Vite 7 / port 1420. `pnpm build` (app) and `pnpm tauri build` unaffected. VitePress dev server uses port 5173.

> History: an earlier design used `'zh/:rest*': ':rest'` to lift Chinese to root — failed in vitepress 1.6.4 (`path-to-regexp`: `Expected "rest" to not repeat, but got an array`, because the `:rest` target is non-repeating but the source captures an array). The fix is a repeating `:rest*` **target** (`'en/:rest*': ':rest*'`), which accepts the array. Confirmed by build (§9).

## 3. File structure

```
docs/
├─ .vitepress/
│  └─ config.ts
├─ en/                          # English (default) — stripped to root URLs
│  ├─ index.md            → /
│  ├─ getting-started.md  → /getting-started
│  ├─ architecture.md
│  └─ contributing.md
├─ zh/                          # 简体中文 — at /zh/…
│  ├─ index.md            → /zh/
│  ├─ getting-started.md  → /zh/getting-started
│  ├─ architecture.md
│  └─ contributing.md
└─ superpowers/specs/     # design specs (excluded from build via srcExclude, §8)
```

## 4. Configuration (`docs/.vitepress/config.ts`)

- `title: "Glory"`, `description`, top-level `lang: 'en'` (root + 404 render English).
- `base: process.env.DOCS_BASE || '/'` — local dev `/`; CI `/Glory/` (§10).
- `srcExclude: ['superpowers/**']` (§8).
- `rewrites: { 'en/:rest*': ':rest*' }` — strip `en/` (default locale at root). Both params repeating.
- `themeConfig` (top-level, English): `nav` + `sidebar` with root `/...` links.
- `locales`:
  - `root` → `label: 'English'`, `lang: 'en'`; inherits top-level English `themeConfig`.
  - `zh` → `label: '简体中文'`, `lang: 'zh-CN'`, `link: '/zh/'`, overrides `themeConfig` with Chinese `nav` + `sidebar` + chrome labels.

## 5. Scripts (`package.json`)

```json
"docs:dev": "vitepress dev docs",
"docs:build": "vitepress build docs",
"docs:preview": "vitepress preview docs"
```

## 6. Initial pages (4 × 2 locales = 8 files)

- **Home** — VitePress home layout: hero + features (Tauri v2, React 19, Vite 7, VitePress).
- **Getting started** — install/dev/build commands; note port 1420 / `strictPort`.
- **Architecture** — Tauri v2 frontend + Rust backend, build pipeline, capabilities.
- **Contributing** — folded from `AGENTS.md`: build/test/format, commit conventions, PR rules, coding style.

## 7. `.gitignore` additions

```
docs/.vitepress/cache/
```

(`dist` is already ignored repo-wide.)

## 8. Spec exclusion from VitePress build

`srcExclude: ['superpowers/**']` keeps `docs/superpowers/` out of the site. Verified absent from dist.

## 9. Verification

- `pnpm docs:build` — succeeds; routes confirm English at root (`/`, `/getting-started`, `/architecture`, `/contributing`), Chinese at `/zh/…`, **no `/en/` directory**, `superpowers/` absent.
- `pnpm build` — app regression passes.
- Base prefixing under `DOCS_BASE='/Glory/'` — VitePress auto-prefixes internal links with `base` (docs-confirmed in an earlier adversarial-review workflow); rewrites are pre-base. Not separately re-run after the locale switch; mechanism unchanged.
- `pnpm docs:dev` (port 5173) — not separately started; build output confirms routing.

## 10. GitHub Pages deploy

`base` is env-driven (`process.env.DOCS_BASE || '/'`; CI sets `/Glory/`). `.github/workflows/deploy-docs.yml` builds + deploys on push to `main` (+ `workflow_dispatch`). Verified via VitePress docs that internal links are auto-prefixed with `base` and the locale structure is sound; adversarial review of the workflow/config returned no blockers. One-time manual step: repo Settings → Pages → Source = "GitHub Actions". Live URL: `https://invictuslab.github.io/Glory/` (English at `/Glory/`, Chinese at `/Glory/zh/`).

## 11. Risks / resolved

- **`rewrites` stripping a locale prefix** — the initial `'zh/:rest*': ':rest'` (non-repeating target) failed in vitepress 1.6.4. Resolved with a repeating target: `'en/:rest*': ':rest*'` accepts the array param. Build confirms (English at root, no `/en/`).
- **`en/index.md` → `/`** — the index edge case resolves correctly (build produces `dist/index.html`).
- **VitePress peer-dep warning** (`@docsearch/react` wants React <19) — harmless; docsearch only loads with Algolia search configured (not used).
- **VitePress vs Vite 7** — `vitepress 1.6.4` bundles its own Vite; isolated. App `pnpm build` still passes.
