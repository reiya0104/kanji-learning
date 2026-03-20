#!/bin/bash
# Stop Hook: 完了宣言前の品質ゲート
# - node_modules がなければスキップ（フェーズ0）
# - typecheck + lint を必ず実行
# - src/domain/ に変更があればテストも実行（フェーズ1以降）
# 失敗時は exit 2 でブロックし、エラー内容を Claude に返す

set -euo pipefail

ERRORS=""

# node_modules がなければ RN init 前 → スキップ
if [ ! -d "node_modules" ]; then
  exit 0
fi

# typecheck
if ! out=$(npm run typecheck 2>&1); then
  ERRORS+="[typecheck]\n${out}\n\n"
fi

# lint
if [ -f "node_modules/.bin/eslint" ]; then
  if ! out=$(npm run lint 2>&1); then
    ERRORS+="[lint]\n${out}\n\n"
  fi
fi

# domain テスト（src/domain/ に変更がある場合のみ）
CHANGED=$(git diff --name-only HEAD 2>/dev/null; git diff --name-only 2>/dev/null)
if echo "$CHANGED" | grep -q "^src/domain/"; then
  if [ -f "node_modules/.bin/jest" ]; then
    if ! out=$(npm test -- --passWithNoTests 2>&1); then
      ERRORS+="[test]\n${out}\n\n"
    fi
  fi
fi

if [ -n "$ERRORS" ]; then
  echo "品質ゲートに失敗しました。以下のエラーを修正してから完了宣言してください。"
  echo ""
  echo -e "$ERRORS"
  exit 2
fi

exit 0
