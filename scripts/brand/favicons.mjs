// Builds public/favicon.svg and public/favicon.ico from the icon half of src/assets/brand/logo.svg.
// Run after changing the logo: node scripts/brand/favicons.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const logo = readFileSync('src/assets/brand/logo.svg', 'utf8');
const [, , iconGroup] = logo.split(/<g\b/);
const icon = '<g' + iconGroup.slice(0, iconGroup.indexOf('</g>') + 4);
const defs = logo.slice(logo.indexOf('<defs>'), logo.indexOf('</defs>') + 7);
const [, , vbW, vbH] = logo
  .match(/viewBox="([^"]+)"/)[1]
  .split(/\s+/)
  .map(Number);

// Find the icon's bounding box by rendering it and trimming the transparent edge.
const scale = 0.25;
const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${vbW * scale}" height="${vbH * scale}">${defs}${icon}</svg>`;
const { info } = await sharp(Buffer.from(probe)).trim().toBuffer({ resolveWithObject: true });
const x = -info.trimOffsetLeft / scale;
const y = -info.trimOffsetTop / scale;
const w = info.width / scale;
const h = info.height / scale;

// Square viewBox centred on the icon, with a little breathing room.
const side = Math.max(w, h) * 1.08;
const vb = [x + w / 2 - side / 2, y + h / 2 - side / 2, side, side].map((n) => Math.round(n)).join(' ');

// Browser tabs follow the OS theme, so the dark stops match the site's dark-theme logo.
const dark = `<style>@media (prefers-color-scheme: dark){stop[stop-color="#000"]{stop-color:#fff}stop[stop-color="#3c3c3c"]{stop-color:#cfcfcf}stop[stop-color="#808080"]{stop-color:#8c8c8c}}</style>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${dark}${defs}${icon}</svg>\n`;
writeFileSync('public/favicon.svg', svg);

// favicon.ico: 16, 32 and 48px PNGs inside an ICO container (supported by every current browser).
const lightSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs}${icon}</svg>`);
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(lightSvg, { density: 300 }).resize(s, s).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...pngs]));
console.log(`favicon.svg (${svg.length} bytes, viewBox ${vb}) and favicon.ico (${offset} bytes)`);
