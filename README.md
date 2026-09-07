# 慎读（Shendu）

慎读是一款隐私优先的桌面浏览器扩展。选中普通网页正文中的中文，通过右键菜单即可在选区附近查看带声调拼音，并使用系统中文语音朗读。

## 特性

- 本地处理简体和繁体中文，最多显示选区开头 8 个汉字。
- 使用前后各 32 个字符辅助判断常见多音字。
- 朗读仅包含选中的中文目标，不包含用于判断读音的上下文。
- 朗读仅使用本地中文声音；没有可用声音时显示提示。孤立多音字的系统发音可能与显示拼音不同。
- 只在用户点击右键菜单后临时访问当前页面。
- 无服务器、账号、遥测、网络请求或持久化数据。
- Chrome、Edge 共用 Manifest V3 代码，macOS Safari 使用同一 WebExtension 构建。
- 简体中文、繁体中文和英文界面。

## 开发

需要 Node.js 22+ 和 pnpm 11。

```bash
pnpm install
pnpm icons
pnpm check
pnpm build:chrome
pnpm audit:chrome
```

在 Chrome 或 Edge 的扩展管理页启用开发者模式，加载 `.output/chrome-mv3`。运行 `pnpm fixture` 后，在 `http://127.0.0.1:4173` 测试真实右键菜单。

## 权限

| 权限 | 用途 |
|---|---|
| `contextMenus` | 在文本选区的右键菜单中显示“显示中文拼音” |
| `activeTab` | 用户点击菜单后临时访问当前标签页 |
| `scripting` | 向发生操作的页面按需注入拼音浮层运行时 |

项目不声明 `host_permissions`、常驻 `content_scripts`、`storage` 或 `<all_urls>`。

## 当前边界

MVP 支持 HTTP/HTTPS 普通网页正文。输入框、富文本编辑器、浏览器 PDF、图片 OCR、内部页面和 iOS/iPadOS Safari 不在当前范围。

Safari 开发和打包说明见 [docs/SAFARI.md](docs/SAFARI.md)，语音验证状态见 [docs/TTS-COMPATIBILITY.md](docs/TTS-COMPATIBILITY.md)。

## License

Apache-2.0
