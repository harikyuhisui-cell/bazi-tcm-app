# 八字体質診断アプリ（Bazi TCM App）

四柱推命（八字）と東洋医学（中医学）を組み合わせた体質診断Webアプリ。

## 概要

生年月日時を入力すると、四柱推命の命式（年柱・月柱・日柱・時柱）を算出し、
五行バランスに基づく体質傾向と東洋医学的な養生アドバイスを提供します。

> **免責事項**: 本アプリは占術・東洋医学の考え方に基づく参考情報を提供するものであり、医療診断ではありません。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript (strict)
- **スタイリング**: Tailwind CSS
- **AI**: Claude API (Anthropic)
- **DB**: Supabase
- **チャート**: Recharts
- **テスト**: Jest + React Testing Library

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に必要な環境変数を設定
npm run dev
```

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動 (http://localhost:3000)
npm run build     # プロダクションビルド
npm test          # テスト実行
npm run lint      # ESLint
npm run format    # Prettier フォーマット
```

## プロジェクト構成

```
src/
  app/            # Next.js App Router
  components/     # UIコンポーネント
  lib/
    bazi/         # 四柱推命算出エンジン
    tcm/          # 東洋医学体質分析
    ai/           # Claude API連携
  types/          # TypeScript型定義
tests/            # テストスイート
docs/             # 仕様書
```

## 開発フェーズ

| Phase | 内容 |
|-------|------|
| Phase 0 | ✅ 初期セットアップ |
| Phase 1 | 🔄 命式算出エンジン |
| Phase 2 | 体質診断ロジック |
| Phase 3 | AI養生アドバイス生成 |
| Phase 4 | UIコンポーネント |
| Phase 5 | データ永続化 |
| Phase 6 | テスト・品質保証 |
| Phase 7 | デプロイ |
