import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = resolve(root, 'fixtures/manual-test.html');
const port = 4173;

createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  createReadStream(fixture).pipe(response);
}).listen(port, '127.0.0.1', () => {
  console.log(`Shendu fixture: http://127.0.0.1:${port}`);
});
