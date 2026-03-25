## E2E テスト（Android on WSL2）

### 前提条件
- Android SDK: `$HOME/Android/Sdk`
- AVD: `Pixel_4_API_34`
- KVM が有効であること（`ls /dev/kvm`）

### KVM の有効化（WSL 再起動のたびに必要）
```bash
sudo modprobe kvm && sudo modprobe kvm-intel && sudo chmod 666 /dev/kvm
```

### エミュレータ起動
```bash
adb start-server
emulator -avd Pixel_4_API_34 -no-window -no-audio -gpu swiftshader_indirect &
adb wait-for-device
```

### ビルド & テスト実行
```bash
npm run build:e2e   # expo prebuild + Gradle ビルド（初回は数分かかる）
npm run test:e2e    # Detox スモークテスト実行
```

### 注意事項
- `newArchEnabled: false`（Detox + RN 0.76 互換性のため、ADR 0005 参照）
- debug APK には JS バンドルを埋め込み済み（Metro 不要）
- ビルドコマンド内で `debuggableVariants = []` を `sed` 注入している（`.detoxrc.js` 参照）
