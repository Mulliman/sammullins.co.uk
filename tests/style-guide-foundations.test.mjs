// Ticket 1302: the foundations page is generated from the theme. Every --color-* token declared in
// default.css must appear on the built page, so adding a token to the theme adds it to the guide.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST } from './helpers.mjs';

const THEME = join(ROOT, 'src/styles/themes/default.css');
const PAGE = join(DIST, 'style-guide/foundations/index.html');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('the foundations page is built', () => {
  assert.ok(existsSync(PAGE), 'dist/style-guide/foundations/index.html is missing');
});

test('every --color-* token in default.css appears on the foundations page', () => {
  const names = [...new Set([...readFileSync(THEME, 'utf8').matchAll(/(--color-[\w-]+)\s*:/g)].map((m) => m[1]))];
  assert.ok(names.length > 0, 'no --color-* tokens found in default.css');
  const html = readFileSync(PAGE, 'utf8');
  // The lookahead stops --color-text matching inside --color-text-muted.
  const missing = names.filter((name) => !new RegExp(`${escapeRe(name)}(?![\\w-])`).test(html));
  assert.deepEqual(missing, [], 'these tokens are in default.css but not on the foundations page');
});
