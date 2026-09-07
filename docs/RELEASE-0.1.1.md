# 0.1.1 release progress

## Implemented and verified locally (2026-09-07)

- Only the selected Chinese target is spoken; context remains for pinyin computation.
- Only browser-designated local Chinese voices are used. No default or remote fallback.
- An open popover updates when voices arrive; listeners are removed on close.
- New generated book/tone-mark icon and derived 16/32/48/128/300 pixel assets.
- Simplified Chinese, Traditional Chinese and English descriptions and privacy policy.
- Apache license and third-party notices included in built archives.
- ESLint and TypeScript passed; 30 tests across seven files passed.
- Chrome, Edge and Safari 0.1.1 archives built and passed the static package audit.

## Still required before submission

- Actual Chrome/Edge browser smoke testing, offline listening verification and real localized screenshots.
- Chrome small promotional tile based on final real screenshots and icon.
- Publish GitHub commit and verify the public privacy-policy URL.
- Upload archives, metadata and assets; submit both stores for review.
- Record store IDs and public installation URLs after approval.

GitHub HTTPS access was attempted with the bundled Git HTTPS helper, including HTTP/1.1, but connections were reset. Computer Use previously could not validate the Edge URL and stopped its turn. Neither store has received this release. Local automated checks do not replace the outstanding browser/listening tests.

## Reproduction

Standard commands: `pnpm check`, `pnpm icons`, `pnpm zip:chrome`, `pnpm zip:edge`, `pnpm zip:safari`, each corresponding `pnpm audit:*`, then `node scripts/checksums.mjs`.

This desktop session's pnpm wrapper attempted to reinstall node_modules and aborted without a TTY. Checks were executed directly through the installed ESLint, TypeScript, Vitest and WXT Node entrypoints; no dependency versions or lockfile were changed. Generated archives and SHA-256 checksums are in `.output/` (gitignored).
