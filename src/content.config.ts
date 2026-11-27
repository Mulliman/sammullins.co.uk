/**
 * Content model (ticket 101).
 *
 * Every page is a typed list of blocks. A malformed block, missing alt text or
 * missing authorship fails the build, which is the safety net for AI-written content.
 * Field reference: _docs/content-model.md
 */
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { pageThemes } from './styles/themes';
import { iconNames } from './lib/icons';

type ImageFn = SchemaContext['image'];

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

const align = z.enum(['center', 'left']);
/** Section background, as the original site, with alternating light, grey and dark bands. */
const surface = z.enum(['default', 'muted', 'inverse']);
/** A button link (as the original "How it was made" and "View more" buttons). */
const cta = z.object({ label: z.string().min(1), href: z.string().min(1) });

/** An image with mandatory alt text. `alt: ""` only when explicitly decorative. */
const imageRef = (image: ImageFn) =>
  z
    .object({
      src: image(),
      alt: z.string(),
      decorative: z.boolean().default(false),
    })
    .refine((v) => v.decorative || v.alt.trim().length > 0, {
      message: 'Image needs alt text (or set decorative: true)',
      path: ['alt'],
    });

const collectionName = z.enum(['articles', 'software', 'albums']);

/** A short label (ticket 1005), e.g. a kind, a ticket id or "phone". The tone colours its edge; the text carries the meaning. */
const badge = z.object({
  label: z.string().min(1),
  tone: z.enum(['neutral', 'note', 'tip', 'warning']).default('neutral'),
});

/** Query used by `cards` and `listing` to pull items from a collection. */
const query = z.object({
  from: collectionName,
  tags: z.array(z.string()).optional(),
  kind: z.enum(['article', 'note']).optional(),
  status: z.enum(['active', 'legacy']).optional(),
  archived: z.enum(['exclude', 'include', 'only']).default('exclude'),
  parent: z.string().optional(),
  topLevelOnly: z.boolean().default(false),
  sort: z.enum(['date-desc', 'date-asc', 'order', 'title']).default('date-desc'),
  limit: z.number().int().positive().optional(),
});

/* ------------------------------------------------------------------ */
/* Blocks (discriminated union on `type`)                              */
/* ------------------------------------------------------------------ */

const leafBlocks = (image: ImageFn) => {
  const img = imageRef(image);

  const hero = z.object({
    type: z.literal('hero'),
    variant: z.enum(['image', 'blurred', 'plain']).default('blurred'),
    heading: z.string(),
    subheading: z.string().optional(),
    image: img.optional(),
    align: align.default('center'),
    /** Up to two links under the heading (ticket 210); the first is the solid button. */
    ctas: z.array(cta).max(2).optional(),
    /** plain only (ticket 210): the logo's bars drawn large and quiet beside the text. */
    mark: z.boolean().default(false),
  });

  const intro = z.object({
    type: z.literal('intro'),
    heading: z.string().optional(),
    lead: z.string().optional(),
    cta: cta.optional(),
    /** A second, quieter button beside `cta` (ticket 509). */
    secondaryCta: cta.optional(),
    align: align.default('center'),
    /** editorial: magazine-scale heading and display-face pull-quote lead. */
    variant: z.enum(['default', 'editorial']).default('default'),
    surface: surface.default('muted'),
  });

  const prose = z.object({
    type: z.literal('prose'),
    markdown: z.string(),
    align: align.default('left'),
    surface: surface.default('default'),
  });

  const callout = z.object({
    type: z.literal('callout'),
    tone: z.enum(['note', 'tip', 'warning', 'legacy']).default('note'),
    title: z.string().optional(),
    body: z.string(),
  });

  const imageBlock = z.object({
    type: z.literal('image'),
    image: img,
    caption: z.string().optional(),
    width: z.enum(['content', 'wide', 'full']).default('content'),
    /** thick: 10px white frame with shadow (the site photo look); none: bare image. */
    frame: z.enum(['thick', 'none']).default('thick'),
    /** blurred: the photo sits over a blurred, darkened copy of itself (as the home hero). */
    backdrop: z.enum(['none', 'blurred']).default('none'),
    surface: surface.default('default'),
  });

  const gallery = z.object({
    type: z.literal('gallery'),
    heading: z.string().optional(),
    columns: z.number().int().min(1).max(4).default(3),
    surface: surface.default('default'),
    images: z.array(img.and(z.object({ caption: z.string().optional() }))).min(1),
  });

  const cardItem = z.object({
    title: z.string(),
    text: z.string().optional(),
    image: img.optional(),
    href: z.string().optional(),
    /** Button label; shown when the card has an href. */
    cta: z.string().optional(),
    /** A rosette in the card's corner for an award the item won (ticket 509). */
    award: z
      .object({
        label: z.string().min(1),
        title: z.string().min(1),
        detail: z.string().optional(),
      })
      .optional(),
  });

  const cards = z.object({
    type: z.literal('cards'),
    heading: z.string().optional(),
    variant: z.enum(['full', 'image', 'text', 'row']).default('full'),
    columns: z.number().int().min(1).max(4).default(3),
    surface: surface.default('default'),
    items: z.array(cardItem).optional(),
    query: query.optional(),
  });

  const listing = z.object({
    type: z.literal('listing'),
    heading: z.string().optional(),
    variant: z.enum(['grid', 'list', 'notes']).default('grid'),
    surface: surface.default('default'),
    query,
  });

  const logoWall = z.object({
    type: z.literal('logoWall'),
    heading: z.string().optional(),
    /** logos: open logo grid in grey until hovered. grid: architectural hairline-ruled specimen grid.
        badges: certificates and awards, in full colour with no tile, at a fixed size (ticket 509). */
    variant: z.enum(['logos', 'badges', 'grid']).default('logos'),
    surface: surface.default('default'),
    /** `details` (Markdown, ticket 509): clicking the logo opens a small popover with this text, and
        `href` becomes a "Visit" link in it (opening a new tab). Without details, `href` links the logo. */
    logos: z
      .array(
        z.object({
          name: z.string().min(1),
          logo: image(),
          href: z.url().optional(),
          details: z.string().min(1).optional(),
        }),
      )
      .min(1),
  });

  const quote = z.object({
    type: z.literal('quote'),
    /** display: large and centred, for a line that opens a band (ticket 509). */
    variant: z.enum(['default', 'display']).default('default'),
    text: z.string(),
    attribution: z.string().optional(),
    source: z.url().optional(),
  });

  const code = z.object({
    type: z.literal('code'),
    lang: z.string().default('text'),
    code: z.string(),
    filename: z.string().optional(),
  });

  const nextPrev = z.object({
    type: z.literal('nextPrev'),
    prev: z.object({ title: z.string(), href: z.string() }).optional(),
    next: z.object({ title: z.string(), href: z.string() }).optional(),
  });

  const timeline = z.object({
    type: z.literal('timeline'),
    heading: z.string().optional(),
    surface: surface.default('default'),
    items: z
      .array(
        z.object({
          when: z.coerce.string(),
          title: z.string(),
          org: z.string().optional(),
          kind: z.enum(['role', 'cert', 'milestone', 'education']).default('role'),
          body: z.string().optional(),
        }),
      )
      .min(1),
  });

  const embed = z.object({
    type: z.literal('embed'),
    provider: z.literal('youtube'),
    id: z.string().regex(/^[\w-]{6,20}$/),
    title: z.string().min(1),
    poster: img.optional(),
  });

  /** Numbered steps (ticket 1005). Each step is Markdown, optionally followed by a command or snippet with a Copy button. */
  const steps = z.object({
    type: z.literal('steps'),
    heading: z.string().optional(),
    items: z
      .array(
        z.object({
          text: z.string().min(1),
          code: z
            .object({ lang: z.string().default('text'), code: z.string().min(1), filename: z.string().optional() })
            .optional(),
        }),
      )
      .min(1),
  });

  /** Oversized editorial metrics and stepped scale progressions. */
  const figures = z.object({
    type: z.literal('figures'),
    heading: z.string().optional(),
    variant: z.enum(['columns', 'ladder']).default('columns'),
    align: align.default('left'),
    surface: surface.default('default'),
    items: z
      .array(
        z.object({
          title: z.string().min(1),
          value: z.string().min(1),
          /** A monochrome logo shown in place of the visible title (the title stays for screen readers). */
          logo: image().optional(),
          prefix: z.string().optional(),
          suffix: z.string().optional(),
          text: z.string().optional(),
        }),
      )
      .min(1),
  });

  /** Hairline-ruled editorial list: titled two-column rows or a tabular numbered rail. */
  const indexList = z.object({
    type: z.literal('indexList'),
    heading: z.string().optional(),
    /** columns (ticket 509): centred columns, icon on top, like the original site's skill bands. */
    variant: z.enum(['ruled', 'numbered', 'columns']).default('ruled'),
    surface: surface.default('default'),
    items: z
      .array(
        z.object({
          title: z.string().optional(),
          /** A line icon beside the row, from src/lib/icons.ts (ticket 509). */
          icon: z.enum(iconNames).optional(),
          text: z.string().min(1),
        }),
      )
      .min(1),
  });

  /** Magazine-scale display statements, or an acrostic: lines whose bold first letters spell a word.
      `~~words~~` are struck through as the line scrolls into view (ticket 509). */
  const statement = z.object({
    type: z.literal('statement'),
    heading: z.string().optional(),
    variant: z.enum(['manifesto', 'acrostic']).default('manifesto'),
    align: align.default('left'),
    surface: surface.default('default'),
    lines: z.array(z.string().min(1)).min(1),
  });

  /** Places the file Markdown body (rendered by Astro, with Prism) at this position. */
  const body = z.object({
    type: z.literal('body'),
    surface: surface.default('default'),
  });

  return [
    hero,
    intro,
    prose,
    body,
    callout,
    imageBlock,
    gallery,
    cards,
    listing,
    logoWall,
    quote,
    code,
    nextPrev,
    timeline,
    embed,
    steps,
    figures,
    indexList,
    statement,
  ] as const;
};

export const blockSchema = (image: ImageFn) => {
  const leaves = leafBlocks(image);
  const leaf = z.discriminatedUnion('type', leaves);
  // `split` holds exactly one level of nested (non-split) blocks.
  const split = z.object({
    type: z.literal('split'),
    ratio: z.enum(['1:1', '1:2', '2:1']).default('1:1'),
    reverseOnMobile: z.boolean().default(false),
    /** Pin the first column beside longer content on desktop while scrolling. */
    /** true or "start" pins the first column; "end" pins the second (ticket 509). */
    sticky: z.union([z.boolean(), z.enum(['start', 'end'])]).default(false),
    /** Keep both columns within the narrow text measure, so short text and small logos sit together. */
    narrow: z.boolean().default(false),
    columns: z.tuple([z.array(leaf), z.array(leaf)]),
  });
  // `section` is one full-width band (background and spacing) holding components in order, as the
  // original site did (a heading and its cards share a section). Children render without their own
  // band, so their `surface` is ignored. Heroes are full-bleed, so they never nest.
  const [, ...nestable] = leaves;
  // `disclosure` (ticket 1005) is a closed-by-default row (<details>) that opens to show its blocks.
  // It needs no JS. `status: done` strikes the summary and adds a "Done" badge. It holds the same
  // blocks a section does (not sections, splits or other disclosures), and can sit inside a section.
  const disclosure = z.object({
    type: z.literal('disclosure'),
    summary: z.string().min(1),
    badges: z.array(badge).optional(),
    status: z.enum(['todo', 'done']).default('todo'),
    open: z.boolean().default(false),
    blocks: z.array(z.discriminatedUnion('type', nestable)).min(1),
  });
  const section = z.object({
    type: z.literal('section'),
    surface: surface.default('default'),
    spacing: z.enum(['none', 'small', 'normal']).default('normal'),
    // A split may sit in a section too (ticket 509): it then shares the section's band.
    blocks: z.array(z.discriminatedUnion('type', [...nestable, disclosure, split])).min(1),
  });
  return z.discriminatedUnion('type', [...leaves, split, disclosure, section]);
};

/* ------------------------------------------------------------------ */
/* Base entry schema                                                   */
/* ------------------------------------------------------------------ */

const base = (image: ImageFn) =>
  z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(200),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: imageRef(image).optional(),
    /** Who wrote the words: `sam` or `sam-ai` (Sam + AI). Not about how the page was built. */
    authorship: z.enum(['sam', 'sam-ai']),
    archived: z.boolean().default(false),
    hidden: z.boolean().default(false),
    noindex: z.boolean().default(false),
    /** Page theme (ticket 207): colours from src/styles/themes/<theme>.css, e.g. `christmas`. */
    theme: z.enum(pageThemes).default('default'),
    blocks: z.array(blockSchema(image)).default([]),
  });

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: ({ image }) => base(image),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) =>
    base(image).extend({
      date: z.coerce.date(),
      kind: z.enum(['article', 'note']).default('article'),
      /** Numbered series this article belongs to, e.g. `5-cool-things`; `order` is its part number. */
      series: z.string().optional(),
      order: z.number().int().positive().optional(),
    }),
});

const software = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/software' }),
  schema: ({ image }) =>
    base(image).extend({
      status: z.enum(['active', 'legacy']).default('active'),
      /** Docs series this page belongs to, e.g. `xstatic-for-umbraco`. */
      series: z.string().optional(),
      order: z.number().optional(),
    }),
});

const albums = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/albums' }),
  schema: ({ image }) => base(image).extend({ date: z.coerce.date().optional() }),
});

const redirects = defineCollection({
  loader: file('./src/data/redirects.json'),
  schema: z.object({
    to: z.string(),
    status: z.union([z.literal(301), z.literal(302)]).default(301),
    reason: z.string(),
  }),
});

/**
 * The style guide's components examples (ticket 1304). Each entry's `block` is validated by the real block
 * schema at build time, so an example that would not pass on a page fails the build.
 */
const styleGuideExamples = defineCollection({
  loader: file('./src/content/style-guide/components.yaml'),
  schema: ({ image }) => z.object({ title: z.string().min(1), block: blockSchema(image) }),
});

const link = z.object({ label: z.string(), href: z.string() });

const settings = defineCollection({
  loader: file('./src/data/site.yaml'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    nav: z.array(link),
    footerLinks: z.array(link),
    socials: z.array(link.extend({ handle: z.string(), href: z.url() })),
    footerCards: z.array(z.object({ title: z.string(), body: z.string() })),
    analytics: z
      .object({
        goatcounter: z
          .string()
          .regex(/^[a-z0-9-]*$/)
          .default(''),
      })
      .default({ goatcounter: '' }),
    features: z.object({
      /** Ticket 211: the masthead shrinks to a bar and stays on screen as you scroll. */
      stickyHeader: z.boolean().default(true),
      blurToSharpHero: z.boolean().default(false),
    }),
  }),
});

export const collections = { pages, articles, software, albums, redirects, settings, styleGuideExamples };
