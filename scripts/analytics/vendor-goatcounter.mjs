#!/usr/bin/env node
// Vendors GoatCounter's count.js at a fixed version (ticket 703).
// Usage: node scripts/analytics/vendor-goatcounter.mjs <version>   e.g. 5
// Downloads https://gc.zgo.at/count.v<version>.js into public/js/count.js and records the version
// and SHA-256 in _docs/analytics.md, which tests/analytics.test.mjs checks the file against.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '..', '..', '..');
const DOC = join(ROOT, '_docs', 'analytics.md');
const OUT = join(ROOT, 'public', 'js', 'count.js');

const version = process.argv[2];
if (!/^\d+$/.test(version ?? '')) {
  console.error('Usage: node scripts/analytics/vendor-goatcounter.mjs <version>   (e.g. 5)');
  process.exit(2);
}

const url = `https://gc.zgo.at/count.v${version}.js`;
const res = await fetch(url);
if (!res.ok) {
  console.error(`${url} answered ${res.status}.`);
  process.exit(1);
}
const body = Buffer.from(await res.arrayBuffer());
const sha = createHash('sha256').update(body).digest('hex');

const row = /^\| `public\/js\/count\.js` \|.*\|$/m;
const doc = readFileSync(DOC, 'utf8');
if (!row.test(doc)) {
  console.error(`No count.js row in ${DOC}; nothing written.`);
  process.exit(1);
}
writeFileSync(OUT, body);
writeFileSync(DOC, doc.replace(row, `| \`public/js/count.js\` | ${url} | v${version} | \`${sha}\` |`));
console.log(`Wrote public/js/count.js from ${url}\nSHA-256 ${sha}\nRun pnpm format, then read the diff.`);
