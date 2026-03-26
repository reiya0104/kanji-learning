---
name: create-pr
description: レビュー結果を活用して PR を作成してください。
user-invocable: true
---

以下の手順で PR を作成してください。

## ステップ1：レビュー状態の確認

この会話の中で `/review` によるレビューサマリーが出力されているか確認してください。

- **サマリーあり**：ステップ2に進む
- **サマリーなし**：「先に `/review` を実行してセルフレビューを完了してください。」と案内し、処理を終了する

## ステップ2：PR description のドラフト

`.github/pull_request_template.md` のフォーマットに沿って description を生成してください。レビューサマリーの情報を活用すること：

```
## 変更内容

（git log + レビューサマリーから変更の概要を箇条書きで）

## 設計メモ

（設計上の判断・トレードオフがあれば記述。なければセクションごと削除）

## 対応 Issue

Closes #XX

## 影響範囲

（レビューサマリーの影響範囲を転記）

## 確認項目
- [ ] lint 通過（PostToolUse Hook が通過済みなら `[x]` にする）
- [ ] typecheck 通過（PostToolUse Hook が通過済みなら `[x]` にする）
- [ ] test 通過
```

## ステップ3：ユーザーに確認

レビューサマリーと PR description ドラフトをまとめてユーザーに提示し、承認を得てください。

## ステップ4：PR 作成

承認後、以下のコマンドで PR を作成してください。`--body` にはステップ2で生成した実際のテキストをそのまま展開して渡すこと：

```bash
gh pr create \
  --repo reiya0104/kanji-learning \
  --title "<prefix>: <変更内容>" \
  --assignee "@me" \
  --body "$(cat <<'EOF'
（ステップ2で生成した description を、ここに直接貼り付ける）
EOF
)"
```

PR 作成後、URL をユーザーに提示してください。
