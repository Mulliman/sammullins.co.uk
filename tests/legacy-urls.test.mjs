// Ticket 602: every legacy page URL and referenced media path must still resolve.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST, redirects, resolve } from './helpers.mjs';

const lines = (f) =>
  readFileSync(join(ROOT, f), 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

test('dist exists (run pnpm build first)', () => assert.ok(existsSync(DIST), 'dist/ missing'));

/** "N served directly (200), N redirected (301), N broken" for the test report. */
const summary = (results) => {
  const n = (s) => results.filter(([, r]) => r.status === s).length;
  return `${n(200)} served directly (200), ${n(301)} redirected (301), ${n(404)} broken`;
};

test('all 50 legacy page URLs resolve', (t) => {
  const map = redirects();
  const results = lines('_docs/legacy/urls.txt').map((u) => [u, resolve(u, map)]);
  t.diagnostic(`legacy pages: ${summary(results)}`);
  const failures = results.filter(([, r]) => r.status === 404);
  assert.deepEqual(
    failures.map(([u]) => u),
    [],
    `Broken legacy URLs:\n${failures.map(([u]) => u).join('\n')}`,
  );
});

test('legacy page URLs without trailing slash are handled', () => {
  // Netlify's pretty URLs redirect /x → /x/ when /x/index.html exists; redirects add explicit rules otherwise.
  const map = redirects();
  const failures = lines('_docs/legacy/urls.txt')
    .filter((u) => u !== '/')
    .filter((u) => {
      const bare = u.slice(0, -1);
      return resolve(u, map).status === 404 && resolve(bare, map).status === 404;
    });
  assert.deepEqual(failures, []);
});

test('all 306 referenced legacy media paths resolve', (t) => {
  const map = redirects();
  const results = lines('_docs/legacy/media-referenced.txt').map((p) => [p, resolve(p, map)]);
  t.diagnostic(`legacy media: ${summary(results)}`);
  const failures = results.filter(([, r]) => r.status === 404).map(([p]) => p);
  assert.deepEqual(failures, [], `Broken media paths (${failures.length}):\n${failures.slice(0, 20).join('\n')}`);
});
