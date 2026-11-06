// Ticket 1303: the themes page is generated from the theme files. Every page theme in pageThemes
// appears on the page, and the christmas diff lists exactly the tokens christmas.css sets.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, DIST } from './helpers.mjs';

const PAGE = join(DIST, 'style-guide/themes/index.html');
const INDEX_TS = join(ROOT, 'src/styles/themes/index.ts');
const CHRISTMAS = join(ROOT, 'src/styles/themes/christmas.css');

/** The names in `export const pageThemes = [...]`, read as text so the list stays the one source of truth. */
function pageThemeNames() {
  const src = readFileSync(INDEX_TS, 'utf8');
  const body = /pageThemes\s*=\s*\[([^\]]*)\]/.exec(src)?.[1] ?? '';
  return [...body.matchAll(/'([\w-]+)'/g)].map((m) => m[1]);
}

/** The HTML of one theme's section on the page (from its id to the closing tag). */
function section(html, name) {
  const start = html.indexOf(`id="theme-${name}"`);
  if (start === -1) return '';
  const end = html.indexOf('</section>', start);
  return html.slice(start, end === -1 ? undefined : end);
}

/**
 * Token names in the diff table's row headers, e.g. <th scope="row" ...><code ...>--brand-orange</code></th>.
 * Astro adds data-astro-cid attributes, so the attributes are matched loosely.
 */
const diffTokens = (html) =>
  new Set([...html.matchAll(/<th[^>]*scope="row"[^>]*>\s*<code[^>]*>(--[\w-]+)<\/code>\s*<\/th>/g)].map((m) => m[1]));

test('the themes page is built', () => {
  assert.ok(existsSync(PAGE), 'dist/style-guide/themes/index.html is missing');
});

test('pageThemes is readable and not empty', () => {
  const names = pageThemeNames();
  assert.ok(names.length > 0, 'no page themes found in src/styles/themes/index.ts');
});

test('every name in pageThemes appears on the themes page, in the switcher and in its own section', () => {
  const html = readFileSync(PAGE, 'utf8');
  const missing = pageThemeNames().filter(
    (name) => !html.includes(`data-page-theme-option="${name}"`) || !html.includes(`id="theme-${name}"`),
  );
  assert.deepEqual(missing, [], 'these page themes are missing from the themes page');
});

test('every token set in christmas.css appears in the christmas diff, and nothing else does', () => {
  const css = readFileSync(CHRISTMAS, 'utf8');
  const set = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
  assert.ok(set.size > 0, 'no custom properties found in christmas.css');
  const html = readFileSync(PAGE, 'utf8');
  const shown = diffTokens(section(html, 'christmas'));
  assert.deepEqual(
    [...set].filter((t) => !shown.has(t)),
    [],
    'these tokens are set in christmas.css but missing from the christmas diff',
  );
  assert.deepEqual(
    [...shown].filter((t) => !set.has(t)),
    [],
    'the christmas diff lists tokens that christmas.css does not set',
  );
});

test('every page theme has a contrast table', () => {
  const html = readFileSync(PAGE, 'utf8');
  const missing = pageThemeNames().filter((name) => !section(html, name).includes('Text on background'));
  assert.deepEqual(missing, []);
});
