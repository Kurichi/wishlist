# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ほしい物リスト管理 Web アプリ。Cloudflare Workers (単一 Worker) + D1 + MCP サーバー。

## 技術スタック

- **言語:** TypeScript
- **パッケージマネージャ:** pnpm (workspace monorepo)
- **API:** Hono on Cloudflare Workers
- **MCP:** @modelcontextprotocol/sdk (Streamable HTTP Transport)
- **DB:** Cloudflare D1 (SQLite) + Drizzle ORM
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + shadcn/ui
- **IaC:** Terraform (Cloudflare Provider)

## モノレポ構成

- `apps/worker` - 統合 Worker (API + MCP + Static Assets)
- `apps/web` - フロントエンド SPA (ビルドのみ、Worker が配信)
- `packages/core` - 共有ライブラリ (Drizzle スキーマ, 型, バリデーション, リポジトリ)

## コマンド

### 開発

pnpm dev:worker   # Worker ローカル起動 (API + MCP)
pnpm dev:web      # フロントエンド dev サーバー (Vite、/api は Worker にプロキシ)

### ビルド・デプロイ

pnpm build              # 全パッケージビルド (core → web → worker)
pnpm run deploy         # Worker デプロイ (wishlist.kurichi.dev)

### CI/CD

Cloudflare Workers Builds (Git 連携) を使用。main ブランチへの push で自動デプロイ。
Dashboard 側の設定:
- Build command: `pnpm install --frozen-lockfile && pnpm typecheck && pnpm build:core && pnpm build:web && pnpm build:worker`
- Deploy command: `cd apps/worker && pnpm db:migrate:remote && pnpm run deploy`

### データベース

pnpm db:generate        # Drizzle スキーマから SQL マイグレーション生成
pnpm db:migrate:local   # ローカル D1 マイグレーション
pnpm db:migrate:remote  # リモート D1 マイグレーション

## アーキテクチャ

### URL 構成

```
wishlist.kurichi.dev (単一 Worker)
├── /api/*    → Hono REST API
├── /mcp      → MCP Streamable HTTP
├── /health   → ヘルスチェック
└── /*        → Static Assets (React SPA)
```

### データフロー

```
Frontend (React) ─┐
                   ├→ Worker (wishlist.kurichi.dev) → D1
Claude (MCP)    ──┘
```

単一 Worker が REST API (/api/*)、MCP (/mcp)、静的アセット配信を担当。

### DB スキーマ管理

Drizzle ORM でスキーマ駆動開発:
1. `packages/core/src/db/schema.ts` でテーブル定義
2. `drizzle-kit generate` で SQL マイグレーション自動生成
3. `wrangler d1 migrations apply` で D1 に適用

### DB 値規約

DB/API では英語値を使用し、フロントエンドで日本語ラベルに変換する:
- timeframe: short-term / medium-term / long-term → 短期 / 中期 / 長期
- category: gadgets / experiences / skills / lifestyle / other → ガジェット / 体験 / スキル / 生活 / その他
- priority: high / medium / low → 高 / 中 / 低
- status: unstarted / considering / purchased → 未着手 / 検討中 / 購入済
