import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = process.cwd();
export const DIST = join(ROOT, 'dist');

export function walk(dir, filter = () => true) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p, filter) : filter(p) ? [p] : [];
  });
}

/** Parse dist/_redirects into a Map(from → { to, status }). */
export function redirects() {
  const file = join(DIST, '_redirects');
  const map = new Map();
  if (!existsSync(file)) return map;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const [from, to, status] = t.split(/\s+/);
    map.set(from, { to, status: Number(status) });
  }
  return map;
}

/** Does a site path resolve to a file in dist? */
export function servedFile(path) {
  const clean = decodeURIComponent(path.split('?')[0].split('#')[0]);
  const direct = join(DIST, clean);
  if (clean.endsWith('/')) return existsSync(join(direct, 'index.html')) ? join(direct, 'index.html') : undefined;
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  return undefined;
}

/** Resolve a path like Netlify would: 200, or one 301 hop to a 200. */
export function resolve(path, map = redirects()) {
  const clean = path.split('?')[0];
  if (servedFile(clean)) return { status: 200, path: clean };
  const r = map.get(clean);
  if (r) return servedFile(r.to) ? { status: r.status, path: r.to } : { status: 404, path: r.to, broken: true };
  return { status: 404, path: clean };
}
