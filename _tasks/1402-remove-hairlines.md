---
id: "1402"
title: "Remove the remaining hairline rules across blocks and layout pieces"
epic: Site-wide design
status: todo
priority: p1
size: M
owner: agent
depends_on: ["1401"]
---

## Why

Rule 4 of the symmetry design (ticket 1401): no hairline borders where avoidable. The home page is clean, but other blocks still draw 1px rules.

## Scope

Files (and only these): `src/blocks/Callout.astro`, `Disclosure.astro`, `Gallery.astro`, `IndexList.astro`, `Listing.astro`, `NextPrev.astro`, `Quote.astro`, `Steps.astro`, `Timeline.astro`, `Hero.astro`; `src/components/Card.astro` (the `text` variant only), `ArticleHeader.astro`, `Badge.astro`.

For each decorative 1px rule (`border`, `border-top/bottom/left/right` of 1px or 2px used as a divider or frame):
- Dividers between rows or items: replace with spacing (a gap of `var(--space-s)` or more), or alternate a tonal background (`var(--color-bg-muted)` on default bands, `var(--color-surface)` on muted ones) with `border-radius: var(--radius-m)`.
- Boxes and frames (callouts, disclosures, steps, next/prev): a tonal background with a radius, or `box-shadow: var(--shadow-card-rest)`; no border.
- Keep borders that carry meaning or are needed for accessibility: focus outlines, form inputs, code blocks, table cell borders inside article bodies, and the coloured left edge of a callout if it is the only thing that tells the tone apart (then make it 4px and the tone colour, not a hairline).
- Keep hover and focus feedback (swap border-colour changes for a background or shadow change).

## Acceptance criteria

- [ ] No decorative 1px or 2px border remains in the listed files (list any you kept, with the reason, in your report).
- [ ] Light and dark both look intentional (the orchestrator checks screenshots).
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
