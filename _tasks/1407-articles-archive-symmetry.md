---
id: "1407"
title: "Articles index and archive in the symmetry design"
epic: Site-wide design
status: todo
priority: p1
size: S
owner: agent
depends_on: ["1402", "1404"]
---

## Why

`/articles/` and `/archive/` should look like the home page's "What I've written lately" band.

## Scope

Files: `src/content/pages/articles.md`, `src/content/pages/archive.md` only.

- Heroes: `plain`, `align: center`, one or two line subheadings.
- Wrap each listing in a `section` with a centred `intro` heading (move the listing's own `heading` into it) and alternate `muted` and `default` surfaces; the last band before the footer is not dark.
- Use `listing` `variant: grid` where the list is short (up to about nine); keep `list` or `notes` for long lists (ticket 1402 removes their rules).
- Archive: "Software and documentation" no longer includes xStatic (ticket 1404); check the photography links still read well as two `cards`.

## Acceptance criteria

- [ ] Both pages follow the symmetry rules.
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
