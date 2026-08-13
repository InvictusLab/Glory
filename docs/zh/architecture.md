# 架构

Glory 是一个 Tauri v2 桌面应用，由 Vite + React 19 + TypeScript 前端与 Rust 后端组成。

## 技术栈

| 层 | 技术 |
| --- | --- |
| 前端 | React 19 + TypeScript，Vite 构建 |
| 桌面壳 / 后端 | Tauri v2（Rust） |
| 包管理 | pnpm |
| 文档 | VitePress |

## 前端

- 入口：`src/main.tsx`
- 根组件：`src/App.tsx`
- 样式：`src/App.css`
- 静态资源：`src/assets/`（前端资源）、`public/`（原样提供的静态文件）

## 后端（Rust）

- 二进制入口：`src-tauri/src/main.rs`，调用 `glory_lib::run()`
- 库 crate `glory_lib` 定义于 `src-tauri/src/lib.rs`：声明 Tauri 命令并组装 builder
- 配置：`src-tauri/tauri.conf.json`
  - `beforeDevCommand` 运行 `pnpm dev`
  - `beforeBuildCommand` 运行 `pnpm build`
  - 开发服务器固定为 `http://localhost:1420`（见 `vite.config.ts`）
- 能力（Capabilities）：`src-tauri/capabilities/default.json` 授予 `core:default` 与 `opener:default`
- 图标：`src-tauri/icons/`（由工具生成，请勿手改）

## 构建流水线

```
pnpm tauri dev / build
        │
        ├─ beforeDevCommand / beforeBuildCommand → pnpm dev / pnpm build（Vite 前端）
        └─ Cargo 编译 Rust 后端（glory_lib → 二进制）
```

## 注册新命令

新增前端可调用命令：

1. 在 `src-tauri/src/lib.rs` 用 `#[tauri::command]` 标注函数（命名 camelCase）
2. 在 `generate_handler!` 中注册
3. 在 `src-tauri/capabilities/default.json` 同步权限
