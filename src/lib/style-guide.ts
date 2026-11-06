/**
 * The style guide's pages, in reading order (ticket 1301).
 *
 * Guide pages are hand-written .astro routes under src/pages/style-guide/. They are unlisted:
 * noindex, not linked from the site, and left out of the sitemap and llms.txt.
 *
 * Set `ready: true` when a page exists. The side nav and previous/next links only use ready pages,
 * so a page that is not built yet is never linked.
 */
export interface StyleGuidePage {
  title: string;
  href: string;
  summary: string;
  ready: boolean;
}

export const styleGuidePages: StyleGuidePage[] = [
  {
    title: 'Overview',
    href: '/style-guide/',
    summary: 'What the guide is and what it covers.',
    ready: true,
  },
  {
    title: 'Foundations',
    href: '/style-guide/foundations/',
    summary: 'Colour, type, space, radius, shadow and motion tokens.',
    ready: false,
  },
  {
    title: 'Themes',
    href: '/style-guide/themes/',
    summary: 'The light and dark themes, and the page themes.',
    ready: false,
  },
  {
    title: 'Elements',
    href: '/style-guide/elements/',
    summary: 'Headings, text, links, lists, tables, code and the other bare HTML elements.',
    ready: false,
  },
  {
    title: 'Components',
    href: '/style-guide/components/',
    summary: 'Every block and variant, with the YAML that produces it.',
    ready: true,
  },
  {
    title: 'Page structures',
    href: '/style-guide/page-structures/',
    summary: 'Example page layouts built from the blocks.',
    ready: false,
  },
];

/** The pages that exist, in order. These are the only ones the guide links to. */
export function readyStyleGuidePages(): StyleGuidePage[] {
  return styleGuidePages.filter((p) => p.ready);
}

/** The ready guide pages either side of `pathname`, for previous and next links. */
export function styleGuideNeighbours(pathname: string): {
  prev: StyleGuidePage | undefined;
  next: StyleGuidePage | undefined;
} {
  const ready = readyStyleGuidePages();
  const i = ready.findIndex((p) => p.href === pathname);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: i > 0 ? ready[i - 1] : undefined, next: ready[i + 1] };
}
