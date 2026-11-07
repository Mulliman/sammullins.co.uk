// Ticket 1306: the page structures guide has a section per page type, every example page builds, the
// front matter shown matches the example files, and no example URL is listed anywhere public (sitemap,
// llms.txt, the articles or archive listings, or any other page outside the style guide).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, walk, servedFile, resolve } from './helpers.mjs';

const PAGE = join(DIST, 'style-guide', 'page-structures', 'index.html');
const html = existsSync(PAGE) ? readFileSync(PAGE, 'utf8') : '';

const SECTIONS = ['article', 'note', 'software-product', 'docs-page', 'album', 'cv', 'index', '404', 'campaign'];

/** Each example, its built file, and the source file its front matter comes from. */
const EXAMPLES = [
  {
    url: '/articles/page-structure-example-article/',
    source: 'src/content/articles/page-structure-example-article.md',
  },
  { url: '/articles/page-structure-example-note/', source: 'src/content/articles/page-structure-example-note.md' },
  {
    url: '/software/page-structure-example-product/',
    source: 'src/content/software/page-structure-example-product.md',
  },
  {
    url: '/software/page-structure-example-product/page-structure-example-docs/',
    source: 'src/content/software/page-structure-example-product/page-structure-example-docs.md',
  },
  {
    url: '/software/page-structure-example-product/page-structure-example-docs-2/',
    source: 'src/content/software/page-structure-example-product/page-structure-example-docs-2.md',
  },
  {
    url: '/photography/photoshare21/page-structure-example-album/',
    source: 'src/content/albums/page-structure-example-album.md',
  },
  { url: '/page-structure-example-cv/', source: 'src/content/pages/page-structure-example-cv.md' },
  { url: '/page-structure-example-index/', source: 'src/content/pages/page-structure-example-index.md' },
  { url: '/page-structure-example-advent-day/', source: 'src/content/pages/page-structure-example-advent-day.md' },
];

/** Reverses Astro's HTML escaping in a code block's text. */
const unescapeHtml = (s) =>
  s
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const yamlBlocks = [...html.matchAll(/<code class="language-yaml"[^>]*>([\s\S]*?)<\/code>/g)].map((m) =>
  unescapeHtml(m[1]),
);

const frontMatterOf = (file) => {
  const match = readFileSync(join(ROOT, file), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  assert.ok(match, `${file} has no front matter`);
  return match[1];
};

test('the page structures guide is built', () => {
  assert.ok(existsSync(PAGE), 'dist/style-guide/page-structures/index.html is missing');
});

test('every page type has a section on the guide', () => {
  const missing = SECTIONS.filter((id) => !html.includes(`id="${id}"`));
  assert.deepEqual(missing, [], 'page types with no section');
});

test('each example page builds, and is noindex', () => {
  const problems = [];
  for (const { url } of EXAMPLES) {
    const file = servedFile(url);
    if (!file) {
      problems.push(`${url}: not built`);
      continue;
    }
    if (!readFileSync(file, 'utf8').includes('<meta name="robots" content="noindex"')) {
      problems.push(`${url}: not noindex`);
    }
  }
  assert.deepEqual(problems, []);
});

test('the 404 example (/404.html) is built', () => {
  assert.ok(servedFile('/404.html'), 'dist/404.html is missing');
});

test('the front matter on the guide matches the example files, character for character', () => {
  // The second docs page is shown as a link only; the guide copies the front matter of the first.
  const shown = EXAMPLES.map(({ source }) => source).filter((source) => !source.endsWith('-docs-2.md'));
  const missing = shown.filter((source) => {
    const fm = frontMatterOf(source).trimEnd();
    return !yamlBlocks.some((block) => block.includes(fm));
  });
  assert.deepEqual(missing, [], 'front matter shown on the guide differs from the example file');
});

test('every example page is linked from the guide, and every link on the guide resolves', () => {
  const broken = [...html.matchAll(/href="(\/[^"#]*)"/g)]
    .map((m) => m[1])
    .filter((path) => resolve(path).status !== 200);
  assert.deepEqual([...new Set(broken)], [], 'guide links that do not resolve');
  const notLinked = EXAMPLES.map(({ url }) => url).filter((url) => !html.includes(`href="${url}"`));
  assert.deepEqual(notLinked, [], 'example pages the guide does not link to');
});

test('no example URL appears in the sitemap or llms.txt', () => {
  const sitemaps = readdirSync(DIST).filter((f) => /^sitemap.*\.xml$/.test(f));
  assert.ok(sitemaps.length > 0, 'no sitemap in dist');
  const files = [...sitemaps.map((f) => join(DIST, f)), join(DIST, 'llms.txt')];
  const hits = files.filter((f) => existsSync(f) && readFileSync(f, 'utf8').includes('page-structure-example'));
  assert.deepEqual(hits, []);
});

test('no example URL appears on /articles/ or /archive/', () => {
  const hits = ['articles/index.html', 'archive/index.html'].filter((p) => {
    const file = join(DIST, p);
    return !existsSync(file) || readFileSync(file, 'utf8').includes('page-structure-example');
  });
  assert.deepEqual(hits, [], 'listing pages that are missing or mention an example');
});

test('no page outside the style guide links to or lists an example', () => {
  // An example page may name itself (canonical URL, breadcrumbs). Only the other pages are checked.
  const ownDirs = EXAMPLES.map(({ url }) => url);
  const hits = walk(DIST, (p) => p.endsWith('.html') || p.endsWith('.txt') || p.endsWith('.xml') || p.endsWith('.json'))
    .map((p) => p.slice(DIST.length).replace(/\\/g, '/'))
    .filter((rel) => !rel.startsWith('/style-guide/'))
    .filter((rel) => !ownDirs.some((url) => rel.startsWith(url)))
    .filter((rel) => readFileSync(join(DIST, rel), 'utf8').includes('page-structure-example'));
  assert.deepEqual(hits, []);
});
