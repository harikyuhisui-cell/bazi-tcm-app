# 体質バランスチェック（bazi-tcm-app）

四柱推命（八字）と東洋医学（中医学）を組み合わせた**体質診断Webアプリ**です。
生年月日・出生時刻から命式を算出し、五行バランスに基づく体質傾向と養生のヒントを提供します。

> **監修**: 鍼灸師（東洋医学の用語・概念の正確性を担保）
> **重要**: 本アプリは占術・東洋医学の考え方に基づく**参考情報**であり、医療診断ではありません。表現は常に「傾向」「参考」に留め、断定的・医療的な表現を避けてください（詳細は「6. 開発で注意すべき点」）。

---

## 1. アプリの概要と目的

- **入力**: おなまえ（任意）、生年月日、出生時刻（不明可）、性別、気になる不調（任意）、家族の体質傾向（任意）
- **処理の流れ**:
  1. 生年月日時 → **命式（四柱）算出**（年・月・日・時の干支、蔵干）
  2. 命式 → **五行バランス分析**（五行スコア、身強/身弱、喜神/忌神）
  3. 五行＋自覚症状＋家族歴 → **体質タイプの傾向**（中医学9体質の考え方に準拠した8タイプ、最大4件）
- **出力**: 命式カード、五行レーダー＋スコア詳細、五臓体質プロフィール、相生・相剋図、性格傾向、体質タイプ（養生アドバイス）

現時点ではすべてクライアントサイドの純粋な算出ロジックで完結します（外部APIやDBへの依存なし）。

---

## 2. 技術スタック

| レイヤー | 技術 |
|---|---|
| フレームワーク | Next.js 14（App Router）+ React 18 |
| 言語 | TypeScript（strict、`any` 禁止） |
| スタイル | Tailwind CSS |
| チャート | Recharts（五行レーダー）/ 自作SVG（相生相剋図・五臓リング） |
| 干支・節気計算 | lunar-javascript |
| バリデーション | Zod（※入力検証は今後のAPI実装で本格利用予定） |
| テスト | Jest + React Testing Library |
| 整形・静的解析 | ESLint（eslint-config-next）+ Prettier（prettier-plugin-tailwindcss） |
| 将来利用予定（未配線） | `@anthropic-ai/sdk`（Claude API）, `@supabase/supabase-js`（永続化） |

- **Node.js**: 18 以上を推奨。
- `lunar-javascript` は型定義を同梱しないため、使用APIのみ `src/types/lunar-javascript.d.ts` で宣言しています。

---

## 3. フォルダ構成

```
bazi-tcm-app/
├── CLAUDE.md                 # 開発指示書（規約・制約・用語）。実装前に必読
├── DECISIONS.md              # 設計判断の記録
├── docs/
│   └── constitution-content-review.md  # 鍼灸師レビュー用の体質知識まとめ
├── scripts/                  # CLI動作確認（npx tsx で実行）
│   ├── demo-bazi.ts          # 命式算出デモ
│   ├── demo-wuxing.ts        # 五行分析デモ
│   └── demo-diagnosis.ts     # 命式→五行→体質まで通しデモ
├── src/
│   ├── app/                  # Next.js App Router（page.tsx, layout.tsx, globals.css）
│   ├── components/           # Reactコンポーネント（UI）
│   ├── data/
│   │   └── constitutions/    # 8体質タイプの知識ベース（鍼灸師監修対象）
│   ├── lib/                  # ビジネスロジック（UIに依存しない純粋関数）
│   │   ├── bazi/             # 四柱推命算出エンジン
│   │   ├── wuxing/           # 五行バランス分析
│   │   ├── tcm/              # 体質マッチング・チェックリスト
│   │   └── ai/               # Claude API連携（未実装の空ディレクトリ）
│   └── types/                # TypeScript型定義
└── tests/                    # Jestテスト（bazi / wuxing / tcm / components）
```

**設計の原則**: 算出ロジック（`src/lib`）と表示（`src/components`）を分離。ロジックはUIに依存しない純粋関数として実装し、ユニットテストで担保します。

---

## 4. 起動方法・ビルド方法

```bash
# 依存インストール（node_modules が壊れた場合は rm -rf node_modules && npm ci）
npm install

# 開発サーバー（http://localhost:3000）
npm run dev

# 本番ビルド & 起動
npm run build
npm run start

# 静的解析・整形
npm run lint
npm run format

# テスト
npm test              # 全テスト
npm run test:watch    # ウォッチ
npm run test:coverage # カバレッジ

# 型チェック（CIに入れる想定）
npx tsc --noEmit

# ロジックのCLI動作確認
npx tsx scripts/demo-diagnosis.ts
```

### 環境変数

`.env.example` をコピーして `.env.local` を作成します。
**現状のロジックは環境変数なしで動作します**。以下は Phase 5 以降（Supabase永続化・Claude API）で使う予定のプレースホルダです。

```
ANTHROPIC_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. 主要ファイルの役割

### 算出エンジン（`src/lib`）

| ファイル | 役割 |
|---|---|
| `lib/bazi/calculator.ts` | **命式算出のメイン**。`calculateBazi({birthDate, birthTime, timezone})` → 四柱・日主・蔵干。lunar-javascript を使用、節入り基準で年月柱を決定。晩子時（23時台）は翌日の日柱（`setSect(1)`） |
| `lib/bazi/constants.ts` | 干支・五行対応表、蔵干テーブル |
| `lib/bazi/displayData.ts` | 表示用データ（干支の読み・陰陽） |
| `lib/bazi/personality.ts` | 日主の五行 → 性格傾向 |
| `lib/wuxing/analyzer.ts` | **五行バランス分析**。`analyzeWuxing(bazi)` → 五行スコア・身強/身弱・喜神/忌神。`dayMasterSupportPercent()` も提供 |
| `lib/wuxing/rules.ts` | スコアリング規則・強弱しきい値・相生相剋・五行→五臓 |
| `lib/wuxing/elementStyle.ts` | 五行カラー・五行色体表（六腑/感情/季節/五味/身体）・五臓状態しきい値 |
| `lib/wuxing/organMechanism.ts` | 五行の過多/欠乏による不調メカニズム（相剋ベース。鍼灸師資料に基づく） |
| `lib/tcm/matcher.ts` | **体質タイプ判定のメイン**。`buildDiagnosis(bazi, wuxing, symptomIds, familyIds)` → 候補最大4件＋根拠。命式＋自覚症状（1点/件）＋家族歴（0.5点/件）で加点 |
| `lib/tcm/mappingRules.ts` | 五行バランス → 体質タイプのマッピング規則・フォールバック |
| `lib/tcm/symptoms.ts` | 自覚症状チェックリスト（`physicalTraits` 由来）・性別フィルタ |
| `lib/tcm/familyHistory.ts` | 遺伝性体質チェックリスト（家族歴15項目→体質タイプ対応） |
| `lib/tcm/gender.ts` | 性別による婦人科系コンテンツの出し分け |

### 知識ベース（`src/data/constitutions`）

8体質タイプ（肝鬱気滞・心火亢盛・脾虚湿盛・肺気虚・腎陰虚・腎陽虚・気血両虚・痰湿瘀血）。
各ファイルは `ConstitutionType` 型のデータで、性格/身体傾向・季節・経穴（WHO標準コード）・食養生・生活・受診サインを含みます。**このディレクトリは鍼灸師の監修対象**。`index.ts` の `ALL_CONSTITUTIONS` / `getConstitutionById()` から参照します。

### UI（`src/components`）

| ファイル | 役割 |
|---|---|
| `app/page.tsx` | トップページ。入力→`buildDiagnosis`→結果セクションのオーケストレーション |
| `BirthInputForm.tsx` | 生年月日/時刻ドロップダウン・性別・各チェックリストの入力フォーム |
| `SymptomChecklist.tsx` / `FamilyHistoryChecklist.tsx` | 自覚症状・家族歴のチェックリスト |
| `BaziPillarsSection.tsx` | 命式（四柱）カード |
| `WuxingAnalysisSection.tsx` | 五行分析（レーダー＋スコア詳細＋相生相剋図＋日主比率） |
| `WuxingRadarChart.tsx` / `WuxingScoreDetail.tsx` / `DayMasterStrengthBar.tsx` / `WuxingCycleDiagram.tsx` | 五行分析の各パーツ |
| `OrganProfileSection.tsx` | 五臓体質プロフィール（過剰/適正/虚弱、相剋メカニズム説明） |
| `PersonalityCard.tsx` | 性格傾向 |
| `ConstitutionCard.tsx` | 体質タイプカード（概要＋詳細プルダウン） |
| `Disclaimer.tsx` | 免責事項（結果画面に必ず表示） |
| `SectionHeading.tsx` | 漢数字バッジ付き見出し |

### 型定義（`src/types`）

`bazi.ts`（命式）/ `wuxing.ts`（五行）/ `constitution.ts`（体質知識）/ `tcm.ts`（診断結果）/ `lunar-javascript.d.ts`（ライブラリ宣言）。

---

## 6. 今後の開発で注意すべき点

1. **医療表現の禁止（最重要）**
   - NG: 「〇〇病になりやすい」「治療には〇〇が効く」「あなたは水型体質です」（断定）
   - OK: 「〇〇の傾向があるとされています」「養生の参考として」
   - 結果画面には必ず `Disclaimer` を表示。家族歴は「遺伝・発症の断定」をせず**素因の参考**として扱う。
2. **知識ベースは監修対象**: `src/data/constitutions/` と東洋医学的な記述（`organMechanism.ts` など）を変更したら、鍼灸師レビュー（`docs/constitution-content-review.md`）を更新する。
3. **TypeScript strict / `any` 禁止**: 型を必ず付ける。`tsc --noEmit` をCIに。
4. **ロジックは純粋関数＋テスト必須**: `src/lib` の算出ロジックは UI 非依存に保ち、`tests/` にユニットテストを追加する（現在48テスト）。
5. **四柱推命の流派依存パラメータに注意**:
   - 晩子時の扱いは `calculator.ts` の `setSect(1)`（23時台＝翌日説）。
   - 身強/身弱や体質マッピングのしきい値・配点は `rules.ts` / `mappingRules.ts` / `elementStyle.ts` に集約。変更時は影響範囲とテストを確認。
6. **データの単一の出典（SSOT）**: チェックリストや五臓対応は知識ベース・対応表から生成しており、文言を二重管理しない方針。新規表示も既存データから導出することを優先。
7. **`tsconfig` の target が低め**: `Set`/`Map` の直接イテレーションは型エラーになるため `Array.from(...)` を使う（既存コードに倣う）。
8. **コミット規約**: `feat(phaseX): ...` 形式。フェーズ進捗は `CLAUDE.md` の表を更新。

---

## 7. 未実装・未解決の課題

### 未実装（ロードマップ）

| Phase | 内容 | 状態 |
|---|---|---|
| 1〜4 | 命式算出・五行分析・体質知識ベース・マッチング＋UI | ✅ 完了 |
| 5 | **Supabase によるデータ永続化・ユーザー管理** | 未着手（依存は導入済み・未配線） |
| — | **Claude API による養生アドバイス生成**（`src/lib/ai/` は空） | 未着手（`@anthropic-ai/sdk` 導入済み・未配線） |
| 6 | テスト・品質保証の拡充（E2E・カバレッジ目標） | 部分的（ユニットテストのみ） |
| 7 | デプロイ・本番運用 | 未着手 |

### 未解決・要検討

- **API Route 未整備**: 現状は全処理がクライアントで完結。永続化やAI連携を入れる際は `app/api/` の Route Handler ＋ Zod 検証を追加する。
- **流派・しきい値の監修確定**: 晩子時の扱い、身強/身弱しきい値（`STRENGTH_THRESHOLDS`）、五臓状態しきい値（`ORGAN_STATUS_THRESHOLDS`）、家族歴の重み（`FAMILY_POINT=0.5`）は暫定値。鍼灸師の確定が必要。
- **体質マッピングの精度**: `mappingRules.ts` はヒューリスティック。実例での検証・調整余地あり。
- **出生時刻の時差・サマータイム**: `timezone` は受け取るが現状は現地壁時計時刻で計算（時差変換なし）。海外出生対応は要検討。
- **アクセシビリティ/レスポンシブ**: 主要部分は対応済みだが、SVG図（相生相剋図）のスクリーンリーダー対応や狭幅でのラベル重なりに改善余地。
- **i18n**: 文言は日本語ハードコード。多言語化は未対応。
- **デプロイ設定**: ローカルは `npm run dev`。CI/CD・本番デプロイ（Vercel 等）は未整備。

---

## 参考ドキュメント

- `CLAUDE.md` — 開発指示書（規約・制約・東洋医学用語）。**実装前に必読**。
- `DECISIONS.md` — 設計判断の記録。
- `docs/constitution-content-review.md` — 体質知識ベースの監修レビュー用まとめ。
