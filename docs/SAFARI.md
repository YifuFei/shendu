# macOS Safari 构建与验收

最低验证基线为 Safari 17.4。iOS 和 iPadOS 不在当前范围。

## 临时安装

1. 在任意开发机执行 `pnpm build:safari`，将 `.output/safari-mv3` 复制到 Mac。
2. Safari → 设置 → 高级，启用开发者功能。
3. Safari → 设置 → 开发者 → Add Temporary Extension，选择 `.output/safari-mv3`。
4. 只为测试站点授予单次访问权限，执行 `docs/MANUAL-TEST.md` 中的用例。

## 生成 Xcode 包装工程

在安装 Xcode 的 Mac 上执行：

```bash
bash scripts/package-safari.sh
```

包装工程输出至 `.output/safari-app`。当前没有 Apple Developer 账号，因此签名、TestFlight 和 App Store Connect 提交不属于自动化流程；获得账号后需在 Xcode 中设置 Team、Bundle Identifier 与签名证书。
