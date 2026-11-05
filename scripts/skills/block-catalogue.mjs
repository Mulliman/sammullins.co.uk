#!/usr/bin/env node
// Generates .agents/skills/_shared/block-catalogue.md from src/content.config.ts.
//
// The schema is the source of truth. This script reads its SOURCE TEXT (no
// import, no build) and extracts, for every `type: z.literal('<name>')`, the
// enclosing `z.object({ ... })` and its fields. It is a best-effort parser:
// it understands the object literal shape used in content.config.ts, not
// arbitrary TypeScript. If the schema is restructured and the output looks
// wrong, fix the parser here rather than hand-editing the generated file.
//
// Usage:
//   node scripts/skills/block-catalogue.mjs          # write the catalogue
//   node scripts/skills/block-catalogue.mjs --check  # exit 1 if the committed file is stale (CI)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCHEMA = join(REPO, 'src', 'content.config.ts');
const OUT = join(REPO, '.agents', 'skills', '_shared', 'block-catalogue.md');

const checkOnly = process.argv.includes('--check');

/** Index of the matching close bracket for the opener at `openIdx`. */
function matchClose(text, openIdx) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [];
  let quote = null;
  for (let i = openIdx; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if (pairs[c]) stack.push(pairs[c]);
    else if (c === stack.at(-1)) {
      stack.pop();
      if (stack.length === 0) return i;
    }
  }
  throw new Error(`unbalanced brackets from offset ${openIdx}`);
}

/** Split a string on commas that sit at bracket depth 0 and outside quotes. */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') quote = c;
    else if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === ',' && depth === 0) {
      parts.push(body.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** Collapse a zod expression to one readable line. */
const tidy = (expr) => expr.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();

/** Turn a zod expression into { type, required, dflt } for the table. */
function describe(expr) {
  let dflt = '';
  const d = expr.match(/\.default\(((?:[^()]|\([^()]*\))*)\)/);
  if (d) dflt = d[1].replace(/\s+/g, ' ').trim();
  const optional = /\.optional\(\)/.test(expr);
  const refined = /\.refine\(/.test(expr);
  if (expr.startsWith('align')) return { type: 'center | left', optional, dflt };
  let type = tidy(expr)
    .replace(/\.default\(((?:[^()]|\([^()]*\))*)\)/g, '')
    .replace(/\.int\(\)/g, '')
    .replace(/\.max\((\d+)\)/g, ' (max $1)')
    .replace(/\.optional\(\)/g, '')
    .replace(/\.refine\([\s\S]*$/, '')
    .replace(/\s*\.and\(/, ' and (')
    .replace(/\bimg\b/g, 'imageRef')
    .replace(/\bz\.string\(\)/g, 'string')
    .replace(/\bz\.coerce\.string\(\)/g, 'string (coerced)')
    .replace(/\bz\.coerce\.date\(\)/g, 'date')
    .replace(/\bz\.number\(\)/g, 'number')
    .replace(/\bz\.boolean\(\)/g, 'boolean')
    .replace(/\bz\.url\(\)/g, 'url')
    .replace(/\bz\.literal\('([^']+)'\)/g, '"$1"')
    .replace(/z\.enum\(\[([^\]]*)\]\)/g, (_, vals) =>
      vals
        .split(',')
        .map((v) => v.trim().replace(/^'|'$/g, ''))
        .join(' | '),
    )
    .replace(/z\.array\(([^()]*)\)/g, 'list of $1')
    .replace(/\.min\(1\)/g, ' (min 1)');
  if (refined) type += ' (refined: see notes)';
  return { type, optional, dflt };
}

const text = readFileSync(SCHEMA, 'utf8');

// Every block type is identified by its `type: z.literal('<name>')` line.
const literalRe = /\btype:\s*z\.literal\('([A-Za-z]+)'\)/g;
const blocks = new Map();
let m;
while ((m = literalRe.exec(text))) {
  const name = m[1];
  if (blocks.has(name)) continue;
  // The enclosing object is the nearest `z.object({` before the literal.
  const objStart = text.lastIndexOf('z.object({', m.index);
  if (objStart < 0) throw new Error(`no z.object before literal '${name}'`);
  const open = text.indexOf('{', objStart);
  const close = matchClose(text, open);
  const fields = splitTopLevel(text.slice(open + 1, close))
    .map((part) => {
      const kv = part.match(/^([A-Za-z_]\w*)\s*:\s*([\s\S]+)$/);
      if (!kv) return null;
      return { key: kv[1], expr: kv[2].trim() };
    })
    .filter(Boolean);
  blocks.set(name, fields);
}

// Shared objects referenced by name inside blocks, documented once.
const SHARED = [
  [
    'imageRef',
    'Image with mandatory alt text',
    `src: image path (relative to the .md file), processed by Astro
alt: string. Required and non-empty unless decorative is true
decorative: boolean, default false`,
  ],
  [
    'query',
    'Collection query used by cards and listing',
    `from: articles | software | albums (pages cannot be queried)
tags: string list (optional), matches any tag
kind: article | note (optional, articles only)
status: active | legacy (optional, software only)
archived: exclude | include | only, default exclude
parent: string (optional), id prefix, e.g. a software product
topLevelOnly: boolean, default false
sort: date-desc | date-asc | order | title, default date-desc
limit: positive integer (optional)`,
  ],
];

const ORDER = [
  'hero',
  'intro',
  'prose',
  'body',
  'callout',
  'image',
  'gallery',
  'cards',
  'listing',
  'logoWall',
  'quote',
  'code',
  'nextPrev',
  'timeline',
  'embed',
  'split',
];

const missing = ORDER.filter((n) => !blocks.has(n));
const extra = [...blocks.keys()].filter((n) => !ORDER.includes(n));
if (missing.length || extra.length) {
  throw new Error(
    `block list drift. missing in schema: [${missing}] unexpected: [${extra}]. Update ORDER in block-catalogue.mjs`,
  );
}

const lines = [];
lines.push('<!--');
lines.push('  GENERATED FILE. Do not edit by hand.');
lines.push('  Source: src/content.config.ts. Generator: scripts/skills/block-catalogue.mjs.');
lines.push('  Regenerate with: pnpm skills:catalogue');
lines.push('-->');
lines.push('');
lines.push('# Block catalogue');
lines.push('');
lines.push(
  `Every page body is a list of blocks in front matter under \`blocks:\`. Each block has a \`type\` and the fields below. ${ORDER.length} types. Field reference and gotchas: [\`_docs/content-model.md\`](../../../_docs/content-model.md).`,
);
lines.push('');
lines.push(
  'Field types are as written in the Zod schema. "optional" means the key may be left out. A "default" is what the site uses when the key is left out.',
);
lines.push('');
lines.push('## Shared shapes');
lines.push('');
for (const [name, summary, body] of SHARED) {
  lines.push(`### \`${name}\``);
  lines.push('');
  lines.push(summary + '.');
  lines.push('');
  lines.push('```text');
  lines.push(body);
  lines.push('```');
  lines.push('');
}

lines.push('## Block types');
lines.push('');
lines.push('| type | fields |');
lines.push('|---|---|');
for (const name of ORDER) {
  const names = blocks
    .get(name)
    .filter((f) => f.key !== 'type')
    .map((f) => f.key);
  lines.push(`| \`${name}\` | ${names.map((n) => `\`${n}\``).join(', ')} |`);
}
lines.push('');

for (const name of ORDER) {
  lines.push(`## \`${name}\``);
  lines.push('');
  lines.push('| field | type | required | default |');
  lines.push('|---|---|---|---|');
  for (const f of blocks.get(name)) {
    if (f.key === 'type') continue;
    const d = describe(f.expr);
    const required = d.optional || d.dflt !== '' ? 'no' : 'yes';
    lines.push(`| \`${f.key}\` | ${d.type.replace(/\|/g, '\\|')} | ${required} | ${d.dflt ? `\`${d.dflt}\`` : ''} |`);
  }
  lines.push('');
}

const output = lines.join('\n');

if (checkOnly) {
  const committed = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (committed.replace(/\r\n/g, '\n') !== output) {
    console.error(`block catalogue is stale: ${OUT}`);
    console.error('run: pnpm skills:catalogue, then commit the result');
    process.exit(1);
  }
  console.log(`block catalogue is up to date (${ORDER.length} block types)`);
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, output);
  console.log(`wrote ${OUT} (${ORDER.length} block types)`);
}
