---
id: "304"
title: Block: gallery with dialog lightbox
epic: Blocks
status: done
priority: p0
size: M
owner: agent
depends_on: ["303"]
---

## Why

Replaces Gallery and the UIkit lightbox; needed for the photography albums (decisions: *Photography*).

## Scope

- Responsive masonry-style grid (CSS columns, or grid masonry behind `@supports`).
- Each thumbnail is a real link to the full-size image (works without JS).
- With JS, it's enhanced into a native `<dialog>` lightbox:
  - prev/next buttons and arrow keys
  - Escape closes
  - swipe on touch
  - focus returns to the thumbnail on close
  - counter "3 of 24"
  - caption and alt shown
- Preloads only the next and previous images.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] Works fully without JS, falling back to plain image links.
- [x] Lightbox passes axe and is operable by keyboard alone.
- [x] Gallery JS is ≤ 5 KB gzipped, with no dependencies.

## Verification (6 November 2026)

`tests/a11y/interactions.test.mjs`: without JS every thumbnail links to a full-size image that returns 200; the lightbox opens with Enter, moves with the arrow keys, closes with Escape, returns focus and passes axe while open; the gallery script is under 5 KB gzipped.
