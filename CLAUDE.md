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

## iOS 実機デバッグ（Expo Go）

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.11.3 npx expo start
```

iPhone の Expo Go で QR コードをスキャン（または `exp://192.168.11.3:8081` を手動入力）。
初回セットアップ手順は docs/adr/0006-ios-expo-go-connection.md を参照。

## 作業前コマンド
※ RN init 完了後（フェーズ1以降）に有効
```
npm run typecheck && npm run test && npm run lint
```
