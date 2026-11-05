#!/usr/bin/env node
// Converts NEW images into AVIF masters under src/assets/media/<folder>/.
// Companion to convert.mjs (which handles the legacy Umbraco folder).
//
// Usage: node scripts/media/add.mjs <file...> --to <folder> [--force] [--quality=62]
//
//  - masters are AVIF, long edge <= 2400px (never enlarged), quality 62
//  - EXIF, XMP, IPTC and other metadata are stripped (sharp drops metadata by default;
//    do not add withMetadata() here)
//  - EXIF orientation is applied before stripping, so photos stay upright
//  - SVG is refused: it can carry scripts. Add SVG by hand after review.
//  - prints one JSON line per file to stdout: { file, asset, width, height }
//    so the add-images skill can write the image paths and draft alt text.

import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT_ROOT = join(REPO, 'src', 'assets', 'media');
const RASTER_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tif', '.tiff', '.avif']);
const MAX_EDGE = 2400;
const EFFORT = 6;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const toIdx = args.indexOf('--to');
const folder = toIdx >= 0 ? args[toIdx + 1] : undefined;
const qualityArg = args.find((a) => a.startsWith('--quality='));
const quality = qualityArg ? Number(qualityArg.split('=')[1]) : 62;
const files = args.filter((a, i) => !a.startsWith('--') && i !== toIdx + 1 && i !== toIdx);

function fail(msg, code = 2) {
  console.error(msg);
  console.error('usage: node scripts/media/add.mjs <file...> --to <folder> [--force] [--quality=62]');
  process.exit(code);
}

if (!folder || !/^[a-z0-9][a-z0-9-]*$/.test(folder))
  fail('--to <folder> is required (lowercase letters, digits, hyphens)');
if (!files.length) fail('no input files given');
if (!Number.isFinite(quality) || quality < 1 || quality > 100) fail('--quality must be 1 to 100');

const destDir = join(OUT_ROOT, folder);
let failed = 0;

for (const input of files) {
  const src = resolve(input);
  const ext = extname(src).toLowerCase();
  try {
    if (!existsSync(src) || !statSync(src).isFile()) throw new Error('not a file');
    if (ext === '.svg') throw new Error('SVG refused (can carry scripts); add it by hand after review');
    if (!RASTER_EXT.has(ext)) throw new Error(`unsupported type ${ext}`);

    const base = basename(src, extname(src))
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!base) throw new Error('file name has no usable characters');
    const destRel = `${folder}/${base}.avif`;
    const dest = join(OUT_ROOT, destRel);
    if (existsSync(dest) && !flag('--force')) throw new Error(`${destRel} already exists (use --force to overwrite)`);

    mkdirSync(destDir, { recursive: true });
    const { data, info } = await sharp(src, { limitInputPixels: 268402689 })
      .rotate() // apply EXIF orientation, then metadata is dropped
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .avif({ quality, effort: EFFORT })
      .toBuffer({ resolveWithObject: true });

    writeFileSync(dest, data);
    console.log(
      JSON.stringify({
        file: input,
        asset: `src/assets/media/${destRel}`,
        width: info.width,
        height: info.height,
      }),
    );
  } catch (err) {
    failed++;
    console.error(`FAILED ${input}: ${err.message}`);
  }
}

if (failed) process.exit(1);
