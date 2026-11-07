---
id: "505"
title: Migrate photography (hidden)
epic: Migration
status: review
priority: p0
size: M
owner: agent
depends_on: ["501", "304"]
---

## Why

Keep photography, but hidden (decisions: *Photography*).

## Scope

- `/photography/`, `/photography/photoshare21/` and the 8 albums at the same URLs, using the gallery block.
- Front matter `hidden: true`: excluded from the main nav and the home listings; linked from the Archive and the footer.
- Write real alt text for every image. Draft it with AI and mark it for Sam's review.

## Acceptance criteria

- [x] All 10 photography URLs build.
- [ ] Every image has non-empty, non-generic alt text.
- [x] Photography does not appear in the main nav.

## Verification (6 November 2026)

Not met: album alt text is generic (titles such as "Cars2", and 12 empty alts not marked decorative). Content work, not urgent while photography is hidden.
