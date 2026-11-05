/**
 * Content helpers: URLs, queries and series navigation (tickets 102, 305).
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type ListableCollection = 'articles' | 'software' | 'albums';
export type AnyEntry =
  | CollectionEntry<'pages'>
  | CollectionEntry<'articles'>
  | CollectionEntry<'software'>
  | CollectionEntry<'albums'>;

export type Block = CollectionEntry<'pages'>['data']['blocks'][number];
export type BlockOf<T extends Block['type']> = Extract<Block, { type: T }>;
export type Query = BlockOf<'listing'>['query'];

/** Public URL for an entry. Always has a trailing slash; mirrors the legacy URL structure. */
export function urlFor(entry: AnyEntry): string {
  switch (entry.collection) {
    case 'pages':
      return entry.id === 'home' ? '/' : `/${entry.id}/`;
    case 'articles':
      return `/articles/${entry.id}/`;
    case 'software':
      return `/software/${entry.id}/`;
    case 'albums':
      return `/photography/photoshare21/${entry.id}/`;
  }
}

/** Source file path, relative to the repo root (for "view source" links). */
export function sourcePathFor(entry: AnyEntry): string {
  return entry.filePath ?? `src/content/${entry.collection}/${entry.id}.md`;
}

const dateOf = (e: AnyEntry) => ('date' in e.data && e.data.date ? e.data.date.valueOf() : 0);

/** Run a block query against a collection. Hidden items are never listed. */
export async function runQuery(q: Query): Promise<AnyEntry[]> {
  let items = (await getCollection(q.from)) as AnyEntry[];
  items = items.filter((e) => !e.data.hidden);

  if (q.archived === 'exclude') items = items.filter((e) => !e.data.archived);
  if (q.archived === 'only') items = items.filter((e) => e.data.archived);
  if (q.tags?.length) items = items.filter((e) => q.tags!.some((t) => e.data.tags.includes(t)));
  if (q.kind) items = items.filter((e) => e.collection === 'articles' && e.data.kind === q.kind);
  if (q.status) items = items.filter((e) => e.collection === 'software' && e.data.status === q.status);
  if (q.parent) items = items.filter((e) => e.id.startsWith(`${q.parent}/`));
  if (q.topLevelOnly) items = items.filter((e) => !e.id.includes('/'));

  const orderOf = (e: AnyEntry) => (e.collection === 'software' ? (e.data.order ?? 999) : 999);
  items.sort((a, b) => {
    switch (q.sort) {
      case 'date-asc': return dateOf(a) - dateOf(b);
      case 'order': return orderOf(a) - orderOf(b) || a.data.title.localeCompare(b.data.title);
      case 'title': return a.data.title.localeCompare(b.data.title);
      default: return dateOf(b) - dateOf(a);
    }
  });

  return q.limit ? items.slice(0, q.limit) : items;
}

/** Previous/next within a software docs series, ordered by `order`. */
export async function seriesNav(entry: CollectionEntry<'software'>) {
  const series = entry.data.series;
  if (!series) return {};
  const all = (await getCollection('software'))
    .filter((e) => e.data.series === series)
    .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
  const i = all.findIndex((e) => e.id === entry.id);
  const toLink = (e?: CollectionEntry<'software'>) => (e ? { title: e.data.title, href: urlFor(e) } : undefined);
  return { prev: toLink(all[i - 1]), next: toLink(all[i + 1]) };
}

export async function getSite() {
  const s = await getEntry('settings', 'site');
  if (!s) throw new Error('src/data/site.yaml is missing the `site` entry');
  return s.data;
}
