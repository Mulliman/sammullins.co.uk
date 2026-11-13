// Ticket 906: scroll-driven animations must survive the CSS minifier.
// Lightning CSS (Vite's minifier) folds `animation: …` plus a following `animation-timeline` into one
// `animation` shorthand with the timeline inside it. Chrome rejects that declaration, so the animation
// silently never runs and the page still looks fine. The hero drift was broken this way for months.
// Rule of thumb: with a timeline, write longhands (animation-name, animation-timing-function, …).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, DIST, walk } from './helpers.mjs';

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Every innermost rule body (`{ … }` with no nested braces), with its selector text. */
function rules(css) {
  return [...stripComments(css).matchAll(/([^{}]*)\{([^{}]*)\}/g)].map((m) => ({
    selector: m[1].trim(),
    body: m[2],
  }));
}

/** The declarations of a rule body, in order, as [property, value]. */
function declarations(body) {
  return body
    .split(';')
    .map((d) => d.trim())
    .filter((d) => d.includes(':'))
    .map((d) => {
      const i = d.indexOf(':');
      return [d.slice(0, i).trim().toLowerCase(), d.slice(i + 1).trim()];
    });
}

/** Names given to scroll or view timelines, e.g. `view-timeline: --rl block` gives `--rl`. */
function timelineNames(css) {
  const re = /(?:scroll|view)-timeline(?:-name)?\s*:\s*([^;}]+)/g;
  return new Set([...stripComments(css).matchAll(re)].flatMap((m) => m[1].match(/--[\w-]+/g) ?? []));
}

/** Problems in built (minified) CSS: a timeline inside the shorthand, or a shorthand resetting an earlier timeline. */
export function builtProblems(css) {
  const names = timelineNames(css);
  const out = [];
  for (const { selector, body } of rules(css)) {
    const decls = declarations(body);
    decls.forEach(([prop, value], i) => {
      if (prop !== 'animation') return;
      const named = (value.match(/--[\w-]+/g) ?? []).filter((n) => names.has(n));
      if (/\b(?:scroll|view)\(/.test(value) || named.length) {
        out.push(`${selector} { animation: ${value} } has a timeline inside the shorthand`);
      }
      if (decls.slice(0, i).some(([p]) => p === 'animation-timeline' || p === 'animation-range')) {
        out.push(`${selector}: \`animation\` after \`animation-timeline\`/\`animation-range\` resets them`);
      }
    });
  }
  return out;
}

/** Problems in source CSS: the `animation` shorthand and a timeline or range declared in the same rule. */
export function sourceProblems(css) {
  return rules(css)
    .filter(({ body }) => {
      const props = new Set(declarations(body).map(([p]) => p));
      return props.has('animation') && (props.has('animation-timeline') || props.has('animation-range'));
    })
    .map(
      ({ selector }) => `${selector}: uses the \`animation\` shorthand with \`animation-timeline\`/\`animation-range\``,
    );
}

/** The CSS of a source file: whole .css files, or the <style> blocks of an .astro file. */
function sourceCss(file) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.css')) return text;
  return [...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
}

test('the checks catch the minifier fold and its source pattern', () => {
  assert.equal(builtProblems('.a{animation:linear both hero-drift scroll()}').length, 1);
  assert.equal(builtProblems('.a{animation:1ms linear both shape-weight view(block)}').length, 1);
  assert.equal(builtProblems('.t{view-timeline:--rl block}.a{animation:1ms linear both fade --rl}').length, 1);
  assert.equal(builtProblems('.a{animation-timeline:scroll();animation:fade 1s}').length, 1);
  assert.deepEqual(
    builtProblems('.a{animation-name:hero-drift;animation-fill-mode:both;animation-timeline:scroll()}'),
    [],
  );
  assert.deepEqual(builtProblems('.a{animation:sig-settle .52s var(--ease) backwards}'), []);

  assert.equal(
    sourceProblems('@supports (x: y) { .a { animation: d linear both; animation-timeline: scroll(); } }').length,
    1,
  );
  assert.deepEqual(
    sourceProblems('.a { animation-name: d; animation-timeline: view(); animation-range: exit 0% exit 80%; }'),
    [],
  );
  assert.deepEqual(sourceProblems('.a { animation: d 1ms both; } .a { animation-timeline: view(); }'), []);
});

test(
  'built CSS has no `animation` shorthand carrying a scroll or view timeline',
  { skip: !existsSync(DIST) && 'run pnpm build first' },
  () => {
    const problems = walk(DIST, (p) => p.endsWith('.css')).flatMap((file) =>
      builtProblems(readFileSync(file, 'utf8')).map((p) => `${relative(DIST, file)}: ${p}`),
    );
    assert.deepEqual(
      problems,
      [],
      `Chrome drops these, so the animation never runs. Use longhands:\n${problems.join('\n')}`,
    );
  },
);

test('no source rule pairs the `animation` shorthand with `animation-timeline` or `animation-range`', () => {
  const files = walk(join(ROOT, 'src'), (p) => p.endsWith('.astro') || p.endsWith('.css'));
  const problems = files.flatMap((file) => sourceProblems(sourceCss(file)).map((p) => `${relative(ROOT, file)}: ${p}`));
  assert.deepEqual(
    problems,
    [],
    `The minifier folds these into a shorthand Chrome rejects. Use longhands:\n${problems.join('\n')}`,
  );
});
