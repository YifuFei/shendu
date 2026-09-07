# TTS 兼容性门槛

## 当前结论

跨 Windows Chrome/Edge 与 macOS Safari 的人工听测尚未全部完成，因此发布默认值为 `sourceContext`。界面继续显示带调拼音，朗读只使用选中的原中文目标。选区上下文仅用于判断拼音，不会传给系统语音。

只有当一种拼音输入格式在所有目标浏览器的系统中文声音中全量通过后，才可修改 `src/config/product.ts` 中的 `DEFAULT_SPEECH_MODE`。

0.1.1 仅允许 `localService === true` 的中文声音，优先 zh-CN。声音列表延迟加载时浮层自动更新；没有本地中文声音时显示提示，不使用远程或浏览器默认声音。孤立多音字的系统发音可能与显示拼音不同。

## 固定语料

| 原文 | 符号拼音 | 数字拼音 | 无调拼音 |
|---|---|---|---|
| 重庆 | chóng qìng | chong2 qing4 | chong qing |
| 银行 | yín háng | yin2 hang2 | yin hang |
| 行长 | háng zhǎng | hang2 zhang3 | hang zhang |
| 行走 | xíng zǒu | xing2 zou3 | xing zou |
| 女儿 | nǚ ér | nv3 er2 | nv er |
| 绿色 | lǜ sè | lv4 se4 | lv se |
| 掠过 | lüè guò | lve4 guo4 | lve guo |

## 验收矩阵

- Windows 11 当前稳定版 Chrome，系统 `zh-CN` 声音。
- Windows 11 当前稳定版 Edge，系统 `zh-CN` 声音。
- macOS 当前稳定版 Safari，系统普通话声音。
- 每项记录声调、多音字、`ü` 和音节边界是否正确；任一失败即保留 `sourceContext`。
