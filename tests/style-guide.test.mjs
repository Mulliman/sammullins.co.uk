// Ticket 1301: the style guide is unlisted. Noindex, not linked, and not in the sitemap or llms.txt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { DIST, walk } from './helpers.mjs';

const GUIDE = join(DIST, 'style-guide');
const rel = (p) => relative(DIST, p).split(/[\\/]/).join('/');
const guideHtml = () => walk(GUIDE, (p) => p.endsWith('.html'));

test('the style guide is built', () => {
  assert.ok(existsSync(GUIDE), 'dist/style-guide/ is missing');
  assert.ok(guideHtml().length > 0, 'no HTML pages under dist/style-guide/');
});

test('every style guide page has a noindex robots meta', () => {
  const missing = guideHtml().filter(
    (f) => !/<meta\s+name="robots"\s+content="noindex"\s*\/?>/i.test(readFileSync(f, 'utf8')),
  );
  assert.deepEqual(missing.map(rel), [], 'these guide pages lack <meta name="robots" content="noindex">');
});

test('no page outside /style-guide/ links to it', () => {
  const offenders = walk(DIST, (p) => p.endsWith('.html'))
    .filter((f) => !f.startsWith(GUIDE))
    .filter((f) => /\/style-guide\b/.test(readFileSync(f, 'utf8')))
    .map(rel);
  assert.deepEqual(offenders, []);
});

test('sitemap files contain no /style-guide/ URL', () => {
  const sitemaps = readdirSync(DIST).filter((n) => /^sitemap.*\.xml$/.test(n));
  assert.ok(sitemaps.length > 0, 'no sitemap files in dist/');
  const offenders = sitemaps.filter((n) => readFileSync(join(DIST, n), 'utf8').includes('/style-guide/'));
  assert.deepEqual(offenders, []);
});

test('llms.txt contains no /style-guide/ URL', () => {
  const file = join(DIST, 'llms.txt');
  assert.ok(existsSync(file), 'dist/llms.txt is missing');
  assert.ok(!readFileSync(file, 'utf8').includes('/style-guide/'));
});
