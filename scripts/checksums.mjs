import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const lines = [];
for (const browser of ['chrome', 'edge', 'safari']) {
  const name = `shendu-${version}-${browser}.zip`;
  const data = await readFile(resolve(root, '.output', name));
  lines.push(`${createHash('sha256').update(data).digest('hex')}  ${name}`);
}
await writeFile(resolve(root, '.output/SHA256SUMS.txt'), `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
