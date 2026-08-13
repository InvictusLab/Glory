# Getting Started

This guide helps you run the Glory project locally.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) (package manager)
- [Rust](https://www.rust-lang.org/) toolchain (to compile the Tauri backend)
- System dependencies: see the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

## Install Dependencies

```bash
pnpm install
```

## Development

Start the Vite frontend only (for fast UI iteration):

```bash
pnpm dev
```

Start the Tauri dev window (frontend + Rust backend):

```bash
pnpm tauri dev
```

> The Vite dev server uses a fixed port `1420` with `strictPort: true`. Free that port before starting.

## Build

Build the frontend for production (also runs TypeScript checks):

```bash
pnpm build
```

Build the full Tauri app (production frontend + Rust binary):

```bash
pnpm tauri build
```

## Docs Site

Preview this documentation site locally:

```bash
pnpm docs:dev      # start the docs dev server (port 5173)
pnpm docs:build     # build the docs for production
pnpm docs:preview   # preview the built site
```
