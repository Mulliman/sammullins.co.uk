---
id: "1404"
title: "xStatic is current: take it and its docs out of the archive"
epic: Site-wide design
status: todo
priority: p1
size: S
owner: agent
depends_on: ["1401"]
---

## Why

Sam (27 November 2026): "xStatic should not be 'from the archive'". It is still maintained (the Umbraco 15 failover article, November 2024).

## Scope

- `src/content/software/xstatic-for-umbraco.md`: `archived: false` and `status: "active"`.
- Every page in `src/content/software/xstatic-for-umbraco/` (and its subfolders): `archived: false`.
- Check the archive page and software listings still make sense (xStatic now shows with current software, not on `/archive/`).

## Acceptance criteria

- [ ] No xStatic page shows the "From the archive" banner.
- [ ] `pnpm check` passes.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
