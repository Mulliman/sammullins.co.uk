#!/usr/bin/env node
// Builds the PM desk page (ticket 1004) with the site's real build, then folds it into one file for
// the Artifact tool: compiled CSS inlined, fonts and local images as data URIs, external scripts dropped.
// Nothing here styles anything: every rule on the page comes from the site's own CSS.
//
// Usage:
//   node scripts/pm/desk.mjs [desk.json] [out.html]
//   defaults: .desk/desk.json  ->  .desk/desk.html
//
// The desk file is { id, title, description, blocks }, where blocks are ordinary site blocks
// (section, intro, prose, callout, code, cards, ...), validated by the real block schema.
// .desk/ is git-ignored: desk pages describe Sam's own to-dos and are not part of the public repo.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const deskFile = resolve(process.argv[2] ?? join(REPO, '.desk', 'desk.json'));
const outFile = resolve(process.argv[3] ?? join(REPO, '.desk', 'desk.html'));
const outDir = join(REPO, '.desk', 'dist');

const desk = JSON.parse(readFileSync(deskFile, 'utf8'));
mkdirSync(dirname(outFile), { recursive: true });

// 1. The real build, with the desk route switched on.
const build = spawnSync(
  process.execPath,
  [join(REPO, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build', '--outDir', outDir],
  {
    cwd: REPO,
    env: { ...process.env, PM_DESK: deskFile },
    stdio: ['ignore', 'ignore', 'inherit'],
  },
);
if (build.status !== 0) {
  console.error('astro build failed; the desk file probably uses a block or field the schema does not allow.');
  process.exit(build.status ?? 1);
}

const pagePath = join(outDir, 'pm-desk', desk.id, 'index.html');
let html = readFileSync(pagePath, 'utf8');

const MIME = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};
const dataUri = (urlPath) => {
  const file = join(outDir, decodeURI(urlPath.split(/[?#]/)[0]));
  if (!existsSync(file)) return null;
  return `data:${MIME[extname(file)] ?? 'application/octet-stream'};base64,${readFileSync(file).toString('base64')}`;
};

// 2. Stylesheets: inline each, with url(/...) assets embedded.
html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
  const href = tag.match(/href="([^"]+)"/)?.[1];
  if (!href?.startsWith('/')) return tag;
  const css = readFileSync(join(outDir, href), 'utf8').replace(/url\((['"]?)(\/[^'")]+)\1\)/g, (m, q, p) => {
    const uri = dataUri(p);
    return uri ? `url("${uri}")` : m;
  });
  return `<style>${css}</style>`;
});

// 3. Scripts and head links the single file can't use (the CSP allows no other origin, and the
// site's module chunks import each other). The page works without JS: theme follows the system.
html = html
  .replace(/<script\b[^>]*\bsrc="[^"]*"[^>]*><\/script>/g, '')
  .replace(/<link\b[^>]*rel="(?:modulepreload|preload|icon|apple-touch-icon|manifest|alternate|canonical)"[^>]*>/g, '');

// 4. Local images (the header signature, icons).
html = html.replace(/(<img\b[^>]*\bsrc=")(\/[^"]+)"/g, (m, pre, p) => {
  const uri = dataUri(p);
  return uri ? `${pre}${uri}"` : m;
});

// 5. Site links (header, footer) point at the live site, which keeps the same URLs (ticket 601).
html = html.replace(/(<a\b[^>]*\bhref=")\/(?!\/)/g, '$1https://www.sammullins.co.uk/');

// 6. The Artifact tool supplies <html>, <head> and <body>: keep the title, the styles and inline
// scripts from the head, and the body's contents.
const title = html.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? `<title>${desk.title}</title>`;
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
const keep = [...head.matchAll(/<style\b[\s\S]*?<\/style>|<script\b(?![^>]*\bsrc=)[\s\S]*?<\/script>/g)].map(
  (m) => m[0],
);
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? html;

const page = `${title}\n${keep.join('\n')}\n${body}\n`;
writeFileSync(outFile, page);
// A local preview copy with the skeleton the Artifact tool would add (no doctype means quirks mode).
writeFileSync(
  outFile.replace(/\.html$/, '.preview.html'),
  `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>\n${page}</body></html>\n`,
);
const kb = Math.round(readFileSync(outFile).length / 1024);
console.log(`desk page: ${outFile} (${kb} KB)`);
