// Ticket 805: hygiene rules that must never regress. The rules live in hygiene-rules.mjs,
// and hygiene-rules.test.mjs proves each one fails when violated.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, relative } from 'node:path';
import sharp from 'sharp';
import { ROOT, DIST, walk } from './helpers.mjs';
import {
  GMAIL,
  GOOGLE_TRACKING_OR_FONTS,
  UIKIT_CLASS,
  INLINE_STYLE,
  unsafeSetHtml,
  imgsWithoutAlt,
  unsafeBlankTargets,
  hasCspMeta,
  hasExif,
} from './hygiene-rules.mjs';

const html = () => walk(DIST, (p) => p.endsWith('.html'));
const srcFiles = () => [
  ...walk(join(ROOT, 'src'), (p) => /\.(astro|ts|mjs|md|yaml|json|css)$/.test(p)),
  ...walk(join(ROOT, 'public'), (p) => /\.(txt|html|js|json)$/.test(p)),
];
const rel = (p) => relative(ROOT, p).split(/[\\/]/).join('/');
const read = (f) => readFileSync(f, 'utf8');
const grepFiles = (files, re) => files.filter((f) => re.test(read(f))).map(rel);

test('no personal gmail address anywhere', () => {
  assert.deepEqual(grepFiles([...srcFiles(), ...html()], GMAIL), []);
});

test('no Google Analytics, Tag Manager or Google Fonts', () => {
  assert.deepEqual(grepFiles([...srcFiles(), ...html()], GOOGLE_TRACKING_OR_FONTS), []);
});

test('no legacy UIkit classes in output', () => {
  assert.deepEqual(grepFiles(html(), UIKIT_CLASS), []);
});

test('no inline style attributes in output HTML (CSP style-src self)', () => {
  assert.deepEqual(grepFiles(html(), INLINE_STYLE), []);
});

test('set:html is only used with sanitised helpers or trusted assets', () => {
  const offenders = walk(join(ROOT, 'src'), (p) => p.endsWith('.astro')).flatMap((f) =>
    unsafeSetHtml(read(f)).map((line) => `${rel(f)}: ${line.trim()}`),
  );
  assert.deepEqual(offenders, []);
});

test('every page has a CSP meta tag and a Markdown twin', () => {
  const missing = [];
  for (const f of html()) {
    if (f.endsWith('404.html')) continue;
    if (!hasCspMeta(read(f))) missing.push(`${rel(f)}: no CSP`);
    // Guide pages (src/pages/style-guide/) are .astro routes, not content, so they have no Markdown twin.
    // They are unlisted (ticket 1301); the CSP check above still applies to them.
    if (f.endsWith('index.html') && !rel(f).startsWith('dist/style-guide/')) {
      try {
        readFileSync(f.replace(/index\.html$/, 'index.md'));
      } catch {
        missing.push(`${rel(f)}: no index.md twin`);
      }
    }
  }
  assert.deepEqual(missing, []);
});

test('every <img> has an alt attribute', () => {
  const offenders = html().flatMap((f) => imgsWithoutAlt(read(f)).map((tag) => `${rel(f)}: ${tag.slice(0, 100)}`));
  assert.deepEqual(offenders, []);
});

test('external links that open new tabs are safe', () => {
  assert.deepEqual(
    html()
      .filter((f) => unsafeBlankTargets(read(f)).length > 0)
      .map(rel),
    [],
  );
});

test('no committed image carries EXIF (GPS or otherwise)', async () => {
  const images = walk(join(ROOT, 'src', 'assets'), (p) => /\.(avif|jpe?g|png|webp|tiff?)$/i.test(p));
  const offenders = [];
  for (const f of images) if (hasExif(await sharp(f).metadata())) offenders.push(rel(f));
  assert.deepEqual(offenders, []);
});

test('built HTML passes html-validate', () => {
  const r = spawnSync('pnpm', ['exec', 'html-validate', 'dist/**/*.html'], {
    cwd: ROOT,
    encoding: 'utf8',
    shell: true,
  });
  assert.equal(r.status, 0, `${r.stdout}\n${r.stderr}`);
});

test('no colour literals outside src/styles/themes (use theme tokens)', async () => {
  const { COLOUR_ALLOWED, colourLiterals } = await import('./hygiene-rules.mjs');
  const files = walk(join(ROOT, 'src'), (p) => /\.(astro|css|ts|tsx|js|mjs)$/.test(p)).filter(
    (f) => !COLOUR_ALLOWED.test(rel(f)),
  );
  const offenders = files.flatMap((f) =>
    colourLiterals(read(f)).map(({ line, text }) => `${rel(f)}:${line}: ${text.slice(0, 100)}`),
  );
  assert.deepEqual(
    offenders,
    [],
    'Colours belong in src/styles/themes/ (see its README). Use a token such as var(--color-text).',
  );
});
