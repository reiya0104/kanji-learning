# CLAUDE.md

## セッション開始
新しいセッションでは必ず `/session-start` を実行して現在地を確認してください。

## プロジェクト概要
漢字読み学習アプリ（Expo/React Native）

## 真実の場所
- 問題型定義：src/domain/problem.ts
- 正誤判定：src/domain/answer.ts
- 復習ルール：src/domain/review.ts
- 問題データ：data/problems/

## ドキュメント
- PRD：docs/prd/001-kanji-learning-app.md
- ADR：docs/adr/
- レビュールール：.claude/rules/

## 作業前コマンド
※ RN init 完了後（フェーズ1以降）に有効
```
npm run typecheck && npm run test && npm run lint
```
