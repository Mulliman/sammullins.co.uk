---
id: "1410"
title: "Whole-site consistency review against the home page"
epic: Site-wide design
status: todo
priority: p1
size: M
owner: agent
depends_on: ["1403", "1405", "1406", "1407", "1408", "1409"]
---

## Why

Sam: "Once this is complete everything should look consistent with the home page."

## Scope

Done by the orchestrator: build once, screenshot every page type (home, CV, software index, a product page, a docs page, party games index and a game page, articles, an article, archive, 404) at 1440, 768 and 390 in light and dark, fix inconsistencies, run `pnpm verify`, commit and push `509-symmetry`, and publish the screenshots for Sam.

## Acceptance criteria

- [ ] Every page type follows the symmetry rules; any exceptions are listed for Sam.
- [ ] `pnpm verify` passes and the branch is pushed.
