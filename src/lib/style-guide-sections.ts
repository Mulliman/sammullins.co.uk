/**
 * The style guide's components, grouped (Sam, 28 November 2026: one page of every block was
 * overwhelming). Each group is a page at /style-guide/components/<slug>/; the components index lists them.
 *
 * Every block type must be in exactly one group, every block needs at least one example, and every enum
 * option of a block must appear in an example. The build fails otherwise (ticket 1304's checks).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection } from 'astro:content';
import { guideFor, snippetsFrom } from './style-guide-components';
import type { Block } from './content';
import { parseSchema, describeField, enumOptions } from '../../scripts/skills/schema-blocks.mjs';

export interface ComponentGroup {
  slug: string;
  title: string;
  summary: string;
  types: string[];
}

export const componentGroups: ComponentGroup[] = [
  {
    slug: 'openers',
    title: 'Openers and headings',
    summary: 'The hero that opens a page, the centred heading that opens a band, big quotes and statements.',
    types: ['hero', 'intro', 'quote', 'statement'],
  },
  {
    slug: 'text',
    title: 'Text and code',
    summary: 'Left-aligned reading text, the page body, callouts, code and numbered steps.',
    types: ['prose', 'body', 'callout', 'code', 'steps'],
  },
  {
    slug: 'cards-and-lists',
    title: 'Cards and lists',
    summary: 'Cards, article listings, icon columns and rows, timelines and previous and next links.',
    types: ['cards', 'listing', 'indexList', 'timeline', 'nextPrev'],
  },
  {
    slug: 'figures-and-logos',
    title: 'Figures and logos',
    summary: 'Big numbers with context, and logo walls and badges that can open a popover.',
    types: ['figures', 'logoWall'],
  },
  {
    slug: 'media',
    title: 'Images and video',
    summary: 'Single images, galleries with a lightbox, and video that loads only when played.',
    types: ['image', 'gallery', 'embed'],
  },
  {
    slug: 'layout',
    title: 'Layout',
    summary: 'Bands that hold other blocks, two-column splits, and rows that open on click.',
    types: ['section', 'split', 'disclosure'],
  },
];

export interface ComponentSection {
  type: string;
  id: string;
  title: string;
  summary: string;
  fields: { key: string; type: string; optional: boolean; dflt?: string }[];
  examples: { id: string; title: string; block: Block; yaml: string }[];
}

/** Every block's section (fields and examples), keyed by block type, with the guide's checks applied. */
export async function componentSections(): Promise<Map<string, ComponentSection>> {
  const root = process.cwd();
  const schema = parseSchema(readFileSync(join(root, 'src/content.config.ts'), 'utf8'));
  const snippets = snippetsFrom(readFileSync(join(root, 'src/content/style-guide/components.yaml'), 'utf8'));
  const entries = await getCollection('styleGuideExamples');
  const byId = new Map(entries.map((e) => [e.id, e]));
  if (byId.size !== snippets.size) {
    throw new Error(`style guide: ${byId.size} examples in the collection but ${snippets.size} in components.yaml`);
  }

  const grouped = componentGroups.flatMap((g) => g.types);
  for (const type of schema.blocks.keys()) {
    if (!grouped.includes(type)) throw new Error(`style guide: block type "${type}" is in no component group`);
  }

  const out = new Map<string, ComponentSection>();
  for (const type of schema.blocks.keys()) {
    const guide = guideFor(type);
    const examples = [...snippets.keys()].flatMap((id) => {
      const entry = byId.get(id);
      if (!entry) throw new Error(`style guide: example "${id}" is missing from the collection`);
      return entry.data.block.type === type ? [{ id, entry }] : [];
    });
    if (examples.length === 0) throw new Error(`style guide: no example for block type "${type}"`);
    for (const { key, values } of enumOptions(schema.blocks.get(type)!, schema.shared)) {
      for (const value of values) {
        const shown = examples.some(({ entry }) => JSON.stringify(entry.data.block).includes(`"${key}":"${value}"`));
        if (!shown) throw new Error(`style guide: no ${type} example uses ${key}: ${value}`);
      }
    }
    const fields = (schema.blocks.get(type) ?? [])
      .filter((f: { key: string }) => f.key !== 'type')
      .map((f: { key: string; expr: string }) => ({ key: f.key, ...describeField(f.expr, schema.shared) }));
    out.set(type, {
      type,
      id: `block-${type}`,
      title: guide.title,
      summary: guide.summary,
      fields,
      examples: examples.map(({ id, entry }) => ({
        id,
        title: entry.data.title,
        block: entry.data.block,
        yaml: snippets.get(id)!,
      })),
    });
  }
  return out;
}
