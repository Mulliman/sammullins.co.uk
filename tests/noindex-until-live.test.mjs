// Ticket 701: every Netlify build that isn't production on the live domain sends X-Robots-Tag: noindex.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import noindexUntilLive from '../integrations/noindex-until-live.mjs';

const liveUrl = 'https://www.sammullins.co.uk';
const logger = { info() {}, warn() {} };

function build(env) {
  const out = mkdtempSync(join(tmpdir(), 'noindex-'));
  const saved = { NETLIFY: process.env.NETLIFY, CONTEXT: process.env.CONTEXT, URL: process.env.URL };
  for (const k of Object.keys(saved)) delete process.env[k];
  Object.assign(process.env, env);
  try {
    noindexUntilLive({ liveUrl }).hooks['astro:build:done']({ dir: pathToFileURL(out + '/'), logger });
    const file = join(out, '_headers');
    return existsSync(file) ? readFileSync(file, 'utf8') : null;
  } finally {
    for (const [k, v] of Object.entries(saved)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    rmSync(out, { recursive: true, force: true });
  }
}

test('production on *.netlify.app is noindex', () => {
  const headers = build({ NETLIFY: 'true', CONTEXT: 'production', URL: 'https://sammullinscouk.netlify.app' });
  assert.match(headers, /^\/\*\n {2}X-Robots-Tag: noindex, nofollow$/m);
});

test('deploy previews and branch deploys are noindex even with the live URL', () => {
  for (const CONTEXT of ['deploy-preview', 'branch-deploy']) {
    assert.ok(build({ NETLIFY: 'true', CONTEXT, URL: liveUrl }), CONTEXT);
  }
});

test('production on the live domain is indexable', () => {
  assert.equal(build({ NETLIFY: 'true', CONTEXT: 'production', URL: liveUrl }), null);
  assert.equal(build({ NETLIFY: 'true', CONTEXT: 'production', URL: liveUrl + '/' }), null);
});

test('the apex domain is not the live URL (www is primary)', () => {
  assert.ok(build({ NETLIFY: 'true', CONTEXT: 'production', URL: 'https://sammullins.co.uk' }));
});

test('local and CI builds are left alone', () => {
  assert.equal(build({}), null);
});
