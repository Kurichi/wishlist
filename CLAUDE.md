# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

ほしい物リスト管理 Web アプリ。Cloudflare フルスタック (Workers + Pages + D1) + MCP サーバー。

## 技術スタック

- **言語:** TypeScript
- **パッケージマネージャ:** pnpm (workspace monorepo)
- **API:** Hono on Cloudflare Workers
- **MCP:** workers-mcp SDK on Cloudflare Workers
- **DB:** Cloudflare D1 (SQLite) + Drizzle ORM
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + shadcn/ui
- **IaC:** Terraform (Cloudflare Provider)

## モノレポ構成

- `apps/api` - REST API Worker (Hono)
- `apps/mcp` - MCP サーバー Worker
- `apps/web` - フロントエンド SPA
- `packages/core` - 共有ライブラリ (Drizzle スキーマ, 型, バリデーション, リポジトリ)

## コマンド

### 開発

pnpm dev:api    # API Worker ローカル起動 (wrangler dev)
pnpm dev:web    # フロントエンド dev サーバー (vite)
pnpm dev:mcp    # MCP Worker ローカル起動

### ビルド・デプロイ

pnpm build              # 全パッケージビルド
pnpm deploy:api         # API Worker デプロイ
pnpm deploy:mcp         # MCP Worker デプロイ
pnpm deploy:web         # Pages デプロイ

### データベース

pnpm db:generate        # Drizzle スキーマから SQL マイグレーション生成
pnpm db:migrate:local   # ローカル D1 マイグレーション
pnpm db:migrate:remote  # リモート D1 マイグレーション

## アーキテクチャ

### データフロー

Frontend (React) → REST API (Hono Worker) → D1
Claude (MCP)     → MCP Server (Worker)     → D1

両 Worker は同一の D1 データベースにバインドし、`@wishlist/core` の WishlistRepository (Drizzle ベース) を共有する。

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
