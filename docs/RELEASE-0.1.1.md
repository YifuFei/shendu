# 0.1.1 release progress

## Implemented and verified locally (2026-09-07)

- Only the selected Chinese target is spoken; context remains for pinyin computation.
- Only browser-designated local Chinese voices are used. No default or remote fallback.
- An open popover updates when voices arrive; listeners are removed on close.
- New generated book/tone-mark icon and derived 16/32/48/128/300 pixel assets.
- Generated 440×280 promotional tile with the Chinese calligraphy title 慎读.
- Source commit 9fa8bfd pushed to GitHub; repository changed from private to public as authorized.
- Anonymous requests to the GitHub README and privacy-policy page both returned HTTP 200 after publication.
- Simplified Chinese, Traditional Chinese and English descriptions and privacy policy.
- Apache license and third-party notices included in built archives.
- ESLint and TypeScript passed; 30 tests across seven files passed.
- Chrome, Edge and Safari 0.1.1 archives built and passed the static package audit.

## Still required before submission

- Actual Chrome/Edge browser smoke testing, offline listening verification and real localized screenshots.
- Upload archives, metadata and assets; submit both stores for review.
- Record store IDs and public installation URLs after approval.

GitHub access was restored by using the existing Windows user's proxy at 127.0.0.1:7890 per command, without changing system settings. Repository visibility was explicitly changed to public. Windows Computer Use could not validate the Edge URL. The user switched to the in-app browser and signed in; browser discovery shows the developer dashboard, but binding to the tab times out at Emulation.setFocusEmulationEnabled. Neither store has received this release. Local automated checks do not replace the outstanding browser/listening tests.

## Reproduction

Standard commands: `pnpm check`, `pnpm icons`, `pnpm zip:chrome`, `pnpm zip:edge`, `pnpm zip:safari`, each corresponding `pnpm audit:*`, then `node scripts/checksums.mjs`.

This desktop session's pnpm wrapper attempted to reinstall node_modules and aborted without a TTY. Checks were executed directly through the installed ESLint, TypeScript, Vitest and WXT Node entrypoints; no dependency versions or lockfile were changed. Generated archives and SHA-256 checksums are in `.output/` (gitignored).
