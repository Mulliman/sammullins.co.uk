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

## Candidate palettes (6 November 2026)

Rendered on the real home and article pages in `design-audit-2026-11/shots/palettes-205.jpg`. Every pair passes WCAG AA; the lowest is the link on the muted surface (4.78 to 5.37:1).

| Token | A. Warm paper | B. Cool slate | C. Stone and ink |
|---|---|---|---|
| bg | `#f8f6f1` | `#ffffff` | `#fbfaf9` |
| bg-muted | `#efebe3` | `#f3f5f8` | `#f1efec` |
| bg-inverse | `#1a1917` | `#0f1729` | `#0c0a09` |
| text | `#3b3a36` | `#3d4452` | `#2f2d2a` |
| text-muted | `#5c5a54` | `#5a6272` | `#57534e` |
| heading | `#1a1917` | `#0f1729` | `#0c0a09` |
| border | `#ddd8ce` | `#dde2ea` | `#e2ded8` |
| link | `#9a5200` | `#9a5200` | `#a3540a` |

Dark-theme values follow once Sam picks one.
