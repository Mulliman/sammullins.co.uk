---
id: "301"
title: Block: hero
epic: Blocks
status: todo
priority: p0
size: M
owner: agent
depends_on: ["102", "402"]
---

## Why

Replaces HeroFeatureImage, FeatureImage and LargeImage. Photo-led heroes are part of the identity.

## Scope

- Variants:
  - `image`: framed image with an overlay heading
  - `blurred`: blurred background of the same image, with a sharp framed image in front (today's look)
  - `plain`: text only
- Fields: `heading`, `subheading?`, `image?` (+alt), `variant`, `align: center|left`.
- Parallax is CSS-only (scroll-driven animations with `@supports`), and disabled under reduced motion.
- The hero image is `fetchpriority="high"` and not lazy.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [ ] LCP image is preloaded and responsive (AVIF/WebP).
- [ ] No JS shipped.
- [ ] Heading text remains ≥ 4.5:1 over the image (scrim enforced).
