---
id: "1409"
title: "Article pages and the 404 in the symmetry design"
epic: Site-wide design
status: todo
priority: p1
size: M
owner: agent
depends_on: ["1402"]
---

## Why

Article pages are built by a template (`ArticleHeader`, `Body`, `EntryPage`), not front matter, so they need their own pass.

## Scope

Files: `src/components/ArticleHeader.astro`, `src/components/EntryPage.astro`, `src/pages/404.astro` only (`Body.astro` belongs to ticket 1402).

- Article header: title and meta (date, reading time, tags) centred; the description as a centred subtitle of at most about two lines on a desktop (clamp or shorten visually; never cut the text from the page source); no rules between title, meta and body.
- The "From the archive" banner: keep its words, as a tonal panel with a radius, not a bordered box.
- The article body stays left-aligned in the narrow column.
- The 404: a centred heading and subtitle, a centred row of links (home, articles, software).

## Acceptance criteria

- [ ] An article page and the 404 follow the symmetry rules in light and dark.
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
