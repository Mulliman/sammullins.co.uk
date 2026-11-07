---
id: "303"
title: Block: image
epic: Blocks
status: done
priority: p0
size: S
owner: agent
depends_on: ["402"]
---

## Why

Replaces ContentPicture.

## Scope

- Fields: `src` (image reference), `alt` (required; `alt: ""` allowed only with `decorative: true`), `caption?`, `width: content|wide|full`.
- Uses `<Picture>` (402); `<figure>`/`<figcaption>` when captioned.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] Missing alt without `decorative: true` fails the build.
- [x] Lazy-loaded with intrinsic dimensions, so there's no layout shift (CLS = 0 on the kitchen-sink page).

## Verification (6 November 2026)

The Zod `refine` on images rejects an empty alt unless `decorative: true`; `<img>` has width and height.
