---
id: "1306"
title: "Style guide: example page structures"
epic: Style guide
status: todo
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

- [ ] Every page type in the content model has an example structure.
- [ ] Each front matter skeleton passes schema validation (test).
- [ ] The skills reference the matching guide page.
- [ ] Sam reviews the structures (they encode how he wants pages built).
