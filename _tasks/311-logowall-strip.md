---
id: "311"
title: "Logo wall: compact strip with transparent logos"
epic: Blocks
status: todo
priority: p1
size: S
owner: agent
depends_on: ["205"]
---

## Why

The logo wall shows 12 logos on white tiles, four to a row, and fills a whole screen of the home page. In dark mode the white tiles look like boxes.

## Scope

- A `logoWall` variant, `strip`: one row of smaller, single-colour transparent logos that wraps on narrow screens. No autoplaying marquee.
- Generate transparent versions of the logo masters (white backgrounds removed), stored as new AVIF masters.

## Acceptance criteria

- [ ] Every logo's alt text is the client's full name, with no abbreviations.
- [ ] Logos are readable in light and dark themes without white tiles.
- [ ] The strip is at most 160px tall at 1280px wide.

## Notes

The backlog PR already fixed the full client names in the home content.
