# Store submission worksheet — 0.1.1

Publisher display name: 苗种的树. Free; public; all available regions. Default language: Simplified Chinese. Additional languages: Traditional Chinese and English. Preferred category: Education, otherwise Productivity.

Website: https://github.com/YifuFei/shendu

Support: https://github.com/YifuFei/shendu/issues

Privacy policy (verify publicly accessible before submitting): https://github.com/YifuFei/shendu/blob/main/PRIVACY.md

## Single purpose

Show tone-marked pinyin for Chinese text explicitly selected by the user on ordinary webpages, with optional local Chinese pronunciation of the displayed target.

## Permission justifications

- `contextMenus`: Adds “Show Chinese pinyin” to the text-selection context menu on HTTP/HTTPS pages.
- `activeTab`: Grants temporary page access only after the user invokes that menu, to locate the selection and read limited surrounding context for pinyin.
- `scripting`: Injects the bundled page runtime into the selected frame to compute pinyin and render the popover. There is no persistent content script or permanent website access.

## Privacy declarations

No remotely hosted executable code. Dictionaries and runtime are bundled. Selected text and limited surrounding text are processed transiently on-device, not transmitted or saved. No analytics, advertising, tracking, sale of data, or unrelated data use. Speech only uses browser-designated local Chinese voices; there is no default/remote fallback. Complete dashboard questions according to their exact wording, distinguishing local processing from collection/transmission; do not claim that no page text is accessed.

## Reviewer instructions

No account or login is required. Open an ordinary HTTP/HTTPS webpage containing Chinese text. Select 重庆 or 银行, right-click, and select the extension menu. Expect chóng qìng or yín háng. A local Chinese system voice is required only for audio. If unavailable, the popover displays a message and pinyin remains functional. Select 水 inside 并州文水人: expect shuǐ and speech of 水 only. Do not test on file://, browser internal pages, PDF viewers, or online editors. Sources include `fixtures/manual-test.html`, served with `pnpm fixture` at http://127.0.0.1:4173.

## Upload assets

- `.output/shendu-0.1.1-chrome.zip` / `.output/shendu-0.1.1-edge.zip`
- `public/icons/icon-128.png`, `store-listing/assets/logo-300.png`
- Localized full descriptions: `zh-CN.md`, `zh-TW.md`, `en.md`
- Small promotional tile: `store-listing/assets/promo-440x280.png` (Chinese calligraphy title).
- Real screenshots: pending browser capture; do not substitute simulated extension UI.

Submission must wait for verified public links, required screenshots, and browser smoke tests. Uploading a package is not approval or publication.
