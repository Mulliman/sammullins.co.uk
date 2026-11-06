<!--
  GENERATED FILE. Do not edit by hand.
  Source: src/content.config.ts. Generator: scripts/skills/block-catalogue.mjs.
  Regenerate with: pnpm skills:catalogue
-->

# Block catalogue

Every page body is a list of blocks in front matter under `blocks:`. Each block has a `type` and the fields below. 17 types. Field reference and gotchas: [`_docs/content-model.md`](../../../_docs/content-model.md).

Field types are as written in the Zod schema. "optional" means the key may be left out. A "default" is what the site uses when the key is left out.

## Shared shapes

### `imageRef`

Image with mandatory alt text.

```text
src: image path (relative to the .md file), processed by Astro
alt: string. Required and non-empty unless decorative is true
decorative: boolean, default false
```

### `query`

Collection query used by cards and listing.

```text
from: articles | software | albums (pages cannot be queried)
tags: string list (optional), matches any tag
kind: article | note (optional, articles only)
status: active | legacy (optional, software only)
archived: exclude | include | only, default exclude
parent: string (optional), id prefix, e.g. a software product
topLevelOnly: boolean, default false
sort: date-desc | date-asc | order | title, default date-desc
limit: positive integer (optional)
```

## Block types

| type | fields |
|---|---|
| `hero` | `variant`, `heading`, `subheading`, `image`, `align` |
| `intro` | `kicker`, `heading`, `lead`, `cta`, `align`, `surface` |
| `prose` | `markdown`, `align`, `surface` |
| `body` | `surface` |
| `callout` | `tone`, `title`, `body` |
| `image` | `image`, `caption`, `width`, `surface` |
| `gallery` | `heading`, `columns`, `surface`, `images` |
| `cards` | `heading`, `variant`, `columns`, `surface`, `items`, `query` |
| `listing` | `heading`, `variant`, `surface` |
| `logoWall` | `heading`, `surface`, `logos` |
| `quote` | `text`, `attribution`, `source` |
| `code` | `lang`, `code`, `filename` |
| `nextPrev` | `prev`, `next` |
| `timeline` | `heading`, `surface`, `items` |
| `embed` | `provider`, `id`, `title`, `poster` |
| `split` | `ratio`, `reverseOnMobile`, `columns` |
| `section` | `surface`, `spacing`, `blocks` |

## `hero`

| field | type | required | default |
|---|---|---|---|
| `variant` | image \| blurred \| plain | no | `'blurred'` |
| `heading` | string | yes |  |
| `subheading` | string | no |  |
| `image` | imageRef | no |  |
| `align` | center \| left | no | `'center'` |

## `intro`

| field | type | required | default |
|---|---|---|---|
| `kicker` | string | no |  |
| `heading` | string | no |  |
| `lead` | string | no |  |
| `cta` | cta | no |  |
| `align` | center \| left | no | `'center'` |
| `surface` | surface | no | `'muted'` |

## `prose`

| field | type | required | default |
|---|---|---|---|
| `markdown` | string | yes |  |
| `align` | center \| left | no | `'left'` |
| `surface` | surface | no | `'default'` |

## `body`

| field | type | required | default |
|---|---|---|---|
| `surface` | surface | no | `'default'` |

## `callout`

| field | type | required | default |
|---|---|---|---|
| `tone` | note \| tip \| warning \| legacy | no | `'note'` |
| `title` | string | no |  |
| `body` | string | yes |  |

## `image`

| field | type | required | default |
|---|---|---|---|
| `image` | imageRef | yes |  |
| `caption` | string | no |  |
| `width` | content \| wide \| full | no | `'content'` |
| `surface` | surface | no | `'default'` |

## `gallery`

| field | type | required | default |
|---|---|---|---|
| `heading` | string | no |  |
| `columns` | number (min 1) (max 4) | no | `3` |
| `surface` | surface | no | `'default'` |
| `images` | z.array(imageRef and (z.object({ caption: string }))) (min 1) | no |  |

## `cards`

| field | type | required | default |
|---|---|---|---|
| `heading` | string | no |  |
| `variant` | full \| image \| text | no | `'full'` |
| `columns` | number (min 1) (max 4) | no | `3` |
| `surface` | surface | no | `'default'` |
| `items` | list of cardItem | no |  |
| `query` | query | no |  |

## `listing`

| field | type | required | default |
|---|---|---|---|
| `heading` | string | no |  |
| `variant` | grid \| list \| notes | no | `'grid'` |
| `surface` | surface | no | `'default'` |

## `logoWall`

| field | type | required | default |
|---|---|---|---|
| `heading` | string | no |  |
| `surface` | surface | no | `'default'` |
| `logos` | z.array(z.object({ name: string (min 1), logo: image(), href: url })) (min 1) | no |  |

## `quote`

| field | type | required | default |
|---|---|---|---|
| `text` | string | yes |  |
| `attribution` | string | no |  |
| `source` | url | no |  |

## `code`

| field | type | required | default |
|---|---|---|---|
| `lang` | string | no | `'text'` |
| `code` | string | yes |  |
| `filename` | string | no |  |

## `nextPrev`

| field | type | required | default |
|---|---|---|---|
| `prev` | z.object({ title: string, href: string }) | no |  |
| `next` | z.object({ title: string, href: string }) | no |  |

## `timeline`

| field | type | required | default |
|---|---|---|---|
| `heading` | string | no |  |
| `surface` | surface | no | `'default'` |
| `items` | z .array(z.object({ when: string (coerced), title: string, org: string, kind: role \| cert \| milestone \| education, body: string, }),)  (min 1) | no | `'role'` |

## `embed`

| field | type | required | default |
|---|---|---|---|
| `provider` | "youtube" | yes |  |
| `id` | string.regex(/^[\w-]{6,20}$/) | yes |  |
| `title` | string (min 1) | yes |  |
| `poster` | imageRef | no |  |

## `split`

| field | type | required | default |
|---|---|---|---|
| `ratio` | 1:1 \| 1:2 \| 2:1 | no | `'1:1'` |
| `reverseOnMobile` | boolean | no | `false` |
| `columns` | z.tuple([list of leaf, list of leaf]) | yes |  |

## `section`

| field | type | required | default |
|---|---|---|---|
| `surface` | surface | no | `'default'` |
| `spacing` | none \| small \| normal | no | `'normal'` |
| `blocks` | z.array(z.discriminatedUnion('type', nestable)) (min 1) | yes |  |
