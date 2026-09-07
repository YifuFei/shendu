import { readFile, readdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

const packageDirectory = resolve(process.argv[2] ?? '');
const manifest = JSON.parse(await readFile(resolve(packageDirectory, 'manifest.json'), 'utf8'));
const expectedPermissions = ['activeTab', 'contextMenus', 'scripting'];
const actualPermissions = [...(manifest.permissions ?? [])].sort();

if (JSON.stringify(actualPermissions) !== JSON.stringify(expectedPermissions)) {
  throw new Error(`Unexpected permissions: ${JSON.stringify(actualPermissions)}`);
}

for (const prohibitedKey of ['host_permissions', 'optional_host_permissions', 'content_scripts', 'externally_connectable']) {
  if (prohibitedKey in manifest) throw new Error(`Prohibited manifest key: ${prohibitedKey}`);
}

async function executableFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return executableFiles(path);
      return ['.js', '.mjs', '.html'].includes(extname(entry.name)) ? [path] : [];
    }),
  );
  return nested.flat();
}

const prohibitedPatterns = [
  [/\bfetch\s*\(/u, 'fetch'],
  [/\bXMLHttpRequest\b/u, 'XMLHttpRequest'],
  [/\bWebSocket\s*\(/u, 'WebSocket'],
  [/\beval\s*\(/u, 'eval'],
  [/\bnew\s+Function\s*\(/u, 'new Function'],
  [/import\s*\(\s*['"]https?:/u, 'remote dynamic import'],
];

for (const path of await executableFiles(packageDirectory)) {
  const source = await readFile(path, 'utf8');
  for (const [pattern, label] of prohibitedPatterns) {
    if (pattern.test(source)) throw new Error(`${label} found in ${path}`);
  }
}

console.log(`Package audit passed: ${packageDirectory}`);
