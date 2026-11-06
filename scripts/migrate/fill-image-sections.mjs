// One-shot repair (6 Nov 2026): the first migration run turned the original's photo sections
// (blurred backdrop, black band, plain) into identical framed images, and gave every gallery
// three columns. This reads the legacy HTML and sets `backdrop`, `surface` and `frame` on image
// blocks and `columns` on galleries, matching blocks to sections by media folder id.
//
//   node scripts/migrate/fill-image-sections.mjs <legacy-export-dir>
//
// Safe to re-run: blocks that already have the property are left alone.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'node-html-parser';

const legacyRoot = process.argv[2];
if (!legacyRoot) throw new Error('usage: fill-image-sections.mjs <legacy-export-dir>');

const mediaId = (src) => src?.match(/\/media\/([a-z0-9]+)\//i)?.[1]?.toLowerCase();
const report = readFileSync('_docs/legacy/migration-report.md', 'utf8');
const pages = [...report.matchAll(/^- (\/\S*) → (src\/content\/\S+\.md)/gm)].map((m) => ({ url: m[1], file: m[2] }));

let changes = 0;
for (const { url, file } of pages) {
  const legacyFile = join(legacyRoot, url, 'index.html');
  if (!existsSync(legacyFile) || !existsSync(file)) continue;
  const root = parse(readFileSync(legacyFile, 'utf8'));

  const images = new Map(); // media id -> { backdrop, surface, frame }
  const galleries = new Map(); // first image media id -> columns
  for (const section of root.querySelectorAll('.umb-block-list > .uk-section')) {
    const cls = section.getAttribute('class') ?? '';
    const grid = section.querySelector('[uk-grid]');
    const imgs = section.querySelectorAll('img');
    if (grid && section.querySelector('[uk-lightbox]')) {
      const m = (grid.getAttribute('class') ?? '').match(/uk-child-width-1-(\d)@(m|l)/);
      const id = mediaId(imgs[0]?.getAttribute('src'));
      if (id) galleries.set(id, m ? Number(m[1]) : 2);
      continue;
    }
    if (imgs.length !== 1 || section.querySelector('h1')) continue;
    const img = imgs[0];
    const id = mediaId(img.getAttribute('src'));
    if (!id) continue;
    const imgCls = img.getAttribute('class') ?? '';
    images.set(id, {
      backdrop: cls.includes('uf-blurred-background-image') ? 'blurred' : undefined,
      surface: cls.includes('uk-section-secondary')
        ? 'inverse'
        : cls.includes('uk-section-muted')
          ? 'muted'
          : undefined,
      frame: imgCls.includes('uf-bordered-thick') ? undefined : 'none',
    });
  }
  if (images.size === 0 && galleries.size === 0) continue;

  const lines = readFileSync(file, 'utf8').split('\n');
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].match(/^  - type: "(image|gallery)"$/);
    if (!t) continue;
    let end = i + 1;
    while (end < lines.length && !lines[end].startsWith('  - type:') && lines[end] !== '---') end++;
    const block = lines.slice(i + 1, end);
    const has = (k) => block.some((l) => l.startsWith(`    ${k}:`));
    const firstSrc = block.find((l) => /src: "/.test(l));
    const id = mediaId(firstSrc);
    if (!id) continue;
    const insert = [];
    if (t[1] === 'image' && images.has(id)) {
      const p = images.get(id);
      if (p.backdrop && !has('backdrop')) insert.push(`    backdrop: "${p.backdrop}"`);
      if (p.surface && !p.backdrop && !has('surface')) insert.push(`    surface: "${p.surface}"`);
      if (p.frame && !has('frame')) insert.push(`    frame: "${p.frame}"`);
    }
    if (t[1] === 'gallery' && galleries.has(id) && !has('columns')) {
      insert.push(`    columns: ${galleries.get(id)}`);
    }
    if (insert.length) {
      lines.splice(i + 1, 0, ...insert);
      i += insert.length;
      changed = true;
      changes++;
    }
  }
  if (changed) {
    writeFileSync(file, lines.join('\n'));
    console.log(`updated ${file}`);
  }
}
console.log(`${changes} blocks updated`);
