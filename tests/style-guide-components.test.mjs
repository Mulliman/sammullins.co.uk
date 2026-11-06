// Ticket 1304: the components page shows every block type in the schema, and every enum option of every
// block appears in its examples. The examples are validated by the block schema when the site builds
// (astro build fails on a bad example); here their rendered YAML is checked against the schema text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { DIST, ROOT, redirects } from './helpers.mjs';
import { parseSchema, enumOptions } from '../scripts/skills/schema-blocks.mjs';

const PAGE = join(DIST, 'style-guide', 'components', 'index.html');
const SOURCE = join(ROOT, 'src', 'content.config.ts');
const EXAMPLES = join(ROOT, 'src', 'content', 'style-guide', 'components.yaml');

const html = readFileSync(PAGE, 'utf8');
const { blocks, shared } = parseSchema(readFileSync(SOURCE, 'utf8'));

/** Reverses Astro's HTML escaping in a code block's text. */
const unescapeHtml = (s) =>
  s
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// One chunk of HTML per block section, keyed by block type.
const sectionHtml = new Map(
  html
    .split('<section class="sg-block"')
    .slice(1)
    .map((chunk) => [chunk.match(/aria-labelledby="block-(\w+)"/)?.[1], chunk]),
);

/** The YAML snippets of one block section, unescaped. */
const snippetsOf = (type) =>
  [...(sectionHtml.get(type) ?? '').matchAll(/<code class="language-yaml"[^>]*>([\s\S]*?)<\/code>/g)].map((m) =>
    unescapeHtml(m[1]),
  );

test('the components page is built', () => {
  assert.ok(existsSync(PAGE), 'dist/style-guide/components/index.html is missing');
});

test('every block type in the schema has a section on the page', () => {
  const missing = [...blocks.keys()].filter((type) => !html.includes(`id="block-${type}"`));
  assert.deepEqual(missing, [], 'block types with no section');
});

test('every example has its YAML, and the YAML starts with its block type', () => {
  const ids = readFileSync(EXAMPLES, 'utf8')
    .split('\n')
    .filter((l) => /^[A-Za-z][\w-]*:\s*$/.test(l));
  const examples = (html.match(/class="sg-example"/g) ?? []).length;
  assert.equal(examples, ids.length, 'every example in components.yaml is rendered on the page');
  assert.equal((html.match(/<code class="language-yaml"[^>]*>/g) ?? []).length, ids.length, 'one YAML snippet each');

  const bad = [];
  for (const type of blocks.keys()) {
    for (const snippet of snippetsOf(type)) {
      if (!new RegExp(`^type: ${type}$`, 'm').test(snippet.split('\n')[0] + '\n')) bad.push(type);
    }
  }
  assert.deepEqual(bad, [], 'snippets that do not start with their block type');
});

test('every enum option of every block appears in its examples', () => {
  const missing = [];
  for (const [type, fields] of blocks) {
    const yaml = snippetsOf(type).join('\n');
    for (const { key, values } of enumOptions(fields, shared)) {
      for (const value of values) {
        const re = new RegExp(`^\\s*${key}: "?${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"?\\s*$`, 'm');
        if (!re.test(yaml)) missing.push(`${type}.${key}: ${value}`);
      }
    }
  }
  assert.deepEqual(missing, [], 'enum options with no example');
});

test('/blocks-demo/* redirects to the components page, and the demo pages are gone', () => {
  const map = redirects();
  for (const from of [
    '/blocks-demo/text/',
    '/blocks-demo/media/',
    '/blocks-demo/lists/',
    '/blocks-demo/theme-christmas/',
  ]) {
    assert.deepEqual(map.get(from), { to: '/style-guide/components/', status: 301 }, from);
  }
  assert.ok(!existsSync(join(ROOT, 'src', 'content', 'pages', 'blocks-demo')), 'blocks-demo pages still exist');
});
