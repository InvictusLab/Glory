# Repository Guidelines

## Project Structure & Module Organization

This is a Tauri v2 desktop application with a Vite + React + TypeScript frontend and a Rust backend.

### Frontend

- **Stack:** React 19 + TypeScript, built with Vite.
- **Entry:** `src/main.tsx`
- **Root component:** `src/App.tsx`
- **Styles:** `src/App.css`
- **Assets:** `src/assets/` holds frontend assets; `public/` holds static files served unchanged.

### Backend

- **Crate:** Rust crate in `src-tauri/src/`.
  - `src-tauri/src/main.rs` is the binary entrypoint.
  - `src-tauri/src/lib.rs` defines Tauri commands and assembles the builder.
- **Config:** `src-tauri/tauri.conf.json`.
  - `beforeDevCommand` runs `pnpm dev`.
  - `beforeBuildCommand` runs `pnpm build`.
  - Dev server is fixed at `http://localhost:1420` (see `vite.config.ts`).
  - The library crate is named `glory_lib`; the binary calls `glory_lib::run()`.
- **Capabilities:** `src-tauri/capabilities/default.json` grants `core:default` and `opener:default`. Keep it aligned with any added plugin or API.
- **Icons:** `src-tauri/icons/` contains packaged application icons. Do not hand-edit generated icon variants.

### Package Manager

The repo uses `pnpm` for JavaScript dependencies and the Tauri CLI (no lockfile present, so run `pnpm install` first).

## Build, Test, and Development Commands

### Frontend

Install dependencies:

```bash
pnpm install
```

Start the Vite frontend only (useful for quick UI iteration):

```bash
pnpm dev
```

Build the frontend for production:

```bash
pnpm build
```

TypeScript is checked during the build (`pnpm build` runs `tsc`).

### Backend

Build the Rust crate directly:

```bash
cd src-tauri && cargo build
```

Format Rust code:

```bash
cd src-tauri && cargo fmt
```

Run Rust tests:

```bash
cd src-tauri && cargo test
```

Run a specific Rust test:

```bash
cd src-tauri && cargo test <test_name>
```

### Full-stack

Start the Tauri dev window (launches Vite and the Rust backend):

```bash
pnpm tauri dev
```

Build the full Tauri app (production frontend + Rust binary):

```bash
pnpm tauri build
```

The Vite dev server uses port `1420` with `strictPort: true`; free that port before starting development.

## Coding Style & Naming Conventions

### Frontend

- Use TypeScript with the repository's strict compiler settings.
- Components are named in PascalCase (e.g., `App.tsx`).
- Functions and variables use camelCase.
- Prefer small, typed React components.
- Keep styles beside the component they serve.
- No dedicated JavaScript formatter or linter is configured; run `pnpm build` to catch TypeScript errors before submitting changes.

### Backend

- Follow `cargo fmt` for formatting.
- Rust functions and modules use snake_case.
- Annotate frontend-callable functions with `#[tauri::command]`.
- Tauri command names use camelCase to match frontend invocation (e.g., `greet`).
- Register each new command in `generate_handler!` in `src-tauri/src/lib.rs`.

## Testing Guidelines

### Frontend

Frontend tests are not configured. For frontend changes, at minimum run `pnpm build` and manually verify the affected flow with `pnpm tauri dev`.

### Backend

Rust tests belong beside the code they cover in `src-tauri/src/`, using `#[cfg(test)]` modules and descriptive `snake_case` test names. Run `cargo test` from `src-tauri/`.

## Commit Message Guidelines

History currently uses Conventional Commit-style messages, for example `feat(glory): project initialization`. Continue with concise messages such as `fix(ui): prevent empty greeting`. Keep commits focused.

Use these conventional commit types:

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Formatting changes that do not affect functionality (e.g., whitespace, semicolons)
- **refactor** - Code refactoring
- **perf** - Performance improvements
- **test** - Adding or updating tests
- **build** - Build dependency changes
- **ci** - Changes to CI configuration files or scripts
- **chore** - Changes to the build process, or adding dependencies/tools
- **revert** - Reverting a previous change

## Pull Request Guidelines

Pull requests should explain the user-visible change, list validation commands run, link relevant issues, and include screenshots for UI changes. Call out capability or configuration changes explicitly.

## Notes

- After completing Rust changes, always run `cargo test` from `src-tauri/` to verify nothing is broken.
- When adding or modifying Tauri commands, ensure the corresponding permissions are updated in `src-tauri/capabilities/default.json`.
- Do not modify files under `src-tauri/icons/` by hand; regenerate them with the Tauri icon tooling if needed.
