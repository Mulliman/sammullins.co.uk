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
