# 贡献指南

欢迎为 Glory 做出贡献。以下约定摘自 `AGENTS.md`，请遵循。

## 构建与测试

前端：

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动 Vite 前端
pnpm build        # 构建前端（同时进行 TypeScript 检查）
```

Rust 后端（在 `src-tauri/` 下执行）：

```bash
cargo build       # 编译
cargo fmt         # 格式化
cargo test        # 运行测试
cargo test <名称>  # 运行单个测试
```

全栈：

```bash
pnpm tauri dev    # Tauri 开发窗口
pnpm tauri build  # 构建完整应用
```

> 完成 Rust 改动后，务必在 `src-tauri/` 下运行 `cargo test` 验证。

## 代码风格

### 前端

- TypeScript（仓库的严格编译选项）
- 组件 PascalCase（如 `App.tsx`）
- 函数与变量 camelCase
- 样式就近放置
- 提交前运行 `pnpm build` 以捕获类型错误

### 后端

- 遵循 `cargo fmt`
- 函数与模块 snake_case
- 前端可调用函数用 `#[tauri::command]` 标注
- 命令名 camelCase
- 在 `src-tauri/src/lib.rs` 的 `generate_handler!` 中注册新命令

## 提交规范

使用 Conventional Commit 风格，例如 `feat(glory): add ...`。

- 提交信息仅含主题行，不含正文
- 仅在贡献者本人的身份下提交；若 `user.name` / `user.email` 尚未配置，请先设置：

```bash
git config user.name "your name"
git config user.email "your email"
```

类型：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`

## Pull Request

- 说明用户可见的改动
- 列出执行的验证命令
- 关联相关 issue
- UI 改动附截图
- 显式说明能力或配置改动
