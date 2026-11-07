---
id: "205"
title: Spacing scale and section rhythm
epic: Design system
status: review
priority: p0
size: M
owner: agent
depends_on: ["207"]
---

## Why

On 6 November 2026 Sam decided to keep the original colours, so this is no longer a palette change. Centralising the colours and adding page themes moved to 207. What's left is spacing: sections still use UIkit's fixed 40px and 70px padding, and full-width grey bands dominate the home page.

## Scope

- A fluid spacing scale to match the type scale (utopia.fyi space pairs), replacing the fixed section padding.
- Fewer full-width grey bands: separate sections with spacing and hairlines.
- Radius and shadow tokens: one small radius, one large, and one soft shadow.

## Acceptance criteria

- [x] No fixed px spacing is left in `src/blocks` or `src/components` (grep check). It is now a hygiene test, so it stays that way.
- [x] `pnpm test:a11y` is green in both themes (12 of 12, including the 320px check).

## Verification (6 November 2026, overnight)

- **Fluid scale.** The `--space-*` steps keep their old values at 360px wide and grow by the body-text ratio (1.125x) to 1280px, as utopia.fyi space values. One-step pairs (`--space-s-m`, `--space-m-l`, `--space-l-xl`) open up more on wide screens.
- **Section rhythm.** Sections keep the original UIkit sizes, 40px on a phone to 72px on desktop (was 70px), and tight sections 16px to 27px (was 15px to 25px), but fluid instead of jumping at 960px. Hero padding, card padding, grid gaps, the intro button gap and the header use tokens too.
- **Bands.** Two plain sections in a row are now split by a 1px hairline, so a page can drop grey bands without its sections running together. Which bands the home page drops is content work for 312; no content changed here.
- **Shape.** `--radius` (4px) and a new `--radius-l` (12px). The soft shadow already existed as a theme token (`--shadow-soft`).
- **What it looks like.** `pnpm compare` against the 313 branch: at 1280px every page is taller because spacing now grows with the type. The home page by 250px (5%), the CV by 512px (11%, it has the most spacing), the components page by 4%. At 360px the values are the same as before. Screenshots are in `.compare/` in this worktree (not committed).

Sam to judge: whether the extra space on wide screens is right. If it's too much, the fix is one number, the 1.125 growth used to compute the token values.
