import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const original = PNG.sync.read(await readFile(resolve(root, 'assets/brand/icon-master.png')));
// Area averaging preserves the generated artwork at small toolbar sizes.
function resize(size) {
  const output = new PNG({ width: size, height: size });
  const scale = original.width / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sums = [0, 0, 0, 0];
    let weight = 0;
    for (let sy = Math.floor(y * scale); sy < Math.ceil((y + 1) * scale); sy++) {
      for (let sx = Math.floor(x * scale); sx < Math.ceil((x + 1) * scale); sx++) {
        if (sx >= original.width || sy >= original.height) continue;
        const w = (Math.min(sx + 1, (x + 1) * scale) - Math.max(sx, x * scale)) *
          (Math.min(sy + 1, (y + 1) * scale) - Math.max(sy, y * scale));
        weight += w;
        for (let c = 0; c < 4; c++) sums[c] += original.data[(sy * original.width + sx) * 4 + c] * w;
      }
    }
    for (let c = 0; c < 4; c++) output.data[(y * size + x) * 4 + c] = Math.round(sums[c] / weight);
  }
  return PNG.sync.write(output);
}
await mkdir(resolve(root, 'public/icons'), { recursive: true });
await mkdir(resolve(root, 'store-listing/assets'), { recursive: true });
for (const size of [16, 32, 48, 128]) {
  await writeFile(resolve(root, `public/icons/icon-${size}.png`), resize(size));
}
await writeFile(resolve(root, 'store-listing/assets/logo-300.png'), resize(300));
