// One-shot repair (6 Nov 2026): the first migration run dropped the text of text-only cards
// (their .uk-card-body class is on the card itself). This refills `text` (and a `cta` from the
// card's button) for card items that have a title but no text, using the legacy HTML.
//
//   node scripts/migrate/fill-card-text.mjs <legacy-export-dir>
//
// Safe to re-run: items that already have text are left alone.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

const legacyRoot = process.argv[2];
if (!legacyRoot) throw new Error('usage: fill-card-text.mjs <legacy-export-dir>');

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
const clean = (s) => s.replace(/\s+/g, ' ').trim();

const report = readFileSync('_docs/legacy/migration-report.md', 'utf8');
const pages = [...report.matchAll(/^- (\/\S*) → (src\/content\/\S+\.md)/gm)].map((m) => ({ url: m[1], file: m[2] }));

let filled = 0;
for (const { url, file } of pages) {
  const legacyFile = join(legacyRoot, url, 'index.html');
  if (!existsSync(legacyFile) || !existsSync(file)) continue;
  const root = parse(readFileSync(legacyFile, 'utf8'));

  // title -> { text, cta } for every card in the page body
  const cards = new Map();
  for (const card of root.querySelectorAll('.umb-block-list .uk-card')) {
    const body = card.classList.contains('uk-card-body') ? card : card.querySelector('.uk-card-body');
    if (!body) continue;
    const heading = body.querySelector('h3, h2, .uk-card-title');
    const title = heading ? clean(heading.text) : '';
    if (!title) continue;
    const button = body.querySelector('a.uk-button');
    const cta = button ? clean(button.text) : undefined;
    const copy = parse(body.innerHTML);
    copy
      .querySelectorAll('h1, h2, h3, .uk-card-title, a.uk-button, a.uk-position-cover, img')
      .forEach((n) => n.remove());
    const md = td
      .turndown(copy.innerHTML)
      .replace(/^[ \t ]+$/gm, '') // &nbsp; spacer paragraphs
      .replace(/\\`/g, '`') // the original showed `code` literally; let it render as code
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (md || cta) cards.set(title.toLowerCase(), { text: md, cta });
  }
  if (cards.size === 0) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(\s*)- title: "(.*)"\s*$/);
    if (!m) continue;
    const indent = m[1] + '  ';
    // collect this item's existing keys
    let j = i + 1;
    const keys = new Set();
    while (j < lines.length && lines[j].startsWith(indent) && !lines[j].startsWith(m[1] + '- ')) {
      const k = lines[j].slice(indent.length).match(/^(\w+):/);
      if (k) keys.add(k[1]);
      j++;
    }
    if (keys.has('text')) continue;
    const found = cards.get(m[2].replace(/\\"/g, '"').toLowerCase());
    if (!found) continue;
    const insert = [];
    if (found.text) {
      insert.push(`${indent}text: |-`);
      for (const l of found.text.split('\n')) insert.push(l ? `${indent}  ${l}` : '');
    }
    if (found.cta && !keys.has('cta') && keys.has('href')) insert.push(`${indent}cta: ${JSON.stringify(found.cta)}`);
    if (insert.length) {
      lines.splice(i + 1, 0, ...insert);
      i += insert.length;
      changed = true;
      filled++;
    }
  }
  if (changed) {
    writeFileSync(file, lines.join('\n'));
    console.log(`filled ${file}`);
  }
}
console.log(`${filled} card items filled`);
