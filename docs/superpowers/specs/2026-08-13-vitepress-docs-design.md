# VitePress Documentation Site — Design Spec

- Date: 2026-08-13
- Status: Approved & Implemented
- Scope: Add VitePress as the documentation tool for the Glory project, with **Chinese (default)** + **English** i18n.

## 1. Goal

Give the Glory repo a documentation site built with VitePress, served from `docs/`, with two locales: **简体中文 (default landing)** and **English**. Both locales live in subdirectories: Chinese under `docs/zh/` (served at `/zh/...`), English under `docs/en/` (served at `/en/...`). The site root `/` redirects to `/zh/` so the default landing is Chinese.

## 2. Approach

VitePress scaffolded in a nested `docs/` directory (VitePress recommendation for installs into an existing project), `vitepress` added as a root devDependency. No pnpm workspace — single-package repo, workspace is overkill.

Both locales in subdirectories. Chinese nav/sidebar live in the top-level `themeConfig` (the default locale) and are inherited by the `zh` locale via shallow merge; the `en` locale overrides with English. A root `docs/index.md` redirects `/` → `/zh/`. This gives a clean two-entry locale switcher (简体中文 / English) with working same-page locale switching (`/zh/x` ↔ `/en/x`).

VitePress ships its own Vite; it is isolated from the app's Vite 7 / port 1420. `pnpm build` (app) and `pnpm tauri build` are unaffected. VitePress dev server uses port 5173.

> Note: an initial design used `rewrites: { 'zh/:rest*': ':rest' }` to lift `docs/zh/*` to root URLs. VitePress 1.6.4's `path-to-regexp` rejects the repeating parameter (`Expected "rest" to not repeat, but got an array`), so the root-redirect approach above was adopted instead. See §11.

## 3. File structure

```
docs/
├─ .vitepress/
│  └─ config.ts
├─ index.md               # root redirect → /zh/
├─ superpowers/specs/     # design specs (excluded from build via srcExclude, see §8)
├─ zh/
│  ├─ index.md            # 中文首页  →  /zh/
│  ├─ getting-started.md  #           →  /zh/getting-started
│  ├─ architecture.md
│  └─ contributing.md
└─ en/
   ├─ index.md            # English home → /en/
   ├─ getting-started.md  #              → /en/getting-started
   ├─ architecture.md
   └─ contributing.md
```

## 4. Configuration (`docs/.vitepress/config.ts`)

- `title: "Glory"`, `description`, top-level `lang: 'zh-CN'` (so root `/` and the 404 page render Chinese).
- `srcExclude: ['superpowers/**']` — keep internal specs out of the build (§8).
- `themeConfig` (top-level, Chinese — the default): `nav` + `sidebar` with `/zh/...` links, plus Chinese chrome labels (`outline`, `docFooter`, `returnToTopLabel`, …).
- `locales`:
  - `zh` → `label: '简体中文'`, `lang: 'zh-CN'`, `link: '/zh/'`; inherits the top-level Chinese `themeConfig`.
  - `en` → `label: 'English'`, `lang: 'en'`, `link: '/en/'`, overrides `themeConfig` with English `nav` + `sidebar`.
- `docs/index.md` frontmatter `head` injects `<meta http-equiv="refresh" content="0; url=zh/">` to redirect `/` → `/zh/`.

## 5. Scripts (`package.json`)

```json
"docs:dev": "vitepress dev docs",
"docs:build": "vitepress build docs",
"docs:preview": "vitepress preview docs"
```

## 6. Initial pages (4 × 2 locales = 8 files)

- **Home** (`index.md`) — VitePress default home layout: hero (name "Glory", tagline, action button → getting-started) + features (Tauri v2, React 19, Vite 7, VitePress).
- **Getting started** — `pnpm install`, `pnpm dev` (frontend), `pnpm tauri dev` (full), `pnpm build`, `pnpm tauri build`; note fixed port 1420 / `strictPort`.
- **Architecture** — Tauri v2 frontend (`src/`, `main.tsx`, `App.tsx`) + Rust backend (`src-tauri/`, `glory_lib`, `main.rs`/`lib.rs`), build pipeline (`beforeDevCommand`/`beforeBuildCommand`), capabilities (`core:default`, `opener:default`).
- **Contributing** — folded from `AGENTS.md`: build/test/format commands, commit conventions (Conventional Commits, subject-only, own identity), PR rules, coding style.

## 7. `.gitignore` additions

```
docs/.vitepress/cache/
```

Note: `dist` is already ignored repo-wide, so `docs/.vitepress/dist/` is covered — no redundant entry.

## 8. Spec exclusion from VitePress build

`docs/superpowers/` holds design specs (this file) and future plans. VitePress builds all `.md` under `docs/`; `srcExclude: ['superpowers/**']` keeps them out. Verified: `superpowers/` does not appear in `docs/.vitepress/dist/`.

## 9. Verification (executed 2026-08-13)

- `pnpm docs:build` — succeeds; both locales produce output; root `index.html` contains the redirect meta; `zh/` + `en/` each render 4 pages; `superpowers/` absent from dist.
- `pnpm build` — passes (app regression; tsc + vite build unaffected).
- `pnpm docs:dev` (port 5173) — not separately started; the production build exercises the same config/routing, so page rendering and locale prefixes are confirmed by the build output.

## 10. Out of scope (YAGNI)

No GitHub Pages / `base` subpath, no CI deploy workflow, no Algolia/local search, no custom Vue components, no pnpm workspace. Add when a real need arrives.

## 11. Risks / resolved

- **`rewrites` lifting `zh/*` to `/`** — attempted, failed in VitePress 1.6.4 (`path-to-regexp` rejects the repeating `:rest*` param). Resolved by adopting the root-redirect approach (§4): Chinese stays at `/zh/...`, root `/` redirects to it. Build confirms correctness.
- **VitePress peer-dep warning** (`@docsearch/react` wants React <19) — harmless; VitePress is Vue-based and docsearch only loads if Algolia search is configured (it isn't). No action.
- **VitePress vs Vite 7** — `vitepress 1.6.4` bundles its own Vite; isolated from the app's Vite 7. No conflict; app `pnpm build` still passes.
