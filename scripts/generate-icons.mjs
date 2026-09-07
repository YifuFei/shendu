import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PNG } from 'pngjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = resolve(root, 'public/icons');
const sizes = [16, 32, 48, 128];

function blend(target, source, alpha) {
  return Math.round(target * (1 - alpha) + source * alpha);
}

function pixel(png, x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const index = (png.width * y + x) << 2;
  png.data[index] = blend(png.data[index], color[0], alpha);
  png.data[index + 1] = blend(png.data[index + 1], color[1], alpha);
  png.data[index + 2] = blend(png.data[index + 2], color[2], alpha);
  png.data[index + 3] = 255;
}

function roundedRect(png, x0, y0, x1, y1, radius, color) {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const cx = Math.max(x0 + radius, Math.min(x, x1 - radius - 1));
      const cy = Math.max(y0 + radius, Math.min(y, y1 - radius - 1));
      if ((x - cx) ** 2 + (y - cy) ** 2 <= radius ** 2) pixel(png, x, y, color);
    }
  }
}

function rect(png, x0, y0, x1, y1, color) {
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) pixel(png, x, y, color);
  }
}

function drawIcon(size) {
  const png = new PNG({ width: size, height: size, colorType: 6 });
  const scale = size / 128;
  const n = (value) => Math.round(value * scale);
  const indigo = [55, 48, 163];
  const white = [255, 255, 255];
  const pale = [238, 242, 255];
  const accent = [251, 191, 36];

  roundedRect(png, 0, 0, size, size, n(28), indigo);
  roundedRect(png, n(25), n(30), n(65), n(98), n(6), white);
  roundedRect(png, n(63), n(30), n(103), n(98), n(6), pale);
  rect(png, n(61), n(34), n(66), n(99), [199, 210, 254]);
  rect(png, n(38), n(48), n(55), n(53), [99, 102, 241]);
  rect(png, n(38), n(61), n(55), n(66), [99, 102, 241]);
  rect(png, n(74), n(48), n(91), n(53), [99, 102, 241]);
  rect(png, n(74), n(61), n(91), n(66), [99, 102, 241]);
  roundedRect(png, n(82), n(75), n(89), n(82), n(3), accent);
  roundedRect(png, n(89), n(81), n(96), n(89), n(3), accent);
  roundedRect(png, n(95), n(88), n(102), n(98), n(3), accent);
  return PNG.sync.write(png);
}

await mkdir(outputDirectory, { recursive: true });
await Promise.all(sizes.map((size) => writeFile(resolve(outputDirectory, `icon-${size}.png`), drawIcon(size))));
