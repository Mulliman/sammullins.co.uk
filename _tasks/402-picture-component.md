---
id: "402"
title: Responsive Picture component
epic: Media
status: review
priority: p0
size: S
owner: agent
depends_on: ["401"]
---

## Why

All images are served as responsive AVIF with a WebP fallback; no JPEG (decisions: *Image storage & formats*).

## Scope

- Wrapper over Astro's `<Picture>`: `formats: ['avif','webp']`, `widths`/`sizes` presets (`content`, `wide`, `full`, `card`, `thumb`), and `loading`/`decoding` defaults.
- A `priority` option for LCP images.
- Open Graph social cards are the one exception: generate one JPEG per page at build time for crawler compatibility.

## Acceptance criteria

- [ ] Output `<picture>` has AVIF and WebP sources, with width and height set.
- [ ] No `.jpg`/`.png` content images in `dist/` other than the Open Graph cards.
