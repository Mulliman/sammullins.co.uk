#!/usr/bin/env node
/**
 * One-shot migration: xStatic/Umbraco HTML → typed content files (ticket 501).
 *
 *   node scripts/migrate/migrate.mjs <xstatic-output-dir> [--dry]
 *
 * Reads every legacy index.html, classifies each Umbraco block-list section and writes
 * Markdown + YAML front matter at a path mirroring the legacy URL. Unmapped markup is
 * reported in _docs/legacy/migration-report.md. Safe to re-run; it overwrites outputs.
 * Can be deleted after launch (see ticket 1205).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, posix } from 'node:path';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';

const [, , srcDir, ...flags] = process.argv;
if (!srcDir) {
  console.error('Usage: node scripts/migrate/migrate.mjs <xstatic-output-dir> [--dry]');
  process.exit(1);
}
const DRY = flags.includes('--dry');
const ROOT = process.cwd();
const report = [];

/* ---------------- helpers ---------------- */

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : n === 'index.html' ? [p] : [];
  });
}

const urlOf = (file) =>
  '/' +
  relative(srcDir, dirname(file)).split(/[\\/]/).filter(Boolean).join('/') +
  (relative(srcDir, dirname(file)) ? '/' : '');

/** Legacy URL → [collection, id]. */
function target(url) {
  const segs = url.split('/').filter(Boolean);
  if (segs.length === 0) return ['pages', 'home'];
  if (segs[0] === 'articles' && segs.length > 1) return ['articles', segs.slice(1).join('/')];
  if (segs[0] === 'software' && segs.length > 1) return ['software', segs.slice(1).join('/')];
  if (segs[0] === 'photography' && segs[1] === 'photoshare21' && segs.length > 2)
    return ['albums', segs.slice(2).join('/')];
  return ['pages', segs.join('/')];
}

const outFileFor = (collection, id) => join(ROOT, 'src', 'content', collection, `${id}.md`);

/** /media/<id>/<name>(--WxH)?.<ext>?query → repo asset path (posix, from repo root). */
function mediaAsset(src) {
  if (!src) return undefined;
  const clean = src.replace(/^https?:\/\/(www\.)?sammullins\.co\.uk/, '').split('?')[0];
  const m = clean.match(/^\/media\/([^/]+)\/(.+?)(--\d+x\d+)?\.([a-z0-9]+)$/i);
  if (!m) return undefined;
  const [, id, name, , ext] = m;
  const isSvg = ext.toLowerCase() === 'svg';
  return `src/assets/media/${id}/${name.toLowerCase()}.${isSvg ? 'svg' : 'avif'}`;
}

function relAsset(fromFile, asset) {
  let r = relative(dirname(fromFile), join(ROOT, asset)).split('\\').join('/');
  if (!r.startsWith('.')) r = './' + r;
  return r;
}

const text = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');

function yamlStr(s) {
  return JSON.stringify(s ?? '');
}

/** Minimal YAML emitter for our plain data (objects, arrays, strings, numbers, booleans). */
function toYaml(value, indent = 0) {
  const pad = '  '.repeat(indent);
  if (Array.isArray(value)) {
    if (value.length === 0) return ' []';
    return value
      .map((v) => {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          const lines = toYaml(v, indent + 1)
            .replace(/^\n/, '')
            .split('\n');
          lines[0] = lines[0].replace(/^\s*/, '');
          return `\n${pad}- ${lines.join('\n')}`;
        }
        return `\n${pad}-${toYaml(v, indent + 1)}`;
      })
      .join('');
  }
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([k, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v === '' && k !== 'alt'))
      .map(([k, v]) => {
        if (v && typeof v === 'object') return `\n${pad}${k}:${toYaml(v, indent + 1)}`;
        return `\n${pad}${k}:${toYaml(v, indent + 1)}`;
      })
      .join('');
  }
  if (typeof value === 'string') {
    if (value.includes('\n')) {
      const inner = value
        .replace(/\s+$/, '')
        .split('\n')
        .map((l) => (l ? '  '.repeat(indent) + l : ''))
        .join('\n');
      return ` |-\n${inner}`;
    }
    return ' ' + yamlStr(value);
  }
  return ' ' + String(value);
}

/* ---------------- markdown conversion ---------------- */

function makeTurndown(outFile, url) {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '_',
  });
  td.keep([]);
  td.remove(['script', 'style']);
  td.addRule('fencedCode', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_c, node) => {
      const code = node.textContent.replace(/\n$/, '');
      const lang = guessLang(code);
      return `\n\n\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });
  td.addRule('images', {
    filter: 'img',
    replacement: (_c, node) => {
      const src = node.getAttribute('src');
      const alt = (node.getAttribute('alt') || '').replace(/[\[\]]/g, '');
      const asset = mediaAsset(src);
      if (asset) return `![${alt}](${relAsset(outFile, asset)})`;
      report.push(`- ${url}: external/unknown image kept as link: \`${src}\``);
      return src ? `![${alt}](${src})` : '';
    },
  });
  td.addRule('links', {
    filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
    replacement: (content, node) => {
      let href = node.getAttribute('href').replace(/^https?:\/\/(www\.)?sammullins\.co\.uk/, '') || '/';
      if (href.startsWith('/media/')) {
        const a = mediaAsset(href);
        if (a) href = href.split('?')[0];
      }
      const label = content.trim() || href;
      return `[${label}](${href})`;
    },
  });
  td.addRule('iframes', {
    filter: 'iframe',
    replacement: () => '',
  });
  return td;
}

function guessLang(code) {
  if (/^\s*</.test(code) && /<\/?[a-z][\s\S]*>/i.test(code)) return 'html';
  if (/^\s*\$[a-z]+\s*=|Read-Host|Write-Host|\$MyInvocation/m.test(code)) return 'powershell';
  if (/^\s*(npm|npx|pnpm|dotnet|git|cd)\s/m.test(code)) return 'bash';
  if (/\b(public|private|namespace|using)\s+[A-Z]/.test(code) || (/;\s*$/m.test(code) && /\bvar\b|\bnew\b/.test(code)))
    return 'csharp';
  if (/^\s*[{[]/.test(code) && /"\s*:/.test(code)) return 'json';
  return '';
}

/* ---------------- section classification ---------------- */

function cardsFrom(section, outFile, url) {
  const items = [];
  for (const card of section.querySelectorAll('.uk-card')) {
    const title = text(card.querySelector('h3, h2, .uk-card-title'));
    const body = card.querySelector('.uk-card-body');
    const p = body ? body.querySelectorAll('p').map(text).filter(Boolean).join(' ') : '';
    const img = card.querySelector('img');
    const link = card.querySelector('a.uk-position-cover') || card.querySelector('a[href]');
    let href = link?.getAttribute('href')?.replace(/^https?:\/\/(www\.)?sammullins\.co\.uk/, '') || undefined;
    if (href === '#') href = undefined;
    const asset = mediaAsset(img?.getAttribute('src'));
    const item = { title: title || undefined, text: p || undefined, href };
    if (asset) item.image = { src: relAsset(outFile, asset), alt: '', decorative: true };
    if (!title && !p && img) item._logoOnly = true;
    if (!title && !p && !img) continue;
    items.push(item);
  }
  return items;
}

function classify(section, ctx) {
  const cls = section.getAttribute('class') || '';
  const surface = cls.includes('uk-section-secondary')
    ? 'inverse'
    : cls.includes('uk-section-muted')
      ? 'muted'
      : 'default';

  // 1. Blurred hero
  if (cls.includes('uf-blurred-background-image')) {
    const img = section.querySelector('img');
    const overlay = section.querySelector('.uk-overlay') || section.querySelector('.uf-non-blurred');
    const h1 = overlay?.querySelector('h1');
    const rest = overlay ? overlay.querySelectorAll('h2, h3, h4, p').map(text).filter(Boolean) : [];
    const asset = mediaAsset(img?.getAttribute('src'));
    const block = { type: 'hero', variant: asset ? 'blurred' : 'plain', heading: text(h1) || ctx.title };
    if (rest[0]) block.subheading = rest[0];
    if (asset) block.image = { src: relAsset(ctx.outFile, asset), alt: img.getAttribute('alt') || '' };
    if (block.image && !block.image.alt) block.image.alt = ctx.title;
    return [{ kind: 'block', block }];
  }

  // 1b. Album prev/next navigation (PhotoShare21 week links)
  const navLinks = (section.querySelector('.uk-visible\\@m') || section).querySelectorAll(
    'a.uf-background-dark-translucent',
  );
  const allNav = section.querySelectorAll('a.uf-background-dark-translucent');
  if (allNav.length > 3) {
    // Index of albums (week tiles) → cards with the tile background as the image.
    const items = allNav.map((a) => {
      const bg = a.parentNode?.getAttribute?.('style')?.match(/url\('([^']+)'\)/)?.[1];
      const asset = mediaAsset(bg);
      const item = {
        title: [text(a.querySelector('h4')), text(a.querySelector('h3'))].filter(Boolean).join(': '),
        href: a.getAttribute('href'),
      };
      if (asset) item.image = { src: relAsset(ctx.outFile, asset), alt: '', decorative: true };
      return item;
    });
    const seen = new Set();
    const unique = items.filter((i) => !seen.has(i.href) && seen.add(i.href));
    return [{ kind: 'block', block: { type: 'cards', variant: 'image', columns: 3, surface, items: unique } }];
  }
  if (navLinks.length) {
    const toLink = (a) => ({
      title: [text(a.querySelector('h4')), text(a.querySelector('h3'))].filter(Boolean).join(': '),
      href: a.getAttribute('href'),
    });
    const block = { type: 'nextPrev' };
    for (const a of navLinks) {
      const isPrev = a.innerHTML.includes('arrow-left');
      block[isPrev ? 'prev' : 'next'] = toLink(a);
    }
    const series = section.querySelector('.uf-cursive')?.closest('.uk-card');
    const out = [{ kind: 'block', block }];
    if (series) {
      out.push({
        kind: 'block',
        block: {
          type: 'cards',
          variant: 'text',
          surface: 'muted',
          columns: 1,
          items: [
            {
              title: text(series.querySelector('h2')),
              text: text(series.querySelector('p')),
              href: series.querySelector('a')?.getAttribute('href'),
            },
          ],
        },
      });
    }
    return out;
  }

  // 1c. Single full-width photo section
  const imgs = section.querySelectorAll('img');
  const onlyText = text(section).length === 0;
  if (imgs.length === 1 && onlyText && !section.querySelector('[uk-lightbox], .uk-card')) {
    const asset = mediaAsset(imgs[0].getAttribute('src'));
    if (asset)
      return [
        {
          kind: 'block',
          block: {
            type: 'image',
            width: 'wide',
            image: { src: relAsset(ctx.outFile, asset), alt: imgs[0].getAttribute('alt') || ctx.title },
          },
        },
      ];
  }

  // 2. Gallery
  const lightbox = section.querySelector('[uk-lightbox]');
  if (lightbox) {
    const images = lightbox
      .querySelectorAll('a')
      .map((a) => {
        const img = a.querySelector('img');
        const asset = mediaAsset(a.getAttribute('href')) || mediaAsset(img?.getAttribute('src'));
        if (!asset) {
          report.push(`- ${ctx.url}: gallery image not mapped: ${a.getAttribute('href')}`);
          return null;
        }
        const alt = img?.getAttribute('alt') || '';
        const caption = a.getAttribute('data-caption') || undefined;
        return { src: relAsset(ctx.outFile, asset), alt: alt || 'Photograph', ...(caption ? { caption } : {}) };
      })
      .filter(Boolean);
    const heading = text(section.querySelector('h2, h3')) || undefined;
    if (images.length) return [{ kind: 'block', block: { type: 'gallery', heading, images } }];
  }

  // 3. Card grid
  if (section.querySelector('.uk-card')) {
    const items = cardsFrom(section, ctx.outFile, ctx.url);
    if (items.length && items.every((i) => i._logoOnly) && items.length >= 4) {
      return [
        {
          kind: 'block',
          block: { type: 'logoWall', logos: items.map((i) => ({ name: logoName(i.image.src), logo: i.image.src })) },
        },
      ];
    }
    const clean = items.map(({ _logoOnly, ...i }) => i).filter((i) => i.title);
    if (clean.length) {
      const variant = clean.every((i) => i.image && !i.text) ? 'image' : clean.some((i) => i.image) ? 'full' : 'text';
      const heading = text(section.querySelector(':scope h2')) || undefined;
      return [
        {
          kind: 'block',
          block: {
            type: 'cards',
            heading,
            variant,
            surface,
            columns: Math.min(3, Math.max(1, clean.length)),
            items: clean,
          },
        },
      ];
    }
  }

  const out = [];

  // 4. Video embeds
  for (const iframe of section.querySelectorAll('iframe')) {
    const m = (iframe.getAttribute('src') || '').match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,20})/);
    if (m)
      out.push({
        kind: 'block',
        block: {
          type: 'embed',
          provider: 'youtube',
          id: m[1],
          title: iframe.getAttribute('title') || `${ctx.title} (video)`,
        },
      });
    else report.push(`- ${ctx.url}: unmapped iframe ${iframe.getAttribute('src')}`);
  }

  // 5. Page header (secondary section with h1)
  const h1 = section.querySelector('h1');
  if (h1 && surface === 'inverse') {
    const time = section.querySelector('time');
    if (time) ctx.date = time.getAttribute('datetime');
    const lead = text(section.querySelector('.uk-text-lead')) || undefined;
    ctx.lead = lead;
    return [{ kind: 'block', block: { type: 'hero', variant: 'plain', heading: text(h1), subheading: lead } }, ...out];
  }

  // 6. Heading-only section → intro
  const container = section.querySelector('.uk-width-2-3\\@s') || section.querySelector('.uk-container') || section;
  const td = makeTurndown(ctx.outFile, ctx.url);
  const md = td.turndown(container.innerHTML).trim();
  const onlyHeading = /^#{1,3} [^\n]+$/.test(md);
  if (onlyHeading) {
    out.unshift({
      kind: 'block',
      block: {
        type: 'intro',
        heading: md.replace(/^#+ /, ''),
        surface: surface === 'inverse' ? 'inverse' : surface,
        align: 'center',
      },
    });
    return out;
  }
  if (md) out.unshift({ kind: 'text', md, surface });
  return out;
}

function logoName(src) {
  const base = src
    .split('/')
    .pop()
    .replace(/\.(avif|svg)$/, '');
  const known = {
    ahl: 'AHL',
    rcs: 'RCS',
    rnli: 'RNLI',
    wyso: 'WYSO',
    mace: 'Mace',
    c4: 'Channel 4',
    clarion: 'Clarion',
    cg: 'CG',
    haart: 'haart',
    fab: 'FAB',
    hs: 'HS',
    iv: 'IV',
  };
  return known[base] ?? base.toUpperCase();
}

/* ---------------- per-page ---------------- */

const ARCHIVE_ALL_ARTICLES = true;
const LEGACY_SOFTWARE = ['xstatic-for-umbraco', 'xpedite-for-umbraco', 'umbracofolio'];
const files = walk(srcDir);
const written = [];

// Link order of child pages within each parent page, for series ordering.
const linkOrder = new Map();
for (const f of files) {
  const url = urlOf(f);
  const html = readFileSync(f, 'utf8');
  const hrefs = [...html.matchAll(/href="(\/software\/[^"#?]+\/)"/g)].map((m) => m[1]);
  linkOrder.set(url, [...new Set(hrefs)]);
}

for (const file of files) {
  const url = urlOf(file);
  const [collection, id] = target(url);
  const outFile = outFileFor(collection, id);
  const html = readFileSync(file, 'utf8');
  const root = parse(html, { comment: false });

  const rawTitle =
    root.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    text(root.querySelector('title')).replace(/\s*-\s*Sam Mullins\s*$/, '');
  const title = rawTitle.trim() || id;
  let description = (root.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim();
  const ogImage = root.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const ctx = { url, title, outFile, date: undefined, lead: undefined };

  const list = root.querySelector('.umb-block-list');
  if (!list) {
    report.push(`- ${url}: no .umb-block-list found, skipped`);
    continue;
  }

  const parts = list.childNodes
    .filter((n) => n.nodeType === 1 && (n.getAttribute('class') || '').includes('uk-section'))
    .flatMap((s) => classify(s, ctx));

  // First contiguous text run → Markdown body; later runs → prose blocks.
  const blocks = [];
  let body = '';
  let bodyPlaced = false;
  let run = [];
  let runSurface = 'default';
  const flush = () => {
    if (!run.length) return;
    const md = run.join('\n\n');
    if (!bodyPlaced) {
      body = md;
      blocks.push({ type: 'body', surface: runSurface });
      bodyPlaced = true;
    } else blocks.push({ type: 'prose', markdown: md });
    run = [];
  };
  let heroSeen = false;
  for (const p of parts) {
    if (p.kind === 'text') {
      if (!run.length) runSurface = p.surface;
      run.push(p.md);
      continue;
    }
    flush();
    let b = p.block;
    // Only one hero (one <h1>) per page: later heroes become wide images or headings.
    if (b.type === 'hero') {
      if (heroSeen) {
        b = b.image
          ? { type: 'image', width: 'wide', image: b.image, caption: b.subheading }
          : { type: 'intro', heading: b.heading, lead: b.subheading, surface: 'inverse', align: 'center' };
      }
      heroSeen = true;
    }
    blocks.push(b);
  }
  flush();

  // CV: Education / Employment card grids become timelines (ticket 502).
  if (url === '/cv/') {
    for (let i = 1; i < blocks.length; i++) {
      const prev = blocks[i - 1];
      const b = blocks[i];
      if (b.type !== 'cards' || prev.type !== 'intro') continue;
      const kind = /education/i.test(prev.heading) ? 'education' : /employment/i.test(prev.heading) ? 'role' : null;
      if (!kind) continue;
      blocks[i] = {
        type: 'timeline',
        items: b.items
          .map((it) => {
            const m = it.title.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
            return { when: m ? m[2] : '', title: m ? m[1] : it.title, kind, body: it.text };
          })
          .reverse(),
      };
    }
  }

  if (!description) description = ctx.lead || title;
  if (description.length > 200) description = description.slice(0, 197).replace(/\s+\S*$/, '') + '…';

  const fm = { title, description };
  const date = ctx.date || (html.match(/datetime="(\d{4}-\d{2}-\d{2})"/) || [])[1];
  if (date) fm.date = date;
  else if (collection === 'articles') {
    fm.date = '2021-01-01';
    report.push(`- ${url}: no date found; defaulted to 2021-01-01`);
  }

  const coverAsset = mediaAsset(ogImage);
  if (coverAsset) fm.cover = { src: relAsset(outFile, coverAsset), alt: title };
  fm.authorship = 'sam';

  if (collection === 'articles' && ARCHIVE_ALL_ARTICLES) fm.archived = true;
  if (collection === 'software') {
    const top = id.split('/')[0];
    if (LEGACY_SOFTWARE.includes(top)) {
      fm.status = 'legacy';
      fm.archived = true;
    }
    if (id.includes('/')) {
      const parentId = id.split('/').slice(0, -1).join('/');
      fm.series = parentId;
      const order = (linkOrder.get(`/software/${parentId}/`) || []).indexOf(url);
      fm.order = order >= 0 ? order + 1 : 99;
    }
  }
  if (collection === 'albums' || url.startsWith('/photography/')) fm.hidden = true;
  if (url === '/xstatic14/') fm.archived = true;

  fm.blocks = blocks;

  const yaml = toYaml(fm).replace(/^\n/, '');
  const content = `---\n${yaml}\n---\n${body ? `\n${body}\n` : ''}`;
  if (!DRY) {
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, content);
  }
  written.push(`${url} → ${relative(ROOT, outFile).split('\\').join('/')} (${blocks.map((b) => b.type).join(', ')})`);
}

const reportMd = `# Migration report (ticket 501)\n\nGenerated by \`scripts/migrate/migrate.mjs\`. Items below need a human or follow-up ticket.\n\n## Pages written (${written.length})\n\n${written.map((w) => `- ${w}`).join('\n')}\n\n## Notes and unmapped items (${report.length})\n\n${report.join('\n') || '- none'}\n`;
if (!DRY) writeFileSync(join(ROOT, '_docs', 'legacy', 'migration-report.md'), reportMd);
console.log(`${written.length} pages, ${report.length} notes${DRY ? ' (dry run)' : ''}`);
