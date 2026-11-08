// Ticket 703: GoatCounter is self-hosted, pinned and integrity-checked, and only starts where it should.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST, walk } from './helpers.mjs';

const read = (...p) => readFileSync(join(ROOT, ...p), 'utf8');

test('vendored count.js matches the checksum recorded in _docs/analytics.md', () => {
  const recorded = read('_docs', 'analytics.md').match(/\| `public\/js\/count\.js` \|[^\n]*`([0-9a-f]{64})`/)?.[1];
  assert.ok(recorded, 'no SHA-256 for public/js/count.js in _docs/analytics.md');
  const actual = createHash('sha256')
    .update(readFileSync(join(ROOT, 'public', 'js', 'count.js')))
    .digest('hex');
  assert.equal(actual, recorded);
});

test('every page loads count.js (no_onload) then analytics.js, both same-origin', () => {
  const offenders = [];
  for (const f of walk(DIST, (p) => p.endsWith('.html'))) {
    const html = readFileSync(f, 'utf8');
    const count = html.indexOf('src="/js/count.js"');
    const start = html.indexOf('src="/js/analytics.js"');
    if (count < 0 || start < count) offenders.push(f);
    else if (!/data-goatcounter-settings="[^"]*no_onload&quot;:true/.test(html)) offenders.push(`${f}: counts on load`);
  }
  assert.deepEqual(offenders, []);
});

test('analytics.js counts only on the live host, and the 404 page records the missed path', () => {
  const home = readFileSync(join(DIST, 'index.html'), 'utf8');
  const notFound = readFileSync(join(DIST, '404.html'), 'utf8');
  assert.match(home, /src="\/js\/analytics\.js" data-host="www\.sammullins\.co\.uk"(?! data-not-found)/);
  assert.match(notFound, /src="\/js\/analytics\.js" data-host="www\.sammullins\.co\.uk" data-not-found/);
});

test('analytics.js respects Do Not Track and Global Privacy Control', () => {
  const js = read('public', 'js', 'analytics.js');
  assert.match(js, /doNotTrack === '1'/);
  assert.match(js, /globalPrivacyControl === true/);
  assert.match(js, /location\.hostname !== me\.dataset\.host/);
});
