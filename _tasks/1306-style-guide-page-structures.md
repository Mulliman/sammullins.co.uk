---
id: "1306"
title: "Style guide: example page structures"
epic: Style guide
status: done
priority: p1
size: M
owner: pair
depends_on: ["1301", "1304"]
---

## Why

Components alone don't show how a page should be put together. The SbS guide has "Demo Layouts" for this. Here, each page type has a typical block order (an article, a note, a software product, a docs series page, an album, the CV, an index page). New pages, and agents writing them, should start from a known-good structure.

## Scope

- One example per page type, built from blocks with placeholder content, rendered at full width:
  - article (header, contents list, series part)
  - note
  - software product page
  - docs page in a series (with prev/next)
  - photo album
  - CV
  - index or listing page
  - the 404
  - a campaign page in a page theme (the advent calendar day, in `christmas`)
- Next to each: the front matter skeleton to copy, and links to one or two real pages of that type.
- Each skill that creates a page (`new-article`, `new-note`, `new-page`) points to its example structure.

## Acceptance criteria

- [x] Every page type in the content model has an example structure.
- [x] Each front matter skeleton passes schema validation (test).
- [x] The skills reference the matching guide page.
- [x] Sam reviews the structures (they encode how he wants pages built).

## Progress

- `src/pages/style-guide/page-structures/index.astro`: one section per page type (article, note, software product, docs page, album, CV, index, 404, campaign). Each has when to use it, the block order, the front matter to copy (with the Code block's copy button), a "See it rendered" link and real pages of that type.
- The skeletons are read from the example files at build time, so the shown YAML cannot drift from the example. Each example is loaded through its collection, so the schema validates it at build.
- Nine unlisted examples, all `hidden: true`, `noindex: true`, `authorship: sam-ai`: `articles/page-structure-example-article` and `-note`, `software/page-structure-example-product` with two docs pages (`page-structure-example-docs`, `-docs-2`, so prev and next both show), `albums/page-structure-example-album`, `pages/page-structure-example-cv`, `-index`, `-advent-day` (theme `christmas`). The 404 example is `/404.html` itself.
- Kept out of listings: the sitemap filter excludes `/page-structure-example`; `llms.txt` now skips hidden and noindex articles and software (no current entries are affected). Listings already exclude `hidden` through `runQuery`.
- Skills: one pointer line each in `new-article`, `new-note` and `new-page`; `pnpm skills:sync` run.
- Gaps: no published note exists, so the note section links to `/articles/`. No advent calendar page exists, so the campaign section links to the themes guide, which shows the `christmas` theme. Neither was invented.
- Not done: visual review in a browser. The structures are checked by build and `tests/style-guide-page-structures.test.mjs` only.
- Found, not fixed: the sitemap already lists the existing `hidden: true` albums (for example `/photography/photoshare21/reptiles/`). That contradicts the content model's "never listed anywhere". It needs its own decision and ticket.

## Sign-off (8 November 2026)

Sam approved the page structures as they are (desk page item 3). Done. The sitemap finding above is still open; ticket 003 says hidden pages are included in the sitemap on purpose, so it is a question for Sam, not a bug.
