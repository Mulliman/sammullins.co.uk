// Ticket 805: every hygiene rule fails when it is violated (and passes clean input).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import sharp from 'sharp';
import { ROOT } from './helpers.mjs';
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

test('gmail rule', () => {
  assert.ok(GMAIL.test('mail me at someone@gmail.com'));
  assert.ok(!GMAIL.test('hello@sammullins.co.uk'));
});

test('Google tracking and fonts rule', () => {
  for (const bad of [
    '<script src="https://www.googletagmanager.com/gtag/js"></script>',
    "gtag('config', 'UA-1')",
    '<link href="https://fonts.googleapis.com/css2?family=Lato">',
    'https://fonts.gstatic.com/s/lato.woff2',
    'https://www.google-analytics.com/analytics.js',
  ])
    assert.ok(GOOGLE_TRACKING_OR_FONTS.test(bad), bad);
  assert.ok(!GOOGLE_TRACKING_OR_FONTS.test('<link href="/fonts/mona-sans.woff2">'));
});

test('UIkit class rule', () => {
  assert.ok(UIKIT_CLASS.test('<div class="section uk-card">'));
  assert.ok(!UIKIT_CLASS.test('<div class="card duke-box">'));
});

test('inline style rule', () => {
  assert.ok(INLINE_STYLE.test('<div class="x" style="color:red">'));
  assert.ok(!INLINE_STYLE.test('<stop offset="0" style="stop-color:#000">'));
  assert.ok(!INLINE_STYLE.test('<div class="x">'));
});

test('set:html rule', () => {
  assert.deepEqual(unsafeSetHtml('<div set:html={md(text)} />'), []);
  assert.equal(unsafeSetHtml('<div set:html={userInput} />').length, 1);
});

test('img alt rule', () => {
  assert.equal(imgsWithoutAlt('<img src="a.webp">').length, 1);
  assert.deepEqual(imgsWithoutAlt('<img src="a.webp" alt="">'), []);
  assert.deepEqual(imgsWithoutAlt('<img src="a.webp" alt>'), []);
});

test('target=_blank rule', () => {
  assert.equal(unsafeBlankTargets('<a href="https://x.test" target="_blank">').length, 1);
  assert.deepEqual(unsafeBlankTargets('<a href="https://x.test" target="_blank" rel="noopener">'), []);
});

test('CSP meta rule', () => {
  assert.ok(hasCspMeta('<meta http-equiv="content-security-policy" content="default-src \'self\'">'));
  assert.ok(!hasCspMeta('<meta charset="utf-8">'));
});

test('EXIF rule', async () => {
  const blank = { create: { width: 4, height: 4, channels: 3, background: '#fff' } };
  const withExif = await sharp(blank)
    .jpeg()
    .withExif({ IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '50/1 43/1 0/1' } })
    .toBuffer();
  const clean = await sharp(blank).jpeg().toBuffer();
  assert.ok(hasExif(await sharp(withExif).metadata()));
  assert.ok(!hasExif(await sharp(clean).metadata()));
});

test('html-validate rule rejects broken markup', () => {
  const dir = mkdtempSync(join(tmpdir(), 'html-validate-'));
  try {
    const bad = join(dir, 'bad.html');
    writeFileSync(
      bad,
      '<!doctype html><html lang="en"><head><title>x</title></head><body><p>E.g. AddTransient<Netlify404Action>();</p></body></html>',
    );
    const r = spawnSync('pnpm', ['exec', 'html-validate', JSON.stringify(bad)], {
      cwd: ROOT,
      encoding: 'utf8',
      shell: true,
    });
    assert.notEqual(r.status, 0, 'expected html-validate to fail');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('colour rule', async () => {
  const { colourLiterals, COLOUR_ALLOWED } = await import('./hygiene-rules.mjs');
  for (const bad of [
    'color: #fff;',
    'background: #1c1c1c;',
    'border: 1px solid #333333aa;',
    'background: rgb(0 0 0 / 0.5);',
    'color: hsl(10 50% 50%);',
    'color: oklch(70% 0.1 200);',
    'color: white;',
    'border-left: 2px solid black;',
    '<rect fill="white" />',
    "console.log('%chi', 'color:#da7d03')",
  ])
    assert.equal(colourLiterals(bad).length, 1, bad);
  for (const ok of [
    'color: var(--color-text);',
    'background: transparent;',
    'fill: currentColor;',
    'white-space: nowrap;',
    '<a href="#add">',
    'fill="url(#_Linear1)"',
    '<a href={`#${h.slug}`}>',
    'border-left: 4px solid var(--brand-orange);',
  ])
    assert.deepEqual(colourLiterals(ok), [], ok);
  assert.ok(COLOUR_ALLOWED.test('src/styles/themes/christmas.css'));
  assert.ok(!COLOUR_ALLOWED.test('src/blocks/Hero.astro'));
});

test('fixed spacing rule', async () => {
  const { fixedSpacing } = await import('./hygiene-rules.mjs');
  assert.equal(fixedSpacing('  padding: 30px;').length, 1);
  assert.equal(fixedSpacing('  --gap: 15px;').length, 1);
  assert.equal(fixedSpacing('  margin: 0 auto 12.5px;').length, 1);
  assert.equal(fixedSpacing('  padding: var(--space-s);').length, 0);
  assert.equal(fixedSpacing('  border: 10px solid var(--color-frame);').length, 0, 'borders are not spacing');
  assert.equal(fixedSpacing('  left: calc(0.5rem - 1px);').length, 0, 'hairline nudges are allowed');
  assert.equal(fixedSpacing('  top: -0.375rem;').length, 0);
});

test('type literal rule', async () => {
  const { typeLiterals } = await import('./hygiene-rules.mjs');
  assert.equal(typeLiterals('  font-size: 0.8rem;').length, 1);
  assert.equal(typeLiterals('  font-size: 14px;').length, 1);
  assert.equal(typeLiterals('  line-height: 1.3;').length, 1);
  assert.equal(typeLiterals('  line-height: 2.75rem;').length, 1);
  assert.equal(typeLiterals('  font-size: var(--step-1);').length, 0);
  assert.equal(typeLiterals('  font-size: 0.875em;').length, 0, 'relative sizes are fine');
  assert.equal(typeLiterals('  line-height: var(--leading-body);').length, 0);
  assert.equal(typeLiterals('  line-height: inherit;').length, 0);
});
