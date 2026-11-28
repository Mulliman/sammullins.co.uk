---
id: "1401"
title: "Symmetry design rules: write them down and make them the defaults"
epic: Site-wide design
status: done
priority: p1
size: M
owner: agent
depends_on: ["509"]
---

## Why

Sam chose the symmetry variation of the home page (ticket 509, 27 November 2026) and wants the whole site to match it. The rules only exist in that page's front matter and in the conversation; agents will not know them.

## Scope

- Add a "Symmetry design rules" decision to `_docs/decisions.md`:
  1. Section headings are centred, with an optional centred subtitle of two lines at most (on a desktop).
  2. Longer text is left-aligned in the narrow column (`prose`).
  3. Components in a section are balanced or symmetrical, not strictly.
  4. No hairline rules or borders where avoidable; use space, a tonal surface or a soft shadow (`--shadow-card-rest`). Card edges are fine as soft shadows.
  5. Generous space around sections and titles on every screen; images, icons and figures compact on phones.
  6. The footer's four boxes (logo, What do I do?, Free stuff!, Get in touch): 1 x 4, 2 x 2, one column.
  7. Phones: centred logo, theme toggle left, icon-only menu right.
  8. Monochrome palette and the existing fonts; logos and project images keep their colours.
- Change block defaults so a new page gets the look without overrides: `indexList.variant` defaults to `columns`; `figures.align` and `statement.align` default to `center`. Keep every enum value covered by a style guide example (the components page build fails otherwise).
- Add a short "Page patterns" note to the style guide components page (or `_docs/content-model.md`) showing the band recipe: `section` > centred `intro` > component > optional left `prose`, alternating `muted` and `default` surfaces, last band before the footer never dark.
- Run `pnpm skills:catalogue` and `pnpm skills:sync`.

## Acceptance criteria

- [ ] The decision is in `_docs/decisions.md`, linked from `AGENTS.md`.
- [ ] New defaults are live, and every page that relied on the old defaults says so explicitly (no visual change to existing pages from the default switch).
- [ ] `pnpm verify` passes.

## Notes

Done by the orchestrator (Opus), not a worker: it touches shared files.
