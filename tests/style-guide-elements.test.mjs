// Ticket 1305: the elements page renders its code through the Markdown pipeline (Prism), with a
// class for every language the site's articles use, and a sample for every Prism token class the
// stylesheet styles.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST } from './helpers.mjs';

const PAGE = join(DIST, 'style-guide', 'elements', 'index.html');
const CSS = join(ROOT, 'src', 'styles', 'global.css');
const LANGUAGES = ['csharp', 'bash', 'powershell', 'js', 'html'];
// No grammar the site uses emits `symbol` (Prism's Ruby-style :symbol), so no sample can show it.
const NOT_SAMPLEABLE = new Set(['symbol']);

test('the elements page is built', () => {
  assert.ok(existsSync(PAGE), 'dist/style-guide/elements/index.html is missing');
});

test('fenced code is highlighted with Prism token spans', () => {
  const html = readFileSync(PAGE, 'utf8');
  assert.ok(html.includes('class="token'), 'no Prism token spans on the elements page');
});

for (const lang of LANGUAGES) {
  test(`the elements page has a fenced ${lang} sample`, () => {
    const html = readFileSync(PAGE, 'utf8');
    assert.ok(html.includes(`language-${lang}`), `no language-${lang} code block on the elements page`);
  });
}

test('every Prism token class styled in global.css appears in a code sample', () => {
  const html = readFileSync(PAGE, 'utf8');
  const classes = new Set([...html.matchAll(/class="token ([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  const styled = [...readFileSync(CSS, 'utf8').matchAll(/\.token\.([a-z-]+)/g)].map((m) => m[1]);
  const missing = [...new Set(styled)].filter((c) => !NOT_SAMPLEABLE.has(c) && !classes.has(c));
  assert.deepEqual(missing, [], `token classes with no sample on the elements page: ${missing.join(', ')}`);
});
