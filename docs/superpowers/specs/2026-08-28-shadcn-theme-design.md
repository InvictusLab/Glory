# shadcn/ui Component Library + Theme Switching — Design

**Date:** 2026-08-28
**Status:** Approved
**Topic:** Add shadcn/ui as the frontend component library and implement light/dark/system theme switching.

## Goal

Set up shadcn/ui (Tailwind v4 + CSS-variable theming) as this Tauri v2 app's component library, and implement a FOUC-free theme switching feature (light / dark / system) that persists across restarts and live-follows the OS theme in system mode. Use best practices, following the shadcn/ui docs, adapted to this project's existing structure.

## Context

- Freshly scaffolded Tauri v2 app (React 19 + TS + Vite 7). Frontend is near-empty: `src/App.tsx` holds a single `<h1>Glory</h1>` placeholder; `src/main.tsx` imports no stylesheet; no Tailwind; no CSS file.
- Single `tsconfig.json` (not the Vite-default app/node split) referencing `tsconfig.node.json`. Strict TS.
- `vite.config.ts` is async with Tauri-specific options (`clearScreen: false`, port `2420` with `strictPort`, HMR on `2421`, watch ignoring `**/src-tauri/**`).
- `src-tauri/tauri.conf.json` has `"csp": null` — no Content-Security-Policy enforced, so inline scripts are allowed without capability/permission changes.
- Package manager: `pnpm`. No lockfile → run `pnpm install` first.

## Non-goals

- A real application UI / pages. Only the theme toggle itself — no demo content (no heading/paragraph/demo button).
- A broad starter set of shadcn components. Only `button` and `dropdown-menu` (what the theme toggle needs); others are added on demand via `pnpm dlx shadcn@latest add <name>`.
- Rust / backend changes. None.
- Custom brand color. Base color: **Neutral** (shadcn default).

## Approach

Chosen: **A — hand-rolled React Context provider + inline FOUC script + localStorage + matchMedia live-listen.** Matches the shadcn docs; zero extra dependencies; full control.

Rejected alternatives:
- **B — theming library (`next-themes`):** designed for Next.js SSR/hydration; no canonical Vite option that beats hand-rolling; adds a dependency; diverges from shadcn docs.
- **C — Tauri store plugin for persistence:** `localStorage` already persists across restarts in the Tauri webview; the FOUC inline script is synchronous JS and cannot `await` an async store, so the initial pre-paint class would still need a synchronous path — making the plugin redundant.

## Decisions

| Decision | Value | Rationale |
|---|---|---|
| Base color | Neutral | shadcn default; monochrome; easiest to customize later |
| Default theme | `system` | desktop app should follow OS preference |
| Storage key | `glory-theme` | app-namespaced, clearer than the docs' generic `vite-ui-theme` |
| Dark-mode strategy | class-based via `@custom-variant dark (&:is(.dark *))` | shadcn / Tailwind v4 convention; `.dark` on `<html>` |
| Theme options | light / dark / system | standard shadcn toggle |
| shadcn style | new-york (init default) | current shadcn default |
| Persistence | `localStorage` | platform feature; persists across restarts; no plugin needed |

## File changes

### New files

| Path | Source | Contents |
|---|---|---|
| `src/index.css` | manual + `shadcn init` | `@import "tailwindcss";`, then `:root`/`.dark` OKLCH variables, `@theme inline` mappings, `@custom-variant dark (&:is(.dark *))`, `@layer base` reset — written by `shadcn init` |
| `components.json` | `shadcn init` | shadcn config: style `new-york`, baseColor `neutral`, cssVariables `yes`, aliases `@/` |
| `src/lib/utils.ts` | `shadcn init` | `cn()` helper (clsx + tailwind-merge) |
| `src/components/ui/button.tsx` | `shadcn add button` | Button component |
| `src/components/ui/dropdown-menu.tsx` | `shadcn add dropdown-menu` | DropdownMenu component |
| `src/components/theme-provider.tsx` | manual | `ThemeProvider` + `useTheme` |
| `src/components/mode-toggle.tsx` | manual | `ModeToggle` |

### Modified files

| Path | Change |
|---|---|
| `tsconfig.json` | add `"baseUrl": "."` and `"paths": {"@/*": ["./src/*"]}` under `compilerOptions` |
| `vite.config.ts` | import `@tailwindcss/vite` and `node:path`; add `tailwindcss()` to `plugins`; add `resolve: { alias: { "@": path.resolve(__dirname, "./src") } }`; keep all Tauri-specific config; the `@ts-expect-error` on `process` becomes unnecessary once `@types/node` is installed |
| `index.html` | add inline FOUC script in `<head>` before the `main.tsx` script tag |
| `src/main.tsx` | `import "./index.css"`; wrap `<App/>` in `<ThemeProvider storageKey="glory-theme" defaultTheme="system">` |
| `src/App.tsx` | replace the `<h1>Glory</h1>` placeholder with a toggle-only minimal shell (just `ModeToggle`, top-right; no demo content) |

### Dependencies added

- Runtime: `tailwindcss`, `@tailwindcss/vite`; plus (via `shadcn add`): `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/react-dropdown-menu` (and any transitive Radix deps the components pull in).
- Dev: `@types/node`.

## Detailed design

### 1. shadcn + Tailwind setup (adapted to this project)

1. `pnpm add tailwindcss @tailwindcss/vite && pnpm add -D @types/node`
2. Edit `tsconfig.json` — under `compilerOptions`, add `"baseUrl": "."` and `"paths": {"@/*": ["./src/*"]}`. (Single-config project; no `tsconfig.app.json` to also touch.)
3. Edit `vite.config.ts` — `import tailwindcss from "@tailwindcss/vite"`, `import path from "node:path"`; in the async config, add `tailwindcss()` to `plugins` and `resolve: { alias: { "@": path.resolve(__dirname, "./src") } }`. Preserve `clearScreen: false`, `server.port` 2420 / `strictPort`, `hmr`, and `server.watch.ignored`. The `// @ts-expect-error process is a nodejs global` line may be removed once `@types/node` types `process`.
4. Create `src/index.css` with `@import "tailwindcss";`.
5. `pnpm dlx shadcn@latest init` — base color **Neutral**, CSS variables enabled, default style (new-york). Generates `components.json`, `src/lib/utils.ts`, and rewrites `src/index.css` with the full token set (`:root` light, `.dark` dark, `@theme inline` mappings, `@custom-variant dark (&:is(.dark *))`, `@layer base` with `* { @apply border-border outline-ring/50; }` and `body { @apply bg-background text-foreground; }`).
6. `pnpm dlx shadcn@latest add button dropdown-menu` — drops `src/components/ui/button.tsx` and `src/components/ui/dropdown-menu.tsx` and their Radix deps.

### 2. ThemeProvider (`src/components/theme-provider.tsx`)

Based on the shadcn "dark-mode/vite" docs provider, with two improvements:

- **Initial state:** `useState(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme)`.
- **Apply effect (`useEffect` on `[theme]`):** resolve effective theme — if `theme === "system"`, query `window.matchMedia("(prefers-color-scheme: dark)")`. Remove `"light"` and `"dark"` from `document.documentElement.classList`, then add the resolved class.
- **Improvement 1 — live system follow:** when `theme === "system"`, subscribe to `matchMedia("(prefers-color-scheme: dark)")` `change` events and re-apply on OS theme change; clean up the listener when theme leaves `system` or on unmount. (Docs version resolves once at mount/theme-change only.)
- **`setTheme`:** `localStorage.setItem(storageKey, theme)` then `setTheme(theme)`.
- **Exports:** `ThemeProvider` (props: `children`, `defaultTheme = "system"`, `storageKey = "glory-theme"`) and `useTheme` (throws outside the provider).

### 3. FOUC inline script (`index.html` `<head>`)

Placed before `<script type="module" src="/src/main.tsx"></script>`:

- Synchronously read `localStorage.getItem("glory-theme")`. If absent, resolve via `window.matchMedia("(prefers-color-scheme: dark)")`. Add `.light` or `.dark` to `document.documentElement` before first paint.
- Duplicates ~5 lines of system-resolution logic from the provider — intentional and unavoidable (the provider handles subsequent toggles + persistence + live-listen; the script only sets the initial pre-paint class to avoid a flash). Same pattern as `next-themes`'s injected script.
- CSP: `tauri.conf.json` `"csp": null` permits inline scripts; no capability/permission change needed.

### 4. ModeToggle (`src/components/mode-toggle.tsx`)

Per shadcn docs: a `DropdownMenu` with an outline `Button` (size icon) trigger; `Sun`/`Moon` icons from `lucide-react` with `dark:` scale/rotate transitions and an `sr-only` label; three `DropdownMenuItem`s — Light / Dark / System — each calling `setTheme(...)`. Placed top-right of the app shell.

### 5. App integration

- `src/main.tsx`: add `import "./index.css"`; wrap `<App/>` with `<ThemeProvider storageKey="glory-theme" defaultTheme="system">`.
- `src/App.tsx`: replace the placeholder with a toggle-only minimal shell — just the `ModeToggle` (top-right in a full-height padded container), no demo content (no heading/paragraph/demo button). Background/text come from the `body` base layer (`bg-background text-foreground`). ~12 lines. Foundation scaffolding, not a real page.

### 6. Verification

No frontend test framework (per `AGENTS.md`). Verify via:

- `pnpm build` — runs `tsc` + `vite build`; must pass with no TS errors.
- `pnpm tauri dev` — manual: toggle changes theme instantly; choice persists across restart; "system" follows live OS theme changes.
- FOUC: set dark, quit, reopen — should open in dark with no light flash.
- No Rust changes → `cargo test` not required. No new Tauri commands/plugins → `src-tauri/capabilities/default.json` unchanged.

## References

- shadcn/ui Vite install: https://ui.shadcn.com/docs/installation/vite
- shadcn/ui theming: https://ui.shadcn.com/docs/theming
- shadcn/ui dark mode (Vite): https://ui.shadcn.com/docs/dark-mode/vite
