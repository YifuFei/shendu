import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PNG } from 'pngjs';
const root = resolve(import.meta.dirname, '..');
const source = PNG.sync.read(await readFile(resolve(root, 'assets/brand/promo-master.png')));
const width = 440, height = 280;
const image = new PNG({ width, height });
const scale = Math.min(source.width / width, source.height / height);
const offsetX = (source.width - width * scale) / 2;
const offsetY = (source.height - height * scale) / 2;
for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const left = offsetX + x * scale, top = offsetY + y * scale;
  const sums = [0, 0, 0];
  let area = 0;
  for (let sy = Math.floor(top); sy < Math.ceil(top + scale); sy++) {
    for (let sx = Math.floor(left); sx < Math.ceil(left + scale); sx++) {
      if (sx < 0 || sy < 0 || sx >= source.width || sy >= source.height) continue;
      const weight = (Math.min(left + scale, sx + 1) - Math.max(left, sx)) *
        (Math.min(top + scale, sy + 1) - Math.max(top, sy));
      area += weight;
      for (let c = 0; c < 3; c++) sums[c] += source.data[(sy * source.width + sx) * 4 + c] * weight;
    }
  }
  for (let c = 0; c < 3; c++) image.data[(y * width + x) * 4 + c] = Math.round(sums[c] / area);
  image.data[(y * width + x) * 4 + 3] = 255;
}
await writeFile(resolve(root, 'store-listing/assets/promo-440x280.png'), PNG.sync.write(image, { colorType: 2 }));
