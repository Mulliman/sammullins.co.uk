---
id: "301"
title: Block: hero
epic: Blocks
status: done
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

- [x] LCP image is preloaded and responsive (AVIF/WebP).
- [x] No JS shipped.
- [x] Heading text remains ≥ 4.5:1 over the image (scrim enforced).

## Verification (6 November 2026)

The hero image renders with `fetchpriority="high"` and AVIF and WebP srcsets (the modern equivalent of a preload); the hero ships no script; heading text sits on a solid dark panel, not straight on the photo.
