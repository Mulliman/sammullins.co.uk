// Ticket 1307 (kept when visual regression was dropped): axe (WCAG 2.2 AA, same tags as axe.test.mjs) on every ready style guide page in every
// page theme, in light and dark. The page theme and mode are set the way the switcher sets them.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { styleGuideReadyPaths, pageThemeNames } from '../helpers.mjs';
import { serve } from './server.mjs';

const pages = styleGuideReadyPaths();
const themes = pageThemeNames();

let browser, srv;
before(async () => {
  srv = await serve();
  browser = await chromium.launch();
});
after(async () => {
  await browser?.close();
  srv?.server.close();
});

for (const mode of ['light', 'dark']) {
  for (const theme of themes) {
    test(`axe WCAG 2.2 AA on guide pages: page theme ${theme}, ${mode}`, async () => {
      const ctx = await browser.newContext({ colorScheme: mode, reducedMotion: 'reduce' });
      const failures = [];
      for (const path of pages) {
        const page = await ctx.newPage();
        await page.goto(`${srv.origin}${path}?${new URLSearchParams({ mode, theme })}`, { waitUntil: 'load' });
        const res = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        for (const v of res.violations)
          failures.push(`${path} [${v.id}] ${v.help} (${v.nodes.length}) e.g. ${v.nodes[0]?.target.join(' ')}`);
        await page.close();
      }
      await ctx.close();
      assert.deepEqual(failures, [], `\n${failures.join('\n')}`);
    });
  }
}
