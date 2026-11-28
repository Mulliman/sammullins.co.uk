---
id: "1405"
title: "CV in the symmetry design"
epic: Site-wide design
status: done
priority: p1
size: M
owner: agent
depends_on: ["1402"]
---

## Why

The CV is the page most visitors see after the home page; it still uses the older look (text cards with rules).

## Scope

File: `src/content/pages/cv.md` (and `src/lib/icons.ts`: you may add icons). Keep the words; restructure only.

- Hero: `plain`, `align: center`, heading "CV", a subheading of one or two lines; the rest of the current subheading goes into a left `prose` paragraph in the first band.
- Facts to update: Sam's role moved to Allianz Technology under TUPE in 2023 and to Tata Consultancy Services (TCS) under TUPE in 2025, still leading the team on the Allianz account (see the home page). Split the last employment entry into Allianz (2023 to 2025) and TCS (2025 to present) using the home page's wording; fix the description's "at Allianz Technology" the same way.
- Employment: newest first. Each band follows the home recipe: centred `intro`, then a balanced component. Use `cards` `variant: text` in two columns (ticket 1402 removes their rules).
- Technical skills (six) and soft skills (three): `indexList` `variant: columns` with icons. Add any missing icons to `src/lib/icons.ts` from Lucide (`https://cdn.jsdelivr.net/npm/lucide-static@0.469.0/icons/<name>.svg`, copy the inner elements as the existing entries do): suggested `braces` (C#), `file-code` (JS and TS), `palette` (HTML and CSS), `database`, `mic` (public speaking), `pen-line` (written communication); reuse `layers`, `cloud`, `users`.
- Education: two `cards` `text` side by side.
- Open source: `cards` `variant: row`, `columns: 2` with images, like the home page's side projects (xStatic with its `award`, UmbracoFolio, PostCapture, PanoCapture, Party games linking to `/party-games/`). Use images that already exist in `src/assets/media/` (find them from the software pages).
- "A bit about me": centred `intro` heading plus left `prose`. Drop the "Contact me" column: the footer has it.
- Fix the typos you meet (e.g. "warpper", double spaces) without rewording.

## Acceptance criteria

- [ ] The CV follows the symmetry rules and reads newest first.
- [ ] The TCS facts match the home page.
- [ ] `pnpm check` and lint pass.

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
