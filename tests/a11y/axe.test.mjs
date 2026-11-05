// Ticket 802: axe (WCAG 2.2 AA) on every built page, in light and dark themes, plus a 320px overflow check.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { relative } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { DIST, walk } from '../helpers.mjs';
import { serve } from './server.mjs';

const pages = walk(DIST, (p) => p.endsWith('index.html')).map(
  (p) =>
    '/' +
    relative(DIST, p)
      .split(/[\\/]/)
      .join('/')
      .replace(/index\.html$/, ''),
);

let browser, srv;
before(async () => {
  srv = await serve();
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  srv?.server.close();
});

for (const scheme of ['light', 'dark']) {
  test(`axe WCAG 2.2 AA (${scheme})`, async () => {
    const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: 'reduce' });
    const failures = [];
    for (const path of pages) {
      const page = await ctx.newPage();
      const csp = [];
      page.on('console', (m) => {
        if (/Content Security Policy/i.test(m.text())) csp.push(m.text());
      });
      await page.goto(srv.origin + path, { waitUntil: 'load' });
      const res = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      for (const v of res.violations)
        failures.push(`${path} [${v.id}] ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target.join(' ')}`);
      for (const c of csp) failures.push(`${path} [csp] ${c.slice(0, 160)}`);
      await page.close();
    }
    await ctx.close();
    assert.deepEqual(failures, [], `\n${failures.join('\n')}`);
  });
}

test('no horizontal scroll at 320px', async () => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const failures = [];
  for (const path of pages) {
    const page = await ctx.newPage();
    await page.goto(srv.origin + path, { waitUntil: 'load' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 1) failures.push(`${path}: overflows by ${over}px`);
    await page.close();
  }
  await ctx.close();
  assert.deepEqual(failures, []);
});
