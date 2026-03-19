# CLAUDE.md

## 真実の場所
- 問題型定義：src/domain/problem.ts
- 正誤判定：src/domain/answer.ts（テスト：tests/domain/answer.test.ts）
- 復習ルール：src/domain/review.ts（テスト：tests/domain/review.test.ts）
- 問題データ：data/problems/

## 作業前に実行すること
※ RN init 完了後（フェーズ1以降）に有効になる
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## 変更時のルール
- domain 層を変更するときはテストを先に更新する
- 復習ルールを変更するときは docs/adr/0003-review-rule.md を更新する

## ドキュメント
- PRD：docs/prd/001-kanji-learning-app.md
- ADR：docs/adr/
