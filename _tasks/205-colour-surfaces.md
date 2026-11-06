---
id: "205"
title: Spacing scale and section rhythm
epic: Design system
status: todo
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

- [ ] No fixed px spacing is left in `src/blocks` or `src/components` (grep check).
- [ ] `pnpm test:a11y` is green in both themes.
