// On-demand visual comparison (replaces visual regression in CI, ticket 1307).
// For changes that should look identical, or to see exactly what a change touched:
//
//   pnpm build && pnpm compare:base      screenshot the current build into .compare/base/
//   (make your change)
//   pnpm build && pnpm compare           screenshot again and report what moved
//
// Pages: the style guide plus key pages, in light and dark at 1280px. Add --all for every built page.
// Nothing here is committed (.compare/ is gitignored), and it never fails a build: it reports.
import { mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { ROOT, DIST, walk, styleGuideReadyPaths } from '../../tests/helpers.mjs';
import { serve } from '../../tests/a11y/server.mjs';

const args = process.argv.slice(2);
const mode = args.includes('--base') ? 'base' : 'current';
const all = args.includes('--all');
const OUT = join(ROOT, '.compare');
const KEY_PAGES = ['/', '/articles/5-cool-things-i-used-to-build-xstatic/', '/cv/', '/software/', '/404.html'];

if (!existsSync(DIST)) {
  console.error('No dist/. Run pnpm build first.');
  process.exit(1);
}

const pages = all
  ? walk(DIST, (p) => p.endsWith('index.html')).map(
      (p) =>
        '/' +
        relative(DIST, p)
          .split(/[\\/]/)
          .join('/')
          .replace(/index\.html$/, ''),
    )
  : [...styleGuideReadyPaths(), ...KEY_PAGES];

const dir = join(OUT, mode);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const srv = await serve();
const browser = await chromium.launch();
const fileFor = (scheme, path) => `${scheme}${path.replace(/[^a-z0-9]+/gi, '_')}.png`;

for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: scheme,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  for (const path of pages) {
    await page.goto(srv.origin + path, { waitUntil: 'networkidle' });
    // Make the page settle the same way every time: every image loaded and decoded up front (lazy
    // images re-flow by fractions of a pixel otherwise), and sticky elements pinned in place (a full-page
    // screenshot otherwise catches them wherever the last scroll left them). CSSOM writes are allowed by
    // the CSP; style attributes in the markup are not.
    await page.evaluate(async () => {
      const imgs = [...document.images];
      for (const img of imgs) img.loading = 'eager';
      await Promise.all(
        imgs.map((img) =>
          (img.complete
            ? img.decode()
            : new Promise((r) => img.addEventListener('load', r, { once: true })).then(() => img.decode())
          ).catch(() => {}),
        ),
      );
      for (const el of document.querySelectorAll('*')) {
        if (getComputedStyle(el).position === 'sticky') el.style.position = 'static';
      }
      await document.fonts.ready;
      scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(dir, fileFor(scheme, path)), fullPage: true });
  }
  await ctx.close();
}
await browser.close();
srv.server.close();
console.log(`Saved ${pages.length * 2} screenshots to ${relative(ROOT, dir)}/`);

if (mode === 'base') process.exit(0);

// Compare current against base.
const base = join(OUT, 'base');
if (!existsSync(base)) {
  console.error('No baseline. Run pnpm compare:base on the build before your change.');
  process.exit(1);
}
const diffs = join(OUT, 'diff');
rmSync(diffs, { recursive: true, force: true });
mkdirSync(diffs, { recursive: true });

const rows = [];
for (const f of readdirSync(dir)) {
  if (!existsSync(join(base, f))) {
    rows.push([f, 'new page, no baseline']);
    continue;
  }
  const [a, b] = [sharp(join(base, f)), sharp(join(dir, f))];
  const [ma, mb] = await Promise.all([a.metadata(), b.metadata()]);
  // Very tall pages with many images (the components guide) can drift by a pixel or two in height
  // between runs. Compare the rows they share and say so, rather than reporting the whole page.
  const drift = mb.height - ma.height;
  if (ma.width !== mb.width || Math.abs(drift) > 2) {
    rows.push([f, `size changed ${ma.width}x${ma.height} to ${mb.width}x${mb.height}`]);
    continue;
  }
  const height = Math.min(ma.height, mb.height);
  const crop = (img) => img.extract({ left: 0, top: 0, width: ma.width, height }).ensureAlpha().raw().toBuffer();
  const [ra, rb] = await Promise.all([crop(a), crop(b)]);
  const note = drift ? ` (height drifted ${drift}px, usually noise; compared the shared ${height}px)` : '';
  const out = Buffer.from(rb);
  let changed = 0;
  let box = [Infinity, Infinity, -1, -1];
  for (let i = 0; i < ra.length; i += 4) {
    if (ra[i] !== rb[i] || ra[i + 1] !== rb[i + 1] || ra[i + 2] !== rb[i + 2]) {
      changed++;
      const p = i / 4;
      const x = p % ma.width;
      const y = Math.floor(p / ma.width);
      box = [Math.min(box[0], x), Math.min(box[1], y), Math.max(box[2], x), Math.max(box[3], y)];
      out[i] = 255;
      out[i + 1] = 0;
      out[i + 2] = 255;
      out[i + 3] = 255;
    }
  }
  if (changed) {
    await sharp(out, { raw: { width: ma.width, height, channels: 4 } })
      .png()
      .toFile(join(diffs, f));
    rows.push([f, `${changed} px changed, in x ${box[0]} to ${box[2]}, y ${box[1]} to ${box[3]}${note}`]);
  } else if (drift) {
    rows.push([f, `no pixel changes${note}`]);
  }
}
for (const f of readdirSync(base)) if (!existsSync(join(dir, f))) rows.push([f, 'page gone']);

if (rows.length === 0) console.log('No visual changes.');
else {
  console.log(`${rows.length} screenshot(s) changed (diff images, changes in magenta, in .compare/diff/):`);
  for (const [f, what] of rows) console.log(`  ${f}: ${what}`);
}
