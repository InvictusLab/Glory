# Contributing

Contributions to Glory are welcome. The conventions below are summarized from `AGENTS.md`.

## Build & Test

Frontend:

```bash
pnpm install      # install dependencies
pnpm dev          # start the Vite frontend
pnpm build        # build the frontend (also runs TypeScript checks)
```

Rust backend (run from `src-tauri/`):

```bash
cargo build       # compile
cargo fmt         # format
cargo test        # run tests
cargo test <name>  # run a single test
```

Full-stack:

```bash
pnpm tauri dev    # Tauri dev window
pnpm tauri build  # build the full app
```

> After Rust changes, always run `cargo test` from `src-tauri/` to verify.

## Coding Style

### Frontend

- TypeScript with the repo's strict compiler settings
- Components in PascalCase (e.g. `App.tsx`)
- Functions and variables in camelCase
- Keep styles beside the component they serve
- Run `pnpm build` to catch TypeScript errors before submitting

### Backend

- Follow `cargo fmt`
- Rust functions and modules use snake_case
- Annotate frontend-callable functions with `#[tauri::command]`
- Command names use camelCase
- Register each new command in `generate_handler!` in `src-tauri/src/lib.rs`

## Commit Conventions

Use Conventional Commit-style messages, e.g. `feat(glory): add ...`.

- Commit messages must contain a subject line only — no body
- Commit only under your own identity. If `user.name` / `user.email` is not yet set, configure it first:

```bash
git config user.name "your name"
git config user.email "your email"
```

Types: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

## Pull Requests

- Explain the user-visible change
- List validation commands run
- Link relevant issues
- Include screenshots for UI changes
- Call out capability or configuration changes explicitly
