#!/usr/bin/env bash
# PreToolUse hook: git commit --no-verify をブロックする
#
# Claude が lint/typecheck エラーを回避するために --no-verify を使うことを
# 構造的に防ぐ。ユーザーは settings.local.json でこのフックを上書きできる。

input=$(cat)

# jq がなければインストールを促してスキップ
if ! command -v jq >/dev/null 2>&1; then
  echo "WARNING: jq がインストールされていません。pre-no-verify フックが無効です。" >&2
  echo "インストール: sudo apt-get install jq  または  brew install jq" >&2
  exit 0
fi

cmd=$(echo "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)

# コマンドが空またはgit commitでなければスキップ
[ -z "$cmd" ] && exit 0
echo "$cmd" | grep -qE 'git\s+commit\b' || exit 0

# main ブランチへの直接コミットをブロック
current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [ "$current_branch" = "main" ]; then
  cat >&2 <<'MSG'
ERROR: main ブランチへの直接コミットは禁止です。

WHY: main への直接コミットはレビューをスキップするため、
     意図しない変更が混入するリスクがあります。
     このプロジェクトでは「作業ブランチ → PR → main」を
     必須フローとして運用しています。

FIX: 作業ブランチを作成してからコミットしてください。
  1. git checkout -b feat/issue番号-概要
  2. 変更を加えてコミット
  3. /commit スキルでコミット・PR 作成

EXAMPLE:
  NG: (main ブランチで) git commit -m "feat: ..."
  OK: git checkout -b feat/40-new-issue-dependency-section
      git commit -m "feat: ..."
MSG
  exit 2
fi

# git フラグは必ず1行目に現れるため、1行目のみを検査対象とする
# （ヒアドキュメント等で複数行になる場合でも誤検知しない）
# さらに -m 以降（コミットメッセージ本文）を除去して検査する
first_line=$(echo "$cmd" | head -1)
prefix=$(echo "$first_line" | sed -E 's/[[:space:]](-m|--message)[[:space:]].*//')

# --no-verify および短縮形 -n をブロック
# (^|空白) で始まり (空白|$) で終わるトークン単位で判定し、
# ファイルパス内の "-no" 等を誤検知しないようにする
# -[a-zA-Z]*n[a-zA-Z]* は -sn や -ns 等の連結フラグも検出する
if echo "$prefix" | grep -qE '(^|[[:space:]])(--no-verify|-[a-zA-Z]*n[a-zA-Z]*)([[:space:]]|$)'; then
  cat >&2 <<'MSG'
ERROR: --no-verify / -n は使用禁止です。

WHY: フックをスキップすると lint/typecheck エラーを見落としたまま
     コミットが積み重なり、後から修正コストが跳ね上がります。
     このプロジェクトでは「フックを通過したコードのみコミット可」を
     品質ゲートとして運用しています。

FIX: 以下の手順でエラーを解消してからコミットしてください。
  1. npm run lint      → ESLint エラーを確認・修正
  2. npm run typecheck → TypeScript エラーを確認・修正
  3. npm run test      → テストが通ることを確認
  4. 修正後、通常の git commit を実行する

EXAMPLE:
  NG: git commit --no-verify -m "fix: ..."
  OK: git commit -m "fix: ..."
MSG
  exit 2
fi
