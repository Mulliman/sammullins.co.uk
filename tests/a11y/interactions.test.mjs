// Behaviour checks for the interactive pieces: the embed facade (309), the gallery lightbox (304)
// and the console secret (903). Runs against the built site, like axe.test.mjs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serve } from './server.mjs';

const DEMO = '/blocks-demo/media/';
let browser, srv;
before(async () => {
  srv = await serve();
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  srv?.server.close();
});

/** A page that records, and blocks, every request that leaves the local server. */
async function isolatedPage(ctx) {
  const page = await ctx.newPage();
  const external = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith(srv.origin)) return route.continue();
    external.push(url);
    return route.abort();
  });
  return { page, external };
}

test('embed: no requests to Google or YouTube before the click, and the iframe has a title', async () => {
  const ctx = await browser.newContext();
  const { page, external } = await isolatedPage(ctx);
  await page.goto(srv.origin + DEMO, { waitUntil: 'networkidle' });
  assert.deepEqual(
    external.filter((u) => /google|youtube|ytimg|gstatic/.test(u)),
    [],
    'third-party requests before the click',
  );
  assert.equal(await page.locator('[data-embed] iframe').count(), 0, 'no iframe before the click');

  await page.locator('[data-embed] .embed__link').first().click();
  const iframe = page.locator('[data-embed] iframe').first();
  await iframe.waitFor({ state: 'attached' });
  assert.match((await iframe.getAttribute('title')) ?? '', /\S/, 'iframe needs a title');
  assert.match((await iframe.getAttribute('src')) ?? '', /^https:\/\/www\.youtube-nocookie\.com\//);
  await ctx.close();
});

test('gallery: without JS every thumbnail links to a full-size image', async () => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(srv.origin + DEMO, { waitUntil: 'load' });
  const hrefs = await page.locator('[data-gallery] a.gallery__link').evaluateAll((as) => as.map((a) => a.href));
  assert.ok(hrefs.length > 0, 'expected gallery links');
  for (const href of hrefs) {
    const res = await page.request.get(href);
    assert.equal(res.status(), 200, href);
    assert.match(res.headers()['content-type'] ?? '', /^image\//, href);
  }
  await ctx.close();
});

test('gallery: the lightbox works by keyboard and passes axe', async () => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(srv.origin + DEMO, { waitUntil: 'load' });
  const first = page.locator('[data-gallery] a.gallery__link').first();
  await first.focus();
  await page.keyboard.press('Enter');
  const dialog = page.locator('dialog[data-lightbox][open]').first();
  await dialog.waitFor();
  const count = dialog.locator('.lightbox__count');
  const before = await count.textContent();
  await page.keyboard.press('ArrowRight');
  assert.notEqual(await count.textContent(), before, 'ArrowRight moves to the next image');

  const res = await new AxeBuilder({ page })
    .include('dialog[data-lightbox][open]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  assert.deepEqual(
    res.violations.map((v) => `${v.id}: ${v.help}`),
    [],
  );

  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' }).catch(() => {});
  assert.equal(await page.locator('dialog[data-lightbox][open]').count(), 0, 'Escape closes the lightbox');
  assert.ok(await first.evaluate((a) => a === document.activeElement), 'focus returns to the thumbnail');
  await ctx.close();
});

test('gallery: its script is at most 5 KB gzipped', async () => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(srv.origin + DEMO, { waitUntil: 'load' });
  const scripts = await page.evaluate(async () => {
    const out = [];
    for (const s of document.querySelectorAll('script[type="module"]')) {
      const code = s.src ? await (await fetch(s.src)).text() : s.textContent;
      if (code.includes('data-lightbox')) out.push(code);
    }
    return out;
  });
  assert.equal(scripts.length, 1, 'expected one gallery script');
  const size = gzipSync(scripts[0]).length;
  assert.ok(size <= 5 * 1024, `gallery script is ${size} bytes gzipped`);
  await ctx.close();
});

test('console secret: greets once, logs no errors, and unlock persists for the session', async () => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const logs = [];
  const errors = [];
  page.on('console', (m) => (m.type() === 'error' ? errors.push(m.text()) : logs.push(m.text())));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(srv.origin + '/', { waitUntil: 'load' });
  assert.equal(logs.filter((l) => l.includes('/humans.txt')).length, 1, 'one greeting per page load');

  const result = await page.evaluate(() => window.unlock('pelican'));
  assert.match(result, /^Unlocked/);
  assert.equal(await page.evaluate(() => document.documentElement.dataset.secret), 'terminal');
  await page.goto(srv.origin + '/cv/', { waitUntil: 'load' });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.secret), 'terminal', 'persists');
  assert.deepEqual(errors, []);
  await ctx.close();
});
