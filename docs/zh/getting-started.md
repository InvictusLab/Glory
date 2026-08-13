# 快速开始

本指南帮助你在本地运行 Glory 项目。

## 前置要求

- [Node.js](https://nodejs.org/)（建议 LTS）
- [pnpm](https://pnpm.io/)（包管理器）
- [Rust](https://www.rust-lang.org/) 工具链（用于编译 Tauri 后端）
- 系统依赖：参见 [Tauri 前置条件](https://v2.tauri.app/start/prerequisites/)

## 安装依赖

```bash
pnpm install
```

## 开发

仅启动 Vite 前端（用于快速 UI 迭代）：

```bash
pnpm dev
```

启动 Tauri 开发窗口（前端 + Rust 后端）：

```bash
pnpm tauri dev
```

> Vite 开发服务器固定使用端口 `1420`（`strictPort: true`）。启动前请确保该端口未被占用。

## 构建

构建前端生产包（同时进行 TypeScript 检查）：

```bash
pnpm build
```

构建完整 Tauri 应用（前端生产包 + Rust 二进制）：

```bash
pnpm tauri build
```

## 文档站点

本地预览本文档站点：

```bash
pnpm docs:dev      # 启动文档开发服务器（端口 5173）
pnpm docs:build    # 构建文档生产包
pnpm docs:preview  # 预览构建产物
```
