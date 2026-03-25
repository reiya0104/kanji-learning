# ADR 0005: E2E テスト環境（WSL2 + Android エミュレータ）

## ステータス
Accepted

## コンテキスト
Detox による E2E テストを WSL2 開発環境で実行する必要がある。
WSL2 は Linux 上でネイティブ Android エミュレータを動かせるが、
KVM の有効化や JS バンドルの埋め込みなど複数の制約がある。

## 決定
WSL2 ネステッド仮想化 + ヘッドレス Android エミュレータを採用する。
New Architecture は Detox 互換性の問題により E2E テスト時は無効にする。

## 理由
- Detox の `android.emulator` デバイスタイプをそのまま活用でき、`.detoxrc.js` の構成が単純
- 物理デバイスや Windows 側エミュレータ方式と比べて、再現性が高くスクリプト化しやすい
- `newArchEnabled: false` により Detox の Espresso idling resource が正常に動作する

## トレードオフ
- WSL 再起動のたびに KVM モジュールの手動ロードが必要（自動化は未対応）
- ヘッドレス + `swiftshader_indirect` のためテスト実行は実機より遅い
- New Architecture を無効にしているため、Fabric 固有のバグは E2E で検出できない
- Detox が RN の New Architecture を公式サポートした時点で再有効化を検討する
