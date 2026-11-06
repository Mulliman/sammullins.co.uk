#!/usr/bin/env node
// Generates .agents/skills/_shared/block-catalogue.md from src/content.config.ts.
//
// The schema is the source of truth. This script reads its SOURCE TEXT (no import, no build) through
// schema-blocks.mjs, which is shared with the style guide's components page. If the output looks wrong,
// fix the parser there rather than hand-editing the generated file.
//
// Usage:
//   node scripts/skills/block-catalogue.mjs          # write the catalogue
//   node scripts/skills/block-catalogue.mjs --check  # exit 1 if the committed file is stale (CI)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describeField, parseSchema } from './schema-blocks.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCHEMA = join(REPO, 'src', 'content.config.ts');
const OUT = join(REPO, '.agents', 'skills', '_shared', 'block-catalogue.md');

const checkOnly = process.argv.includes('--check');

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
  'section',
];

const { blocks, shared } = parseSchema(readFileSync(SCHEMA, 'utf8'));

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
    const d = describeField(f.expr, shared);
    const required = d.optional || d.dflt !== '' ? 'no' : 'yes';
    lines.push(
      `| \`${f.key}\` | ${d.type.replace(/\\/g, '\\\\').replace(/\|/g, '\\|')} | ${required} | ${d.dflt ? `\`${d.dflt}\`` : ''} |`,
    );
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
