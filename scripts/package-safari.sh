#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT_DIR"
pnpm build:safari
xcrun safari-web-extension-packager "$ROOT_DIR/.output/safari-mv3" \
  --project-location "$ROOT_DIR/.output/safari-app" \
  --app-name "Shendu" \
  --bundle-identifier "com.yifufei.shendu" \
  --swift
