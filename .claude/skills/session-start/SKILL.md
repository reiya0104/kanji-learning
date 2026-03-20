---
name: session-start
description: セッション開始時の起動ルーチンを実行してください。以下を順番に確認し、現在地をまとめてください。
user-invocable: true
---

セッション開始時の起動ルーチンを実行してください。以下を順番に確認し、現在地をまとめてください。

## ステップ1：リポジトリ状態の確認

```bash
git status
git log --oneline -5
```

## ステップ2：進行中・未完了 Issue の確認

```bash
gh issue list --repo reiya0104/kanji-learning --state open --json number,title,labels,milestone --limit 20
```

## ステップ3：現在フェーズの特定

マイルストーンと open Issue から「今どのフェーズにいるか」を判断してください。

## ステップ4：サマリーを出力

以下の形式で現在地をまとめてください：

```
## 現在地

**フェーズ**：フェーズX - 〇〇

**前回からの変更**：
- （git log から読み取った直近の変更）

**未完了 Issue**：
- #XX タイトル（フェーズX）
- ...

**次のアクション**：
- （最優先でやるべきこと 1〜2件）
```

uncommitted な変更がある場合は必ず言及してください。
