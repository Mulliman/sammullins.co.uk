/**
 * Markdown twin of every page: /<path>/index.md (ticket 901).
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { entryToMarkdown } from '../../lib/agent-md';
import { urlFor, type AnyEntry } from '../../lib/content';

export const getStaticPaths = (async () => {
  const all: AnyEntry[] = [
    ...(await getCollection('pages')),
    ...(await getCollection('articles')),
    ...(await getCollection('software')),
    ...(await getCollection('albums')),
  ];
  return all.map((entry) => {
    const path = urlFor(entry).replace(/^\/|\/$/g, '');
    return { params: { slug: path || undefined }, props: { entry } };
  });
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const md = await entryToMarkdown((props as { entry: AnyEntry }).entry);
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
