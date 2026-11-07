---
id: "003"
title: Astro config for static, URL-identical output
epic: Foundation
status: review
priority: p0
size: S
owner: agent
depends_on: ["002"]
---

## Why

Every legacy URL must keep working byte-for-byte (decisions: *Legacy content*; audit §4).

## Scope

- `output: 'static'`, `site: 'https://www.sammullins.co.uk'`, `trailingSlash: 'always'`, `build.format: 'directory'`.
- `@astrojs/sitemap` configured, with archived and hidden pages included but deprioritised.
- Image service: sharp; formats AVIF + WebP (see 402).
- Enable Astro's built-in CSP support if stable in the installed version (hashes for inline scripts/styles); otherwise note it for 702.
- Shiki configured for build-time highlighting (used by 307).

## Acceptance criteria

- [ ] A sample page at `src/content/pages/test.md` builds to `dist/test/index.html`.
- [x] `/test` (without the slash) is not emitted as a separate file.
- [x] `dist/sitemap-index.xml` exists with absolute `https://www.` URLs.
- [ ] Zero JS is shipped for a page with no interactive blocks.

## Verification (6 November 2026)

Not met: "zero JS on pages without interactive blocks". Every page ships the theme toggle, agent view and console secret scripts (small, and loaded as modules). Sam: accept this as site-wide by design, or make them load on demand.
