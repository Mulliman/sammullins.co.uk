#!/usr/bin/env node
// Converts legacy Umbraco originals into AVIF masters (rasters) or copies them
// unchanged (SVG), and writes _docs/legacy/media-map.json.
//
// Usage: node scripts/media/convert.mjs <legacyMediaDir> [--force] [--quality=62]
//
// Originals are files WITHOUT a `--NNNx0` suffix. Crops (`--300x0`, ...) are
// never converted; they are only listed in the map when they exist on disk.

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT_ROOT = join(REPO, 'src', 'assets', 'media');
const MAP_PATH = join(REPO, '_docs', 'legacy', 'media-map.json');

const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);
const CROP_RE = /--\d+x0(\.[^.]+)$/i;
const MAX_EDGE = 2400;
const EFFORT = 6;

const args = process.argv.slice(2);
const force = args.includes('--force');
const qualityArg = args.find((a) => a.startsWith('--quality='));
const quality = qualityArg ? Number(qualityArg.split('=')[1]) : 62;
const dirArg = args.find((a) => !a.startsWith('--'));

if (!dirArg || !Number.isFinite(quality)) {
  console.error('usage: node scripts/media/convert.mjs <legacyMediaDir> [--force] [--quality=62]');
  process.exit(2);
}

const legacyDir = resolve(dirArg);
if (!existsSync(legacyDir)) {
  console.error(`legacy media dir not found: ${legacyDir}`);
  process.exit(2);
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(2)} MB`;
const isFresh = (dest, src) =>
  !force && existsSync(dest) && statSync(dest).mtimeMs >= statSync(src).mtimeMs;

function walkSize(dir) {
  if (!existsSync(dir)) return { files: 0, bytes: 0 };
  let files = 0;
  let bytes = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = walkSize(p);
      files += sub.files;
      bytes += sub.bytes;
    } else {
      files += 1;
      bytes += statSync(p).size;
    }
  }
  return { files, bytes };
}

// 1. Discover originals and crops.
const folders = readdirSync(legacyDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const originals = [];
const skipped = [];
const cropsByOrigin = new Map(); // "<id>/<origin file>" -> [crop file, ...]

for (const id of folders) {
  const dir = join(legacyDir, id);
  const files = readdirSync(dir)
    .filter((f) => statSync(join(dir, f)).isFile())
    .sort();

  for (const f of files) {
    const crop = f.match(CROP_RE);
    if (crop) {
      const origin = f.replace(CROP_RE, '$1');
      const key = `${id}/${origin}`;
      cropsByOrigin.set(key, [...(cropsByOrigin.get(key) ?? []), f]);
      continue;
    }
    const ext = extname(f).toLowerCase();
    if (!RASTER_EXT.has(ext) && ext !== '.svg') {
      skipped.push(`${id}/${f}`);
      continue;
    }
    originals.push({
      id,
      file: f,
      ext,
      src: join(dir, f),
      base: f.slice(0, -extname(f).length).toLowerCase(),
    });
  }
}

// Refuse to continue if two originals would write to the same asset.
const seen = new Set();
for (const o of originals) {
  const key = `${o.id}/${o.base}`;
  if (seen.has(key)) throw new Error(`asset name collision: ${key}`);
  seen.add(key);
}

// 2. Convert.
const map = [];
const failures = [];
let bytesBefore = 0;
let written = 0;
let upToDate = 0;

for (const o of originals) {
  const srcSize = statSync(o.src).size;
  bytesBefore += srcSize;
  const outExt = o.ext === '.svg' ? '.svg' : '.avif';
  const destRel = `${o.id}/${o.base}${outExt}`;
  const dest = join(OUT_ROOT, destRel);

  try {
    if (isFresh(dest, o.src)) {
      upToDate += 1;
    } else {
      mkdirSync(dirname(dest), { recursive: true });
      if (o.ext === '.svg') {
        copyFileSync(o.src, dest);
      } else {
        const buf = await sharp(o.src)
          .rotate() // apply EXIF orientation
          .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
          .avif({ quality, effort: EFFORT }) // keeps alpha when the source has it
          .toBuffer();
        writeFileSync(dest, buf);
      }
      written += 1;
      console.log(`wrote ${destRel}`);
    }

    let width = null;
    let height = null;
    if (o.ext === '.svg') {
      ({ width, height } = svgSize(readFileSync(dest, 'utf8')));
    } else {
      ({ width, height } = await sharp(dest).metadata());
    }

    const crops = (cropsByOrigin.get(`${o.id}/${o.file}`) ?? []).sort();
    map.push({
      legacyPath: `/media/${o.id}/${o.file}`,
      legacyCrops: crops.map((c) => `/media/${o.id}/${c}`),
      asset: `src/assets/media/${o.id}/${o.base}${outExt}`,
      width,
      height,
    });
  } catch (err) {
    failures.push(`${o.id}/${o.file}: ${err.message}`);
    console.error(`FAILED ${o.id}/${o.file}: ${err.message}`);
  }
}

// 3. Write the map.
map.sort((a, b) => (a.legacyPath < b.legacyPath ? -1 : a.legacyPath > b.legacyPath ? 1 : 0));
mkdirSync(dirname(MAP_PATH), { recursive: true });
writeFileSync(MAP_PATH, `${JSON.stringify(map, null, 2)}\n`);

// 4. Summary.
const after = walkSize(OUT_ROOT);
const svgCount = originals.filter((o) => o.ext === '.svg').length;
console.log('');
console.log(`quality: ${quality} (effort ${EFFORT}, long edge <= ${MAX_EDGE}px)`);
console.log(`originals: ${originals.length} (raster ${originals.length - svgCount}, svg ${svgCount})`);
console.log(`written: ${written}, already up to date: ${upToDate}, failed: ${failures.length}`);
console.log(`crops mapped: ${map.reduce((n, e) => n + e.legacyCrops.length, 0)}`);
console.log(`bytes before (originals): ${mb(bytesBefore)} (${bytesBefore})`);
console.log(`bytes after (src/assets/media, ${after.files} files): ${mb(after.bytes)} (${after.bytes})`);
if (skipped.length) console.log(`skipped non-image files: ${skipped.join(', ')}`);
console.log(`map: ${MAP_PATH} (${map.length} entries)`);

if (failures.length) process.exit(1);

function svgSize(text) {
  const tag = text.match(/<svg\b[^>]*>/i)?.[0] ?? '';
  const vb = tag.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (vb) return { width: Math.round(Number(vb[1])), height: Math.round(Number(vb[2])) };
  const w = tag.match(/\swidth\s*=\s*["']([\d.]+)/i);
  const h = tag.match(/\sheight\s*=\s*["']([\d.]+)/i);
  return {
    width: w ? Math.round(Number(w[1])) : null,
    height: h ? Math.round(Number(h[1])) : null,
  };
}
