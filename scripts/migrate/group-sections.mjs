// One-shot (6 Nov 2026): wraps each intro and the components after it on the same background
// into a `section` block, as the original site's sections held a heading and its content.
//
//   node scripts/migrate/group-sections.mjs
//
// Rules: a section starts at an intro with a heading and takes the following blocks on the same
// surface, up to the next headed intro. An intro with only a button joins the section before it.
// Heroes, splits, sections and blurred-backdrop images are bands of their own and are never grouped.
// Children lose their own `surface` line (the section sets it). Safe to re-run.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DEFAULT_SURFACE = { intro: 'muted' };
const NEVER = new Set(['hero', 'split', 'section']);

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.md') ? [p] : [];
  });
}

function parseBlocks(lines, start, end) {
  const blocks = [];
  for (let i = start; i < end; i++) {
    if (/^ {2}- type: "/.test(lines[i])) blocks.push({ start: i, lines: [] });
    if (blocks.length) blocks.at(-1).lines.push(lines[i]);
  }
  for (const b of blocks) {
    b.type = b.lines[0].match(/type: "(\w+)"/)[1];
    const own = (key) => b.lines.find((l) => l.startsWith(`    ${key}: `))?.match(/: "?([^"]*)"?$/)?.[1];
    b.headed = b.type === 'intro' && own('heading') !== undefined;
    b.surface =
      NEVER.has(b.type) || own('backdrop') === 'blurred'
        ? null
        : (own('surface') ?? DEFAULT_SURFACE[b.type] ?? 'default');
  }
  return blocks;
}

const indent = (b) => b.lines.filter((l) => !l.startsWith('    surface: ')).map((l) => (l === '' ? l : '    ' + l));

let changed = 0;
for (const file of walk('src/content')) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const fmEnd = lines.indexOf('---', 1);
  const blocksAt = lines.indexOf('blocks:');
  if (fmEnd < 0 || blocksAt < 0 || blocksAt > fmEnd) continue;
  const blocks = parseBlocks(lines, blocksAt + 1, fmEnd);
  if (!blocks.length) continue;

  const out = [];
  let grouped = false;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'intro' && b.headed && b.surface) {
      const group = [b];
      let j = i + 1;
      while (
        j < blocks.length &&
        blocks[j].surface === b.surface &&
        !(blocks[j].type === 'intro' && blocks[j].headed)
      ) {
        group.push(blocks[j]);
        j++;
      }
      if (group.length > 1) {
        out.push('  - type: "section"', `    surface: "${b.surface}"`, '    blocks:', ...group.flatMap(indent));
        i = j - 1;
        grouped = true;
        continue;
      }
    }
    out.push(...b.lines);
  }
  if (!grouped) continue;
  const next = [...lines.slice(0, blocksAt + 1), ...out, ...lines.slice(fmEnd)].join('\n');
  if (next !== text) {
    writeFileSync(file, next);
    changed++;
    console.log(`grouped ${file}`);
  }
}
console.log(`${changed} files`);
