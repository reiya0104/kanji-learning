---
description: TDD 運用方針 — テストは仕様
---

## 基本方針

「仕様はテストを見る、テストは仕様」。このプロジェクトは TDD で運用する。

## 開発サイクル

1. **Red** — 仕様をテストで記述し、失敗することを確認する
2. **Green** — テストが通る最小限の実装を書く
3. **Refactor** — テストを通したまま整理する

テストが通る前にコミットしない。

## テストの書き方

- `describe` / `it` の文言は**日本語で仕様として読める**ように書く
  - 良い例：`it('missCount >= 1 かつ consecutiveCorrect < 2 のとき true を返す')`
  - 悪い例：`it('works correctly')`

## カバレッジ

- patch coverage は原則 **100%**（型定義のみのファイルを除く）
- `npm test -- --coverage` で確認する
