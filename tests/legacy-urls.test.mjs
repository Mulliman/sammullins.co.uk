// Ticket 602: every legacy page URL and referenced media path must still resolve.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST, redirects, resolve } from './helpers.mjs';

const lines = (f) => readFileSync(join(ROOT, f), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);

test('dist exists (run pnpm build first)', () => assert.ok(existsSync(DIST), 'dist/ missing'));

test('all 50 legacy page URLs resolve', () => {
  const map = redirects();
  const failures = lines('_docs/legacy/urls.txt').map((u) => [u, resolve(u, map)]).filter(([, r]) => r.status === 404);
  assert.deepEqual(failures.map(([u]) => u), [], `Broken legacy URLs:\n${failures.map(([u]) => u).join('\n')}`);
});

test('legacy page URLs without trailing slash are handled', () => {
  // Netlify's pretty URLs redirect /x → /x/ when /x/index.html exists; redirects add explicit rules otherwise.
  const map = redirects();
  const failures = lines('_docs/legacy/urls.txt').filter((u) => u !== '/').filter((u) => {
    const bare = u.slice(0, -1);
    return resolve(u, map).status === 404 && resolve(bare, map).status === 404;
  });
  assert.deepEqual(failures, []);
});

test('all 306 referenced legacy media paths resolve', () => {
  const map = redirects();
  const failures = lines('_docs/legacy/media-referenced.txt').filter((p) => resolve(p, map).status === 404);
  assert.deepEqual(failures, [], `Broken media paths (${failures.length}):\n${failures.slice(0, 20).join('\n')}`);
});
