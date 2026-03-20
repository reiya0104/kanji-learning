---
name: commit
description: 以下の手順でコミットを作成してください。
user-invocable: true
---

以下の手順でコミットを作成してください。

## ステップ1：変更内容の確認

```bash
git status
git diff --staged
git diff
```

staged な変更がなければ、ユーザーに確認してから `git add` するファイルを選んでください。
`.env` や認証情報を含むファイルは絶対に含めないこと。

## ステップ2：domain 層チェック

`src/domain/` 以下のファイルが変更に含まれる場合、以下を確認してください：

- [ ] 対応するテストが更新・追加されているか
- [ ] 復習ルール（`src/domain/review.ts`）を変更した場合、`docs/adr/0003-review-rule.md` を更新したか

未対応の項目があればユーザーに指摘し、コミット前に対処してもらうこと。

## ステップ3：コミットメッセージの決定

変更内容から適切な prefix を選ぶ：

| prefix | 用途 |
|--------|------|
| `feat` | 新機能の追加 |
| `fix` | バグ修正 |
| `chore` | ビルド・設定・依存関係の変更 |
| `docs` | ドキュメントのみの変更 |
| `test` | テストのみの変更 |
| `harness` | 開発ハーネス・CI・ツールの整備 |

フォーマット：
```
<prefix>: <変更内容を日本語で簡潔に>（#Issue番号）
```

関連 Issue が不明な場合はユーザーに確認してください。

## ステップ4：ユーザーに確認

ドラフトしたコミットメッセージをユーザーに提示し、承認を得てください。

## ステップ5：コミット実行

承認後、以下の形式でコミットしてください：

```bash
git commit -m "$(cat <<'EOF'
<prefix>: <メッセージ>（#XX）

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

コミット後、`git log --oneline -3` で結果を確認してください。
