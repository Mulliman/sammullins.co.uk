// Tiny static server for dist/ that honours Netlify-style _redirects (tests only).
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { DIST, redirects } from '../helpers.mjs';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.avif': 'image/avif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain', '.xml': 'application/xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon' };

export function serve(port = 0) {
  const map = redirects();
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = decodeURIComponent(url.pathname);
    const r = map.get(p);
    if (r) { res.writeHead(r.status, { Location: r.to }); return res.end(); }
    let file = join(DIST, p);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': types['.html'] }); return res.end(existsSync(join(DIST, '404.html')) ? readFileSync(join(DIST, '404.html')) : 'Not found'); }
    res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok({ server, origin: `http://127.0.0.1:${server.address().port}` })));
}
