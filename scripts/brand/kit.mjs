// Builds the brand kit (SVG variants, PNG icons, favicon, manifest, preview sheet) from one master SVG.
//
//   pnpm brand:kit                       reads ../Brand/logo.svg, writes ../Brand/exports
//   pnpm brand:kit -- --src x.svg --out dir
//   pnpm brand:kit -- --site             also copies favicon + app icons into public/ and the
//                                        interactive logo SVGs into src/assets/brand/
//
// The master must contain a group with id "Best-so-far" whose two child groups are, in order,
// the wordmark and the mark. Fills: unset = primary, rgb(61,63,67) = secondary.
// Everything below is derived, so edit the master (or CONFIG) and re-run; never hand-edit exports.
import { mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'node-html-parser';
import sharp from 'sharp';

// pnpm forwards the "--" separator, so drop it before parsing.
const { values: args } = parseArgs({
  args: process.argv.slice(2).filter((a) => a !== '--'),
  options: {
    src: { type: 'string', default: '../Brand/logo.svg' },
    out: { type: 'string', default: '../Brand/exports' },
    site: { type: 'boolean', default: false },
  },
});

const CONFIG = {
  masterGroupId: 'Best-so-far',
  secondaryInMaster: 'rgb(61,63,67)',
  // Colourways. "default" is for light backgrounds, "light" for dark backgrounds.
  palettes: {
    default: { p: '#000000', s: '#3d3f43' },
    light: { p: '#ffffff', s: '#c2c4c8' },
    black: { p: '#000000', s: '#000000' },
    white: { p: '#ffffff', s: '#ffffff' },
  },
  // Horizontal lockup, in multiples of the wordmark's height.
  horizontal: { markHeight: 1.9, gap: 0.6 },
  // App icons: background and how much of the square the mark fills (width).
  iconBackground: '#ffffff',
  iconBackgroundDark: '#0b0b0c',
  fill: { favicon: 1, any: 0.88, apple: 0.72, maskable: 0.6 },
  logoPngWidths: [512, 1024, 2048],
  og: { width: 1200, height: 630, logoHeight: 0.62 },
};

const SRC = resolve(args.src);
const OUT = resolve(args.out);

// ---------- 1. Pull the two parts out of the master and tokenise their colours ----------
const master = readFileSync(SRC, 'utf8');
const [, , VBW, VBH] = master
  .match(/viewBox="([^"]+)"/)[1]
  .split(/[\s,]+/)
  .map(Number);
const root = parse(master, { lowerCaseTagName: false });
const group = root.querySelector(`#${CONFIG.masterGroupId}`);
if (!group) throw new Error(`No #${CONFIG.masterGroupId} group in ${SRC}`);
const kids = group.childNodes.filter((n) => n.rawTagName === 'g');
if (kids.length !== 2) throw new Error(`Expected 2 child groups (wordmark, mark), found ${kids.length}`);

const sec = CONFIG.secondaryInMaster.replace(/[()]/g, '\\$&');
const tokenise = (markup) =>
  markup
    .replace(/\s*serif:id="[^"]*"/g, '')
    // secondary fill moves from style to a token attribute
    .replace(new RegExp(`(<\\w+)([^>]*?)style="([^"]*?)fill:${sec};?([^"]*)"`, 'g'), (_, tag, pre, a, b) => {
      const rest = (a + b).trim();
      return `${tag}${pre}fill="__S__"${rest ? ` style="${rest}"` : ''}`;
    })
    .replace(/\s*style="fill-rule:nonzero;?"/g, '')
    // ids would be duplicated when two logos share a page
    .replace(/\s*id="[^"]*"/g, '');

const raw = { wordmark: tokenise(kids[0].toString()), mark: tokenise(kids[1].toString()) };
const parts = {
  wordmark: `<g fill="__P__">${raw.wordmark}</g>`,
  mark: `<g fill="__P__">${raw.mark}</g>`,
};

// Interactive parts: every bar and letter gets a class and data attributes for CSS/JS.
// Tone decides the letter: in the master, the S bars and SAM are primary; the M bars and MULLINS secondary.
const WORD = 'SAMMULLINS';
const hook = (markup, kind) => {
  let i = 0;
  const out = markup.replace(/<(path|rect)\b([^>]*?)(\s*\/?)>/g, (_, tag, attrs, end) => {
    const tone = attrs.includes('fill="__S__"') ? 'secondary' : 'primary';
    i++;
    const data =
      kind === 'mark'
        ? `class="logo-bar logo-${tone}" data-index="${i}" data-letter="${tone === 'primary' ? 'S' : 'M'}"`
        : `class="logo-glyph logo-${tone}" data-index="${i}" data-char="${WORD[i - 1] ?? ''}" data-word="${tone === 'primary' ? 'sam' : 'mullins'}"`;
    return `<${tag} ${data}${attrs}${end}>`;
  });
  return { out, count: i };
};
const iMark = hook(raw.mark, 'mark');
const iWord = hook(raw.wordmark, 'word');
if (iWord.count !== WORD.length) console.warn(`Expected ${WORD.length} letters in the wordmark, found ${iWord.count}`);
const iparts = {
  wordmark: `<g class="logo-wordmark" fill="__P__">${iWord.out}</g>`,
  mark: `<g class="logo-mark" fill="__P__">${iMark.out}</g>`,
};

const paint = (markup, pal) => markup.replaceAll('__P__', pal.p).replaceAll('__S__', pal.s);
const svgDoc = (vb, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(round).join(' ')}">${extra}${body}</svg>\n`;
const round = (n) => Math.round(n * 100) / 100;

// ---------- 2. Measure each part by rendering it and trimming the transparent edge ----------
async function bounds(markup) {
  const k = 8;
  const probe = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VBW} ${VBH}" width="${VBW * k}" height="${VBH * k}">${paint(markup, CONFIG.palettes.black)}</svg>`;
  const { info } = await sharp(Buffer.from(probe)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  return { x: -info.trimOffsetLeft / k, y: -info.trimOffsetTop / k, w: info.width / k, h: info.height / k };
}
const box = { wordmark: await bounds(parts.wordmark), mark: await bounds(parts.mark) };

// ---------- 3. Lockups: body markup + tight viewBox ----------
const union = (a, b) => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
};
const vbOf = (b) => [b.x, b.y, b.w, b.h];

const buildLockups = (P) => {
  const L = {
    logo: { body: P.mark + P.wordmark, vb: vbOf(union(box.mark, box.wordmark)) },
    mark: { body: P.mark, vb: vbOf(box.mark) },
    wordmark: { body: P.wordmark, vb: vbOf(box.wordmark) },
  };
  // Horizontal: mark on the left, scaled relative to the wordmark height, vertically centred.
  const m = box.mark;
  const t = box.wordmark;
  const s = (t.h * CONFIG.horizontal.markHeight) / m.h;
  const mw = m.w * s;
  const mh = m.h * s;
  const gap = t.h * CONFIG.horizontal.gap;
  const tx = mw + gap;
  const H = Math.max(mh, t.h);
  const markG = `<g transform="translate(0 ${round((H - mh) / 2)}) scale(${round(s * 1e4) / 1e4}) translate(${round(-m.x)} ${round(-m.y)})">${P.mark}</g>`;
  const textG = `<g transform="translate(${round(tx - t.x)} ${round((H - t.h) / 2 - t.y)})">${P.wordmark}</g>`;
  L['logo-horizontal'] = { body: markG + textG, vb: [0, 0, tx + t.w, H] };
  return L;
};
const lockups = buildLockups(parts);
const ilockups = buildLockups(iparts);

// Square viewBox around the mark, mark width = `fill` of the side.
const squareVb = (fill) => {
  const m = box.mark;
  const side = Math.max(m.w, m.h) / fill;
  return [m.x + m.w / 2 - side / 2, m.y + m.h / 2 - side / 2, side, side];
};

// ---------- 4. Write everything ----------
rmSync(OUT, { recursive: true, force: true });
for (const d of ['svg', 'png', 'favicon', 'interactive']) mkdirSync(join(OUT, d), { recursive: true });
const files = [];
const write = (rel, data) => {
  writeFileSync(join(OUT, rel), data);
  files.push(rel);
};
const png = (svg, w, h, bg) => {
  let img = sharp(Buffer.from(svg), { density: 600 }).resize(w, h, { fit: 'contain', background: '#0000' });
  if (bg) img = img.flatten({ background: bg });
  return img.png({ compressionLevel: 9 }).toBuffer();
};

// SVG lockups in every colourway, plus a currentColor one for inlining in HTML.
for (const [name, l] of Object.entries(lockups)) {
  for (const [pal, colours] of Object.entries(CONFIG.palettes)) {
    const suffix = pal === 'default' ? '' : `-${pal}`;
    write(`svg/${name}${suffix}.svg`, svgDoc(l.vb, paint(l.body, colours)));
  }
  write(`svg/${name}-currentcolor.svg`, svgDoc(l.vb, paint(l.body, { p: 'currentColor', s: 'currentColor' })));
}

// Interactive SVGs: for inlining in HTML (an <img> can't be styled or scripted).
// Fill attributes are fallbacks; logo.css overrides them with --logo-primary / --logo-secondary.
// No <style>, no ids, no inline style="", so it is safe under a strict CSP and can appear twice on a page.
const interactiveSvg = (name) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ilockups[name].vb.map(round).join(' ')}" class="logo logo--${name}" role="img" aria-label="Sam Mullins">${paint(ilockups[name].body, CONFIG.palettes.default)}</svg>\n`;
for (const name of Object.keys(ilockups)) write(`interactive/${name}.svg`, interactiveSvg(name));
{
  const { default: d, light } = CONFIG.palettes;
  const stagger = (cls, n) =>
    Array.from({ length: n }, (_, i) => `.logo .${cls}[data-index="${i + 1}"] { --i: ${i}; }`).join('\n');
  write(
    'interactive/logo.css',
    `/* Hooks for the interactive logo SVGs in this folder. Generated by scripts/brand/kit.mjs; don't edit.
 *
 * Inline the SVG in your HTML, then:
 *   .logo                          the <svg>; set the colour variables here
 *   .logo-mark / .logo-wordmark    the two groups
 *   .logo-bar[data-letter="S|M"]   one per bar, data-index 1..${iMark.count}
 *   .logo-glyph[data-word="sam|mullins"][data-char]   one per letter, data-index 1..${iWord.count}
 *   .logo-primary / .logo-secondary                    which colour a shape uses
 */
.logo {
  --logo-primary: ${d.p};
  --logo-secondary: ${d.s};
  display: block;
  overflow: visible;
}
@media (prefers-color-scheme: dark) {
  .logo {
    --logo-primary: ${light.p};
    --logo-secondary: ${light.s};
  }
}
.logo .logo-primary { fill: var(--logo-primary); }
.logo .logo-secondary { fill: var(--logo-secondary); }

/* Transforms on a bar or letter pivot around its own centre. */
.logo .logo-bar,
.logo .logo-glyph {
  transform-box: fill-box;
  transform-origin: center;
}

/* Optional entrance: add class="logo logo--intro". Bars build, then the name follows. */
${stagger('logo-bar', iMark.count)}
${stagger('logo-glyph', iWord.count)}
@media (prefers-reduced-motion: no-preference) {
  .logo--intro .logo-bar {
    animation: logo-rise 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i, 0) * 60ms);
  }
  .logo--intro .logo-glyph {
    animation: logo-fade 0.4s ease-out both;
    animation-delay: calc(${iMark.count * 60 + 100}ms + var(--i, 0) * 30ms);
  }
}
@keyframes logo-rise {
  from { opacity: 0; transform: translateY(30%) scale(0.9); }
}
@keyframes logo-fade {
  from { opacity: 0; transform: translateY(20%); }
}
`,
  );
  write(
    'interactive/demo.html',
    `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Interactive logo</title>
<link rel="stylesheet" href="logo.css">
<style>
:root{--bg:#f4f4f5;--card:#fff;--text:#16171a;--muted:#5d6068;--line:#dedfe3}
@media (prefers-color-scheme:dark){:root{--bg:#111214;--card:#1a1b1e;--text:#ececee;--muted:#a3a6ad;--line:#2c2e33}}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,sans-serif}
main{max-width:960px;margin:0 auto;padding:40px 16px 80px}
h1{margin:0 0 4px}h2{margin:48px 0 4px;font-size:1.3rem}p{max-width:66ch;color:var(--muted);margin-top:0}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:32px;margin-top:16px}
.card .logo{width:min(100%,420px);margin:0 auto}
.row{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
button{font:inherit;font-size:.9rem;padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--text);cursor:pointer}
button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
pre{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;overflow-x:auto;font-size:.82rem;margin-top:12px}
output{display:block;margin-top:12px;font:14px ui-monospace,monospace;color:var(--muted);min-height:1.5em}

/* Demo 3: hover. The M bars lift one after another. */
.lift .logo-bar{transition:transform .3s cubic-bezier(.2,.7,.2,1)}
.lift .logo-bar[data-letter="M"]{transition-delay:calc((var(--i) - 4) * 50ms)}
.lift:hover .logo-bar[data-letter="M"]{transform:translateY(-8%)}

/* Demo 4: clicked parts light up. */
.pick .logo-bar,.pick .logo-glyph{cursor:pointer;transition:fill .2s}
.pick .is-lit{fill:#da7d03}
</style>
</head>
<body>
<main>
<h1>Interactive logo</h1>
<p>The same logo as <code>logo.svg</code>, inlined in the page so CSS and JavaScript can reach every bar and letter. Uses <code>logo.css</code> from this folder.</p>

<h2>1. Colour from CSS variables</h2>
<p>Set <code>--logo-primary</code> and <code>--logo-secondary</code> on the SVG or any parent. Dark mode is handled in <code>logo.css</code>.</p>
<div class="card" id="themed">${interactiveSvg('logo')}</div>
<div class="row" role="group" aria-label="Colour way">
  <button type="button" data-p="" data-s="" aria-pressed="true">Default</button>
  <button type="button" data-p="#000000" data-s="#6b6e74">Lighter grey</button>
  <button type="button" data-p="#000000" data-s="#da7d03">Orange M</button>
  <button type="button" data-p="#9a5200" data-s="#da7d03">All orange</button>
</div>
<pre>.site-header .logo { --logo-primary: var(--color-text); --logo-secondary: var(--color-brand); }</pre>

<h2>2. Entrance animation</h2>
<p>Add <code>logo--intro</code>. The bars build in order, then the name fades in. Nothing moves if the visitor has asked for reduced motion.</p>
<div class="card" id="intro">${interactiveSvg('logo').replace('class="logo ', 'class="logo logo--intro ')}</div>
<div class="row"><button type="button" id="replay">Replay</button></div>

<h2>3. Hover, CSS only</h2>
<p>Hover over the logo: the M bars lift one after another. Each bar has <code>data-letter</code> and a <code>--i</code> index to stagger with.</p>
<div class="card lift">${interactiveSvg('logo-horizontal')}</div>
<pre>.lift:hover .logo-bar[data-letter="M"] { transform: translateY(-8%); }</pre>

<h2>4. JavaScript</h2>
<p>Click any bar or letter. Every shape has <code>data-index</code>, and letters carry <code>data-char</code> and <code>data-word</code>.</p>
<div class="card pick">${interactiveSvg('logo')}</div>
<output id="picked">Nothing selected yet.</output>
<pre>logo.addEventListener('click', (e) =&gt; {
  const part = e.target.closest('.logo-bar, .logo-glyph');
  part?.classList.toggle('is-lit');
});</pre>
</main>
<script>
const themed = document.querySelector('#themed .logo');
document.querySelectorAll('[data-p]').forEach((b) => b.addEventListener('click', () => {
  themed.style.setProperty('--logo-primary', b.dataset.p || null);
  themed.style.setProperty('--logo-secondary', b.dataset.s || null);
  if (!b.dataset.p) { themed.style.removeProperty('--logo-primary'); themed.style.removeProperty('--logo-secondary'); }
  b.parentElement.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
}));
document.getElementById('replay').addEventListener('click', () => {
  const svg = document.querySelector('#intro .logo');
  svg.classList.remove('logo--intro');
  void svg.getBoundingClientRect();
  svg.classList.add('logo--intro');
});
const out = document.getElementById('picked');
document.querySelector('.pick .logo').addEventListener('click', (e) => {
  const part = e.target.closest('.logo-bar, .logo-glyph');
  if (!part) return;
  part.classList.toggle('is-lit');
  const d = part.dataset;
  out.textContent = part.classList.contains('logo-bar')
    ? 'Bar ' + d.index + ' of the ' + d.letter
    : 'Letter ' + d.char + ' (' + d.word + ', #' + d.index + ')';
});
</script>
</body>
</html>
`,
  );
}

// Logo PNGs (transparent) at fixed widths, default + light.
for (const name of Object.keys(lockups)) {
  const [, , w, h] = lockups[name].vb;
  for (const pal of ['default', 'light']) {
    const svg = svgDoc(lockups[name].vb, paint(lockups[name].body, CONFIG.palettes[pal]));
    for (const W of CONFIG.logoPngWidths) {
      const suffix = pal === 'default' ? '' : `-${pal}`;
      write(`png/${name}${suffix}-${W}.png`, await png(svg, W, Math.round((W * h) / w)));
    }
  }
}

// favicon.svg follows the OS colour scheme via classes (presentation attributes lose to CSS).
{
  const { default: d, light } = CONFIG.palettes;
  const css = `<style>.p{fill:${d.p}}.s{fill:${d.s}}@media (prefers-color-scheme:dark){.p{fill:${light.p}}.s{fill:${light.s}}}</style>`;
  const body = lockups.mark.body.replaceAll('fill="__P__"', 'class="p"').replaceAll('fill="__S__"', 'class="s"');
  write('favicon/favicon.svg', svgDoc(squareVb(CONFIG.fill.favicon), body, css));
}

const markSquare = (fill, pal = CONFIG.palettes.default) => svgDoc(squareVb(fill), paint(lockups.mark.body, pal));

// favicon.ico: 16, 32, 48 PNGs in an ICO container.
{
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map((s) => png(markSquare(CONFIG.fill.favicon), s, s)));
  const header = Buffer.alloc(6 + 16 * sizes.length);
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
  write('favicon/favicon.ico', Buffer.concat([header, ...pngs]));
  for (const s of [16, 32, 48, 64, 96, 128, 256])
    write(`favicon/favicon-${s}.png`, await png(markSquare(CONFIG.fill.favicon), s, s));
}

// App icons.
write('favicon/apple-touch-icon.png', await png(markSquare(CONFIG.fill.apple), 180, 180, CONFIG.iconBackground));
for (const s of [192, 512]) write(`favicon/icon-${s}.png`, await png(markSquare(CONFIG.fill.any), s, s));
write('favicon/icon-maskable-512.png', await png(markSquare(CONFIG.fill.maskable), 512, 512, CONFIG.iconBackground));
write(
  'favicon/icon-maskable-dark-512.png',
  await png(markSquare(CONFIG.fill.maskable, CONFIG.palettes.light), 512, 512, CONFIG.iconBackgroundDark),
);
write(
  'favicon/site.webmanifest',
  JSON.stringify(
    {
      name: 'Sam Mullins',
      short_name: 'Sam Mullins',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      theme_color: CONFIG.iconBackground,
      background_color: CONFIG.iconBackground,
      display: 'browser',
    },
    null,
    2,
  ) + '\n',
);

// Default social image: stacked logo centred on the icon background.
{
  const { width: W, height: H, logoHeight } = CONFIG.og;
  const [, , lw, lh] = lockups.logo.vb;
  const h = Math.round(H * logoHeight);
  const w = Math.round((h * lw) / lh);
  const logo = await png(svgDoc(lockups.logo.vb, paint(lockups.logo.body, CONFIG.palettes.default)), w, h);
  const og = await sharp({ create: { width: W, height: H, channels: 4, background: CONFIG.iconBackground } })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
  write('png/og-default.png', og);
}

// Preview sheet: every SVG on light and dark tiles.
{
  const svgs = files.filter((f) => f.startsWith('svg/'));
  const tile = (f) => {
    const dark = /-(light|white)\.svg$/.test(f);
    return `<figure class="${dark ? 'dark' : ''}"><img src="${f}" alt=""><figcaption>${f}</figcaption></figure>`;
  };
  const pngs = files.filter((f) => f.startsWith('favicon/') && f.endsWith('.png'));
  write(
    'index.html',
    `<!doctype html><meta charset="utf-8"><title>Brand kit</title>
<style>body{font:14px system-ui;margin:2rem;background:#f4f4f5;color:#111}h2{margin-top:2.5rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
figure{margin:0;background:#fff;border:1px solid #ddd;border-radius:8px;padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;color:#111}
figure.dark{background:#0b0b0c;color:#ddd}figure img{max-width:100%;height:110px;object-fit:contain}
figcaption{font:12px ui-monospace,monospace;opacity:.7}.icons{display:flex;gap:1.5rem;align-items:end;flex-wrap:wrap}
.icons figure img{height:auto;width:auto}</style>
<h1>Brand kit</h1><p>Generated by <code>scripts/brand/kit.mjs</code> from <code>${SRC.replaceAll('\\', '/')}</code>. Do not edit by hand.</p>
<p><a href="interactive/demo.html">Interactive logo demo</a> (inline SVG with CSS and JS hooks)</p>
<h2>SVG</h2><div class="grid">${svgs.map(tile).join('')}</div>
<h2>Icons (actual size)</h2><div class="icons">${pngs.map((f) => `<figure><img src="${f}" alt=""><figcaption>${f.replace('favicon/', '')}</figcaption></figure>`).join('')}</div>
<h2>Social</h2><div class="grid"><figure><img src="png/og-default.png" alt="" style="height:auto"><figcaption>png/og-default.png</figcaption></figure></div>
`,
  );
}

// ---------- 5. Optionally install the web icons into the site ----------
if (args.site) {
  const pub = resolve('public');
  for (const f of [
    'favicon.svg',
    'favicon.ico',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
    'icon-maskable-512.png',
    'site.webmanifest',
  ])
    copyFileSync(join(OUT, 'favicon', f), join(pub, f));
  // The header and footer inline these (src/components/Logo.astro), so CSS can colour and animate each shape.
  const assets = resolve('src/assets/brand');
  for (const f of ['logo.svg', 'logo-horizontal.svg', 'mark.svg'])
    copyFileSync(join(OUT, 'interactive', f), join(assets, f));
  console.log('Copied favicon + app icons into public/ and the interactive logos into src/assets/brand/');
}

console.log(`${files.length} files written to ${OUT}`);
console.log(`mark ${JSON.stringify(box.mark)}\nwordmark ${JSON.stringify(box.wordmark)}`);
