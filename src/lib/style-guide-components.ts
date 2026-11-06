/**
 * Helpers for the style guide's components page (ticket 1304).
 */
import type { Block } from './content';

/** One line on each block type, shown under its heading. Typed so a new block type must be described here. */
export const BLOCK_GUIDE: Record<Block['type'], { title: string; summary: string }> = {
  hero: {
    title: 'Hero',
    summary: 'A full-width opening band with a heading, an optional subheading and an optional photo.',
  },
  intro: {
    title: 'Intro',
    summary: 'A text section with a heading, a larger lead paragraph and an optional button.',
  },
  prose: { title: 'Prose', summary: 'Markdown text at a readable measure, in one band.' },
  body: {
    title: 'Body',
    summary: "The page's own Markdown, rendered where the block sits. The guide shows a stand-in for it.",
  },
  callout: {
    title: 'Callout',
    summary: 'A labelled note. The tone is shown by a label and an icon, never by colour alone.',
  },
  image: {
    title: 'Image',
    summary: 'One photo with an optional caption, at a set width, with an optional frame or blurred backdrop.',
  },
  gallery: { title: 'Gallery', summary: 'A grid of photos that open in a lightbox.' },
  cards: {
    title: 'Cards',
    summary: 'Cards from items written by hand, from a collection query, or both.',
  },
  listing: {
    title: 'Listing',
    summary: 'A collection query shown as a grid, a list or a notes feed. An empty listing renders nothing.',
  },
  logoWall: { title: 'Logo wall', summary: 'A row of logos, each one optionally linked.' },
  quote: { title: 'Quote', summary: 'A pull quote, with an optional attribution and source.' },
  code: { title: 'Code', summary: 'A code block with an optional filename and a Copy button.' },
  nextPrev: { title: 'Next and previous', summary: 'Links to the previous and next pages in a series.' },
  timeline: {
    title: 'Timeline',
    summary: 'A dated list of roles, certificates, milestones or education.',
  },
  embed: { title: 'Embed', summary: 'A YouTube video that loads only after the reader clicks it.' },
  split: {
    title: 'Split',
    summary: 'Two columns of blocks, with a ratio and an option to reverse them on a phone.',
  },
  section: {
    title: 'Section',
    summary: 'One band (surface and spacing) holding several blocks in order.',
  },
};

/** The guide entry for a block type. Throws for a type with no description. */
export function guideFor(type: string): { title: string; summary: string } {
  if (!Object.prototype.hasOwnProperty.call(BLOCK_GUIDE, type)) {
    throw new Error(`style guide: no description for block type "${type}" (add it to BLOCK_GUIDE)`);
  }
  return BLOCK_GUIDE[type as Block['type']];
}

/**
 * The YAML for each example, taken from the source text of components.yaml: the lines under each entry's
 * `block:` key, dedented. Keys are example ids, in file order. The collection validates the same data.
 */
export function snippetsFrom(source: string): Map<string, string> {
  const out = new Map<string, string>();
  let id: string | undefined;
  let inBlock = false;
  let lines: string[] = [];

  const flush = () => {
    if (!id) return;
    const dedented = lines.map((l) => (l.startsWith('    ') ? l.slice(4) : l.trim() === '' ? '' : l));
    out.set(id, dedented.join('\n').replace(/\n+$/, '') + '\n');
  };

  for (const line of source.split('\n')) {
    const top = line.match(/^([A-Za-z][\w-]*):\s*$/);
    if (top) {
      flush();
      id = top[1];
      inBlock = false;
      lines = [];
      continue;
    }
    if (!id) continue;
    if (/^ {2}block:\s*$/.test(line)) {
      inBlock = true;
      continue;
    }
    if (/^ {2}\S/.test(line)) {
      inBlock = false;
      continue;
    }
    if (inBlock) lines.push(line);
  }
  flush();
  return out;
}
