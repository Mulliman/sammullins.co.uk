---
id: "305"
title: Blocks: cards, listing, nextPrev
epic: Blocks
status: todo
priority: p0
size: L
owner: agent
depends_on: ["102", "303"]
---

## Why

Replaces CardsFull, CardsSimpleImage, CardsSimpleText, CardsNavigation, ArticleListing, ArticleListingFancy and FancyNextPrevious. The home page signposts builds (decisions: *Site structure*).

## Scope

- `cards`:
  - `variant: full|image|text`, `columns`
  - items are **either** manual (`title`, `text`, `image`, `href`) **or** a query (`from: articles|software`, `filter` by tags/kind/archived/status, `sort`, `limit`)
  - the whole card is clickable via a single link plus a pseudo-element, never nested links
- `listing`:
  - collection listing with `variant: grid|list|notes` (`notes` is the compact micro-feed style)
  - filters as above
  - excludes `hidden` items, and `archived` items unless asked
- `nextPrev`: generated automatically for software series (from `series` and `order`). It can also be placed manually.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [ ] A query-driven card list updates when a new article is added, with no page edit.
- [ ] Each card link has one accessible name (no duplicate "read more" links).
- [ ] nextPrev uses `<nav aria-label="Series">` with `rel="prev"` and `rel="next"`.
