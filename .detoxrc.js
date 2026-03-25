/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      // expo prebuild 後に ios/ ディレクトリが生成される
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/kanjilearning.app',
      build:
        'npx expo prebuild --platform ios && xcodebuild -workspace ios/kanjilearning.xcworkspace -scheme kanjilearning -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build',
    },
    'android.debug': {
      type: 'android.apk',
      // expo prebuild 後に android/ ディレクトリが生成される
      binaryPath:
        'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        "npx expo prebuild --platform android && sed -i '/react {/a\\    debuggableVariants = []' android/app/build.gradle && cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug",
      reversePorts: [8081],
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_34',
      },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
  },
}
