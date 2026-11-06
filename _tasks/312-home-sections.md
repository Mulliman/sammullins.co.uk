---
id: "312"
title: "Home: builds grid, writing list and photo strip"
epic: Blocks
status: todo
priority: p0
size: L
owner: agent
depends_on: ["205", "310"]
---

## Why

Below the hero, the home page is centred text, a big logo wall, one large card and four small ones. Nothing shows recent writing, and the builds read as a list of old Umbraco packages.

## Scope

- A `cards` variant, `bento`: a mixed-size grid for builds, with one featured item.
- A "Writing" list of the latest articles and notes (title, date and reading time), newest first, from a `listing` query.
- A photo strip variant of `gallery`: one row that links to the photography page.
- Recompose `home.md` from these blocks.

## Acceptance criteria

- [ ] The home page shows the three newest articles or notes automatically.
- [ ] The bento grid collapses to one column at 320px without horizontal scroll.
- [ ] The home page's own transfer weight (HTML, CSS and above-the-fold images) is at most 300 KB.
