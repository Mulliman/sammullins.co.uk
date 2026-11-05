// Ticket 805: hygiene rules that must never regress.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, DIST, walk } from './helpers.mjs';

const html = () => walk(DIST, (p) => p.endsWith('.html'));
const srcFiles = () => [
  ...walk(join(ROOT, 'src'), (p) => /\.(astro|ts|mjs|md|yaml|json|css)$/.test(p)),
  ...walk(join(ROOT, 'public'), (p) => /\.(txt|html|js|json)$/.test(p)),
];
const rel = (p) => relative(ROOT, p).split('\').join('/');

function grepFiles(files, re) {
  return files.filter((f) => re.test(readFileSync(f, 'utf8'))).map(rel);
}

test('no personal gmail address anywhere', () => {
  assert.deepEqual(grepFiles([...srcFiles(), ...html()], /@gmail\.com/i), []);
});

test('no Google Analytics, Tag Manager or Google Fonts', () => {
  assert.deepEqual(grepFiles([...srcFiles(), ...html()], /googletagmanager|google-analytics|gtag\(|fonts\.googleapis|fonts\.gstatic/i), []);
});

test('no legacy UIkit classes in output', () => {
  assert.deepEqual(grepFiles(html(), /class="[^"]*\buk-[a-z]/), []);
});

test('no inline style attributes in output HTML (CSP style-src self)', () => {
  const offenders = [];
  for (const f of html()) {
    const s = readFileSync(f, 'utf8');
    const m = s.match(/<(?!svg|path|g|stop|linearGradient)[a-z][\w-]*\s[^>]*\sstyle="/i);
    if (m) offenders.push(`${rel(f)}: ${m[0].slice(0, 80)}`);
  }
  assert.deepEqual(offenders, []);
});

test('set:html is only used with sanitised helpers or trusted assets', () => {
  const allowed = /set:html=\{(md\(|mdInline\(|logo\}|JSON\.stringify\(|html\}|bodyHtml|leadHtml|textHtml|quoteHtml|captionHtml)/;
  const offenders = [];
  for (const f of walk(join(ROOT, 'src'), (p) => p.endsWith('.astro'))) {
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      if (line.includes('set:html') && !allowed.test(line)) offenders.push(`${rel(f)}: ${line.trim()}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('every page has a CSP meta tag and a Markdown twin', () => {
  const missing = [];
  for (const f of html()) {
    if (f.endsWith('404.html')) continue;
    const s = readFileSync(f, 'utf8');
    if (!/http-equiv="content-security-policy"/i.test(s)) missing.push(`${rel(f)}: no CSP`);
    if (f.endsWith('index.html')) {
      const md = f.replace(/index\.html$/, 'index.md');
      try { readFileSync(md); } catch { missing.push(`${rel(f)}: no index.md twin`); }
    }
  }
  assert.deepEqual(missing, []);
});

test('every <img> has an alt attribute', () => {
  const offenders = [];
  for (const f of html()) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<img\b[^>]*>/g)) {
      if (!/\salt=/.test(m[0])) offenders.push(`${rel(f)}: ${m[0].slice(0, 100)}`);
    }
  }
  assert.deepEqual(offenders, []);
});

test('external links that open new tabs are safe', () => {
  const offenders = [];
  for (const f of html()) {
    for (const m of readFileSync(f, 'utf8').matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      if (!/rel="[^"]*noopener/.test(m[0])) offenders.push(rel(f));
    }
  }
  assert.deepEqual([...new Set(offenders)], []);
});
