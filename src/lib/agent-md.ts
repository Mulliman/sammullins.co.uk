/**
 * Agent view (ticket 901): render any entry as clean Markdown, i.e. what an LLM should read.
 */
import type { ImageMetadata } from 'astro';
import { containsBlock, runQuery, urlFor, type AnyEntry, type Block } from './content';
import { lastChanged } from './git';

const SITE = 'https://www.sammullins.co.uk';

// Every image asset, keyed by repo path, so relative image links in Markdown bodies can be resolved.
const assets = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{avif,svg,jpg,jpeg,png,webp}', {
  eager: true,
});

function resolveBodyImage(entry: AnyEntry, rel: string): string {
  if (/^https?:/.test(rel) || rel.startsWith('/')) return rel;
  const base = (entry.filePath ?? '').replace(/\\/g, '/').split('/').slice(0, -1);
  for (const seg of rel.split('/')) {
    if (seg === '..') base.pop();
    else if (seg !== '.') base.push(seg);
  }
  const key = '/' + base.join('/');
  const meta = assets[key]?.default;
  return meta ? SITE + meta.src : rel;
}

const abs = (href?: string) => (!href ? '' : href.startsWith('/') ? SITE + href : href);
const img = (m: { src: ImageMetadata; alt: string }) => `![${m.alt}](${SITE}${m.src.src})`;

async function blockToMd(b: Block, entry: AnyEntry): Promise<string> {
  switch (b.type) {
    case 'hero':
      return [`# ${b.heading}`, b.subheading].filter(Boolean).join('\n\n');
    case 'intro':
      return [b.kicker && `_${b.kicker}_`, b.heading && `## ${b.heading}`, b.lead].filter(Boolean).join('\n\n');
    case 'prose':
      return b.markdown;
    case 'body':
      return (entry.body ?? '')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, src) => `![${alt}](${resolveBodyImage(entry, src)})`)
        .trim();
    case 'callout':
      return `> **${b.title ?? b.tone}**\n>\n> ${b.body.replace(/\n/g, '\n> ')}`;
    case 'image':
      return [img(b.image), b.caption && `_${b.caption}_`].filter(Boolean).join('\n\n');
    case 'gallery':
      return [b.heading && `## ${b.heading}`, ...b.images.map((i) => `- ${img(i)}${i.caption ? ` ${i.caption}` : ''}`)]
        .filter(Boolean)
        .join('\n');
    case 'cards': {
      const manual = (b.items ?? []).map(
        (i) => `- ${i.href ? `[${i.title}](${abs(i.href)})` : `**${i.title}**`}${i.text ? `: ${i.text}` : ''}`,
      );
      const queried = b.query
        ? (await runQuery(b.query)).map((e) => `- [${e.data.title}](${SITE}${urlFor(e)}): ${e.data.description}`)
        : [];
      return [b.heading && `## ${b.heading}`, ...manual, ...queried].filter(Boolean).join('\n');
    }
    case 'listing': {
      const items = await runQuery(b.query);
      return [
        b.heading && `## ${b.heading}`,
        ...items.map((e) => `- [${e.data.title}](${SITE}${urlFor(e)}): ${e.data.description}`),
      ]
        .filter(Boolean)
        .join('\n');
    }
    case 'logoWall':
      return [b.heading && `## ${b.heading}`, `Clients: ${b.logos.map((l) => l.name).join(', ')}.`]
        .filter(Boolean)
        .join('\n\n');
    case 'quote':
      return `> ${b.text.replace(/\n/g, '\n> ')}${b.attribution ? `\n>\n> — ${b.attribution}` : ''}`;
    case 'code':
      return `\`\`\`${b.lang}\n${b.code}\n\`\`\``;
    case 'nextPrev':
      return [
        b.prev && `Previous: [${b.prev.title}](${abs(b.prev.href)})`,
        b.next && `Next: [${b.next.title}](${abs(b.next.href)})`,
      ]
        .filter(Boolean)
        .join('\n');
    case 'timeline':
      return [
        b.heading && `## ${b.heading}`,
        ...b.items.map((i) => `- **${i.when}**: ${i.title}${i.org ? `, ${i.org}` : ''}${i.body ? `. ${i.body}` : ''}`),
      ]
        .filter(Boolean)
        .join('\n');
    case 'embed':
      return `[Video: ${b.title}](https://www.youtube.com/watch?v=${b.id})`;
    case 'split': {
      const cols = await Promise.all(
        b.columns.map(async (col) => (await Promise.all(col.map((x) => blockToMd(x, entry)))).join('\n\n')),
      );
      return cols.join('\n\n');
    }
    case 'section':
      return (await Promise.all(b.blocks.map((x) => blockToMd(x, entry)))).filter((p) => p && p.trim()).join('\n\n');
  }
}

export async function entryToMarkdown(entry: AnyEntry): Promise<string> {
  const d = entry.data;
  const blocks: Block[] = [...d.blocks];
  if ((entry.body ?? '').trim() && !containsBlock(blocks, 'body')) blocks.push({ type: 'body', surface: 'default' });
  const updated = lastChanged(entry.filePath) ?? d.updated ?? ('date' in d ? d.date : undefined);
  const fm = [
    '---',
    `title: ${JSON.stringify(d.title)}`,
    `description: ${JSON.stringify(d.description)}`,
    `url: ${SITE}${urlFor(entry)}`,
    'date' in d && d.date ? `date: ${d.date.toISOString().slice(0, 10)}` : '',
    updated ? `updated: ${updated.toISOString().slice(0, 10)}` : '',
    `authorship: ${d.authorship === 'sam-ai' ? 'Sam + AI' : 'Sam'}`,
    d.archived ? 'archived: true' : '',
    '---',
  ]
    .filter(Boolean)
    .join('\n');
  const parts = await Promise.all(blocks.map((b) => blockToMd(b, entry)));
  return `${fm}\n\n${parts.filter((p) => p && p.trim()).join('\n\n')}\n`;
}
