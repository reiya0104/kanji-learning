#!/usr/bin/env bash
# PreToolUse hook: git commit --no-verify をブロックする
#
# Claude が lint/typecheck エラーを回避するために --no-verify を使うことを
# 構造的に防ぐ。ユーザーは settings.local.json でこのフックを上書きできる。

input=$(cat)
cmd=$(echo "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)

# コマンドが空またはgit commitでなければスキップ
[ -z "$cmd" ] && exit 0
echo "$cmd" | grep -qE 'git\s+commit\b' || exit 0

# git フラグは必ず1行目に現れるため、1行目のみを検査対象とする
# （ヒアドキュメント等で複数行になる場合でも誤検知しない）
# さらに -m 以降（コミットメッセージ本文）を除去して検査する
first_line=$(echo "$cmd" | head -1)
prefix=$(echo "$first_line" | sed -E 's/[[:space:]](-m|--message)[[:space:]].*//')

# --no-verify および短縮形 -n をブロック
if echo "$prefix" | grep -qE '(--no-verify|-n\b)'; then
  echo "ERROR: --no-verify / -n は使用不可です。" >&2
  echo "lint/typecheck のエラーを修正してからコミットしてください。" >&2
  exit 2
fi
