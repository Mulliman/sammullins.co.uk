---
id: "306"
title: Block: logoWall
epic: Blocks
status: review
priority: p0
size: S
owner: agent
depends_on: ["303"]
---

## Why

"People I have worked with" on the home page (decisions: *Site structure*). There are 12 client logos today: AHL, RCS, RNLI, WYSO, Mace, C4, Clarion, CG, haart, FAB, HS, IV.

## Scope

- Items: `name` (required, used as alt), `logo`, `href?`.
- Greyscale by default, colour on hover/focus, respecting reduced motion. Responsive grid.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [ ] Every logo has the client name as alt text.
- [ ] Logos stay legible in both themes (use SVG or a light/dark variant where needed).
