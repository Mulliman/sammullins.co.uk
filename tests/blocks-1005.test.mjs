// Ticket 1005: the blocks the PM desk page needed. Checked on the style guide's components page,
// which renders every example in src/content/style-guide/components.yaml.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DIST } from './helpers.mjs';

const html = readFileSync(join(DIST, 'style-guide', 'components', 'index.html'), 'utf8');
const between = (from, to) => html.slice(html.indexOf(from), to ? html.indexOf(to, html.indexOf(from)) : undefined);

test('disclosure: closed by default, open when asked, and done is said in words', () => {
  const details = [...html.matchAll(/<details\b[^>]*class="[^"]*\bdisclosure\b[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.ok(details.length >= 2, 'both disclosure examples render as <details>');
  assert.ok(
    details.some((d) => !/\bopen\b/.test(d.replace(/class="[^"]*"/, ''))),
    'one is closed',
  );
  assert.ok(
    details.some((d) => /\bopen\b/.test(d.replace(/class="[^"]*"/, ''))),
    'one is open',
  );
  const done = between('disclosure--done', '</summary>');
  assert.match(
    done,
    /class="badge badge--tip[^"]*"[^>]*>Done</,
    'a done disclosure carries a "Done" badge, not only a strikethrough',
  );
});

test('badges: every tone renders, and each badge is text', () => {
  for (const tone of ['neutral', 'note', 'tip', 'warning']) {
    assert.match(
      html,
      new RegExp(`class="badge badge--${tone}[^"]*"[^>]*>[^<]+<`),
      `a ${tone} badge with a text label`,
    );
  }
});

test('steps: an ordered list, and a step with code gets the code figure and its Copy button', () => {
  const steps = between('class="steps', '</ol>');
  assert.match(steps, /<ol class="steps__list/);
  assert.equal((steps.match(/<li class="steps__item/g) ?? []).length, 3);
  assert.equal((steps.match(/data-code/g) ?? []).length, 2, 'two of the three steps have code');
  assert.match(steps, /data-copy[^>]*>Copy</);
  assert.match(steps, /code__filename[^>]*>terminal</, 'the filename is kept');
});

test('fenced code in block Markdown gets the same figure and Copy button', () => {
  const prose = between('Fenced code in block Markdown', '</table>');
  assert.match(prose, /<figure class="code" data-code>/);
  assert.match(prose, /<code class="language-bash">pnpm build<\/code>/);
});

test('tables in block Markdown carry their column names for the phone layout', () => {
  const table = between('<table class="table-stack">', '</table>');
  assert.match(table, /<td data-label="Ticket">003<\/td>/);
  assert.match(table, /<td data-label="Recommendation">/);
});

test('code regions have unique names (html-validate unique-landmark)', () => {
  const labels = [...html.matchAll(/<pre[^>]*role="region"[^>]*aria-label="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(labels.length > 0);
  assert.equal(
    new Set(labels).size,
    labels.length,
    `duplicate labels: ${labels.filter((l, i) => labels.indexOf(l) !== i)}`,
  );
});

test('article body code gets the shared figure, keeping its Prism tokens (ticket 313)', () => {
  const article = readFileSync(join(DIST, 'articles', '5-cool-things-i-used-to-build-xstatic', 'index.html'), 'utf8');
  const figures = [...article.matchAll(/<figure class="code" data-code>([\s\S]*?)<\/figure>/g)].map((m) => m[1]);
  assert.ok(figures.length >= 2, 'the csharp samples are figures');
  for (const f of figures) {
    assert.match(f, /data-copy[^>]*>Copy</);
    assert.match(f, /<pre class="language-\w+" tabindex="0" role="region" aria-label="Code \(\w+\), /);
    assert.match(f, /<span class="token /, 'Prism highlighting survives');
  }
  assert.doesNotMatch(article, /<pre class="language-[^"]*" data-language/, 'no bare Prism pre is left');
});
