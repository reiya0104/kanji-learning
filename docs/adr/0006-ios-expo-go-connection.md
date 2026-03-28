# ADR 0006: WSL2 から iOS 実機（Expo Go）への接続方法

## ステータス
Accepted

## コンテキスト
WSL2 開発環境から iPhone の Expo Go を使って動作確認を行いたい。
WSL2 はデフォルトで独自の仮想ネットワーク（172.x.x.x）を持ち、
同一 Wi-Fi 上の iOS 実機から Metro Bundler に直接到達できない。

過去に試みた方法：
- tunnel モード（`npx expo start --tunnel`）→ "remote gone away" で失敗
- netsh portproxy → 接続に至らず

## 決定

WSL2 の **mirrored ネットワークモード** を採用し、
Windows Hyper-V ファイアウォールのインバウンドを許可する。

## セットアップ手順（初回のみ）

### 1. `.wslconfig` の確認（`C:\Users\<ユーザー名>\.wslconfig`）

```ini
[wsl2]
networkingMode=mirrored

[experimental]
hostAddressLoopback=true
```

`networkingMode=mirrored` により WSL2 の IP が Windows の Wi-Fi IP と同じサブネットに配置される。

### 2. Hyper-V ファイアウォールの許可（PowerShell 管理者権限）

Windows 11 Home では GUI 設定が存在しないため、PowerShell で実行する：

```powershell
Set-NetFirewallHyperVVMSetting -Name '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}' -DefaultInboundAction Allow
```

### 3. Windows ファイアウォールでポートを許可（`wf.msc` または PowerShell）

```powershell
netsh advfirewall firewall add rule name="Expo Metro 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Expo Dev 19000" dir=in action=allow protocol=TCP localport=19000
netsh advfirewall firewall add rule name="Expo Dev 19001" dir=in action=allow protocol=TCP localport=19001
```

## 日常の使い方

WSL2 内で以下を実行する：

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=192.168.11.3 npx expo start
```

iPhone の Expo Go で QR コードをスキャン、または「Enter URL manually」から
`exp://192.168.11.3:8081` を入力する。

## 接続確認方法

iPhone の Safari で以下にアクセスし、JSON レスポンスが返れば接続 OK：

```
http://192.168.11.3:8081
```

## 理由

- mirrored モードにより WSL2 が `192.168.11.3`（Wi-Fi と同じサブネット）を持つ
- portproxy 不要・tunnel 不要でシンプル
- `/mnt/c/` へのプロジェクト移動は不要（Expo 公式が非推奨のため）

## トレードオフ

- `REACT_NATIVE_PACKAGER_HOSTNAME` の明示が毎回必要
- Windows の IP が変わった場合（Wi-Fi 切り替え等）は値の更新が必要
- Expo Go は常に最新 SDK に対応するため、プロジェクトの SDK バージョンと合わせる必要がある
  （SDK バージョン不一致は別途対応：Issue #70）
- Windows 側 Hyper-V ファイアウォール設定は WSL 再起動後も保持される（KVM と異なり毎回不要）
