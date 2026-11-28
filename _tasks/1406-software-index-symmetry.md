---
id: "1406"
title: "Software index in the symmetry design, linking the party games section"
epic: Site-wide design
status: done
priority: p1
size: M
owner: agent
depends_on: ["1402", "1403", "1404"]
---

## Why

`/software/` still has a long hero paragraph, image-and-text slabs, and a The Imposter band that now lives in the party games section.

## Scope

File: `src/content/pages/software.md` only.

- Hero: `plain`, `align: center`, "Software", a one or two line subheading; move the rest of the current subheading into a left `prose` in the first band.
- Bands (alternating surfaces), each a centred `intro` with a short subtitle and a balanced component:
  - For families: Is Baby In A Book (`cards` `row`).
  - For web developers: xStatic (with its `award`: Winner, Umbraco Package Award, Best newcomer 2021) and XPEDITE as `cards` `row` `columns: 2`; the two paragraphs about UmbracoFolio, Astro and Umbraco as left `prose` under them.
  - For photographers: PostCapture and PanoCapture (`cards` `row`, `columns: 2`), if they are not already elsewhere on the page.
  - For everyone: a short intro and a link card to `/party-games/` (the `party-games.avif` image from ticket 1403), replacing the old Imposter band.
- Keep every existing link working.

## Acceptance criteria

- [ ] The page follows the symmetry rules; The Imposter band is replaced by the party games link.
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
