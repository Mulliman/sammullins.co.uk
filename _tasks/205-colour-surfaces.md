---
id: "205"
title: Colour, surface and spacing refresh
epic: Design system
status: todo
priority: p0
size: M
owner: pair
depends_on: ["204"]
---

## Why

The November 2026 design audit found that the palette and section rhythm are a straight copy of the 2021 UIkit theme: flat grey bands, a #4d4d4d body colour and 4px corners everywhere. With the new type (204) in, the colours and spacing are the next thing that dates the site.

## Scope

- Propose two or three palettes as tokens (ink, paper, accent, accent-ink, muted, border) for light and dark, keeping the brand orange. Show them on the home page and an article, and let Sam pick.
- Add a fluid spacing scale to match the type scale (utopia.fyi space pairs), replacing the fixed UIkit 40/70px section padding.
- Use fewer full-width grey bands: separate sections with spacing and hairlines.
- Radius and shadow tokens: one small and one large radius, and one soft shadow.

## Acceptance criteria

- [ ] Sam picks a palette, and the choice is recorded in `_docs/decisions.md`.
- [ ] Every text and background pair passes WCAG 2.2 AA (`pnpm test:a11y` is green in both themes).
- [ ] No hard-coded colours or px spacing are left in `src/blocks` or `src/components` (grep check).
