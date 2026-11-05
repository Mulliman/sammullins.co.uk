#!/usr/bin/env node
// Checks that every path in _docs/legacy/media-referenced.txt resolves to an
// entry in _docs/legacy/media-map.json (as legacyPath or inside legacyCrops),
// and that each resolved entry's asset exists on disk.
// Exits non-zero on any miss.
//
// Usage: node scripts/media/check-map.mjs

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const REF_PATH = join(REPO, '_docs', 'legacy', 'media-referenced.txt');
const MAP_PATH = join(REPO, '_docs', 'legacy', 'media-map.json');

const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));

// Exact index: every legacyPath and crop -> its entry.
const exact = new Map();
for (const entry of map) {
  exact.set(entry.legacyPath, entry);
  for (const crop of entry.legacyCrops) exact.set(crop, entry);
}

const refs = [
  ...new Set(
    readFileSync(REF_PATH, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/[?#].*$/, '')),
  ),
];

const misses = [];
const badAssets = [];
for (const ref of refs) {
  const entry = exact.get(ref);
  if (!entry) {
    misses.push(ref);
    continue;
  }
  if (!existsSync(join(REPO, entry.asset))) badAssets.push(`${ref} -> ${entry.asset}`);
}

console.log(`referenced paths: ${refs.length}`);
console.log(`map entries: ${map.length}`);
console.log(`resolved: ${refs.length - misses.length}`);
console.log(`misses: ${misses.length}`);
for (const m of misses) console.log(`  MISS ${m}`);
console.log(`missing asset files: ${badAssets.length}`);
for (const a of badAssets) console.log(`  NO FILE ${a}`);

process.exit(misses.length || badAssets.length ? 1 : 0);
