#!/usr/bin/env bash
# Build a debug APK locally. Requires: Node 20+, JDK 17, Android SDK.
set -euo pipefail

echo "▶ Installing deps..."
npm install

echo "▶ Building web bundle..."
npm run build

if [ ! -d android ]; then
  echo "▶ Adding Capacitor Android platform..."
  npx cap add android
fi

echo "▶ Syncing native..."
npx cap sync android

echo "▶ Assembling debug APK..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "✅ APK ready at: android/$APK"
