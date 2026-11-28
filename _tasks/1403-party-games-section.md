---
id: "1403"
title: "Party games section: an index and a page per game"
epic: Site-wide design
status: done
priority: p1
size: L
owner: agent
depends_on: ["1401"]
---

## Why

Sam has more party games than The Imposter (repo `C:\Projects\party-games`). He wants a party games section that lists and explains them all (27 November 2026).

## Scope

Source of truth: `C:\Projects\party-games\packages\catalog\src\index.ts` (the `GAMES` array: name, tagline, description, players, minutes, url, status, icon) and each game's rules in `C:\Projects\party-games\apps\<slug>\game.html`. Read only; never edit that repo.

- **Icons:** convert `C:\Projects\party-games\apps\site\public\icons\{imposter,tiers,blowhard,spoof}.svg` to AVIF masters in `src/assets/media/party-games/` with sharp (a 600px square, the icon on its own catalogue `colours.bg` so it keeps its colours; `node` with `sharp` from this repo). Also make `party-games.avif`: the four icons side by side on a dark panel, 1600 x 900, for the home page card.
- **Index page** `src/content/pages/party-games.md` (served at `/party-games/`): centred hero (`variant: plain`, `align: center`) "Party games" with a one-line subheading from Sam's README ("Games for a room full of people, each on their own phone."); a band explaining how they work (one person hosts, everyone else joins with a code, no accounts, no app store, installable web apps) as `indexList` `columns` with three icons; then a band with the four games as `cards` (`variant: row`, `columns: 2`, each linking to its page, the icon as the image); beta games say "In beta" in their text.
- **A page per game** in `src/content/pages/party-games/` (`the-imposter.md`, `tiers.md`, `blowhard.md`, `spoof.md`): centred hero with the name and tagline; a band with `figures` (`variant: columns`, `align: center`): players, minutes and status; a band "How to play" as a short `prose` summary of the rules from `game.html` (plain words, five to eight short paragraphs or a list, no rule ids); a "Give it a go" band with a centred `intro` CTA to the catalogue `url`.
- **The Imposter moves** from `/software/the-imposter/` to `/party-games/the-imposter/`: add a 301 in `src/data/redirects.json` (use the `redirect` skill), delete `src/content/software/the-imposter.md`, and update internal links to it in `src/content/articles/*.md` and `src/content/pages/cv.md` (link only; don't touch other text). Keep the old page's history in the new page's Notes as "[Sam to confirm: the old Imposter (the-imposter.web.app, 4 to 7 players) is replaced by the new one]".
- **Home page:** in `src/content/pages/home.md`, replace The Imposter card with a "Party games" card linking to `/party-games/` ("Four games for a room full of people, each on their own phone: The Imposter, It All Ends In Tiers, Blowhard and Spoof.") using `party-games.avif`.

## Acceptance criteria

- [ ] `/party-games/` and the four game pages exist and follow the symmetry rules.
- [ ] `/software/the-imposter/` redirects (301) to `/party-games/the-imposter/`; no internal link points at the old URL.
- [ ] Facts match the catalogue; the old Imposter details are flagged for Sam, not silently dropped.
- [ ] `pnpm check` and lint pass.

## Out of scope

- The site nav (Sam decides whether "Party games" joins Software, Articles and CV).
- The software index page (ticket 1406 links to this section).

## How to work (every 14xx ticket)

- Work in `C:\Projects\sammullins\wt-509-symmetry` on branch `509-symmetry`. Other agents edit other files in the same checkout at the same time: **only touch the files this ticket names**. Do not commit, push, stash, reset or switch branches; the orchestrator reviews, builds and commits.
- **Do not run `pnpm build`, `pnpm verify` or `pnpm dev`** (they share `dist/` and `.astro/` with the other agents). Run `pnpm check` and `pnpm exec eslint <your files>` and `pnpm exec prettier --write <your files>`. If `pnpm check` fails only on files another ticket owns, say so and stop there.
- Follow `AGENTS.md` (British English, no em or en dashes, no colour literals outside `src/styles/themes/`, no inline styles or scripts, `authorship: "sam-ai"` on content you write) and the design rules in ticket 1401 / `_docs/decisions.md` ("Symmetry design rules").
- The home page (`src/content/pages/home.md`) is the reference: copy its patterns.
- Never invent facts, numbers, dates or links. Put `[Sam to confirm: ...]` where unsure.
- Finish with a short report: files changed, anything you could not do, and questions for Sam.
