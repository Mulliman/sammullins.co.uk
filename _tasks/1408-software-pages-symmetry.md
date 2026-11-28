---
id: "1408"
title: "Software product and docs pages in the symmetry design"
epic: Site-wide design
status: done
priority: p1
size: M
owner: agent
depends_on: ["1402", "1404"]
---

## Why

Product pages (xStatic, XPEDITE, PanoCapture, PostCapture, UmbracoFolio, Sage of Empires, Is Baby In A Book) and their docs should match the home page.

## Scope

Files: `src/content/software/*.md` and the docs folders under `src/content/software/` (not `the-imposter.md`, which ticket 1403 moves; not `page-structure-example-*`).

- Heroes: `align: center`; a subheading of one or two lines (shorten by moving the rest into the body, never by rewording facts).
- Body text stays left-aligned (the `body` block already is).
- Card rows at the end of pages ("Give it a go", related pages): `variant: row` or `full` in a centred, balanced grid; no `text` cards with rules.
- xStatic: add the award rosette to its "Give it a go" or hero-adjacent card if there is one (`award: { label: "Winner", title: "Umbraco Package Award", detail: "Best newcomer 2021" }`).
- Docs pages (series with prev/next) only need the hero alignment; leave their bodies alone.

## Acceptance criteria

- [ ] Every listed page has a centred hero and no rule-style cards.
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
