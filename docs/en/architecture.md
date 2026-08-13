# Architecture

Glory is a Tauri v2 desktop app composed of a Vite + React 19 + TypeScript frontend and a Rust backend.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19 + TypeScript, built with Vite |
| Shell / backend | Tauri v2 (Rust) |
| Package manager | pnpm |
| Docs | VitePress |

## Frontend

- Entry: `src/main.tsx`
- Root component: `src/App.tsx`
- Styles: `src/App.css`
- Assets: `src/assets/` (frontend assets), `public/` (static files served unchanged)

## Backend (Rust)

- Binary entry: `src-tauri/src/main.rs`, calls `glory_lib::run()`
- Library crate `glory_lib` defined in `src-tauri/src/lib.rs`: declares Tauri commands and assembles the builder
- Config: `src-tauri/tauri.conf.json`
  - `beforeDevCommand` runs `pnpm dev`
  - `beforeBuildCommand` runs `pnpm build`
  - Dev server fixed at `http://localhost:1420` (see `vite.config.ts`)
- Capabilities: `src-tauri/capabilities/default.json` grants `core:default` and `opener:default`
- Icons: `src-tauri/icons/` (generated — do not hand-edit)

## Build Pipeline

```
pnpm tauri dev / build
        │
        ├─ beforeDevCommand / beforeBuildCommand → pnpm dev / pnpm build (Vite frontend)
        └─ Cargo compiles the Rust backend (glory_lib → binary)
```

## Registering Commands

To add a frontend-callable command:

1. Annotate the function with `#[tauri::command]` in `src-tauri/src/lib.rs` (camelCase name)
2. Register it in `generate_handler!`
3. Update permissions in `src-tauri/capabilities/default.json`
