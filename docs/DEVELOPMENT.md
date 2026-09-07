# 开发与贡献

## 从源码安装

需要 Node.js 22+ 和 pnpm 11.19.0。

```bash
git clone https://github.com/YifuFei/shendu.git
cd shendu
pnpm install --frozen-lockfile
pnpm build:chrome
pnpm build:edge
```

1. Chrome 打开 `chrome://extensions`；Edge 打开 `edge://extensions`。
2. 开启开发者模式，选择“加载已解压的扩展程序”或“加载解压缩的扩展”。
3. Chrome 选择 `.output/chrome-mv3`，Edge 选择 `.output/edge-mv3`。
4. 更新构建后，重新加载扩展，并刷新测试网页。

ZIP 是发布打包产物，开发测试使用上述目录。运行 `pnpm fixture` 后，在 `http://127.0.0.1:4173` 测试真实菜单；保持终端运行，不要直接双击 HTML 文件。

## 验证与打包

```bash
pnpm check
pnpm icons
pnpm zip:chrome
pnpm zip:edge
pnpm audit:chrome
pnpm audit:edge
```

依赖通过 `pnpm-lock.yaml` 固定。CI 执行 lint、类型检查、单元测试和构建审计。真实菜单、语音和商店安装仍需人工验证，参见[人工测试清单](MANUAL-TEST.md)、[语音兼容性](TTS-COMPATIBILITY.md)和[首发进度](RELEASE-0.1.1.md)。Safari 另见[包装说明](SAFARI.md)。

## 权限与实现

WXT / TypeScript / Manifest V3；拼音使用本地词典。每次最多八个汉字，选区前后各最多 32 个 Unicode 字符用于消歧。

| 权限 | 用途 |
|---|---|
| `contextMenus` | 注册选区右键菜单 |
| `activeTab` | 用户触发后临时访问页面 |
| `scripting` | 按需注入浮层运行时 |

不申请永久网站权限、不声明常驻内容脚本、不保存用户数据。数据处理细节见[隐私政策](../PRIVACY.md)。

## 提交贡献

提交 PR 前运行 `pnpm check`，说明操作场景与验证结果。不要提交密码、密钥或含敏感信息的网页截图。项目采用 [Apache-2.0](../LICENSE)，第三方组件声明见[许可证说明](../public/THIRD-PARTY-NOTICES.txt)。
