#!/bin/bash
# SessionStart Hook: クラウド環境起動時の初期セットアップ
# クラウド環境（CLAUDE_CODE_REMOTE=true）でのみ実行する
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "=== セッション開始: 依存パッケージをインストール中 ==="
npm install
echo "=== セットアップ完了 ==="
