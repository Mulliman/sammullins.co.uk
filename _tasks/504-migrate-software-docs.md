---
id: "504"
title: Migrate software + xStatic/XPEDITE docs
epic: Migration
status: review
priority: p0
size: L
owner: agent
depends_on: ["501", "305"]
---

## Why

Package users still land on these docs from our.umbraco.com, NuGet and GitHub (decisions: *Legacy content*).

## Scope

- Products: is-baby-in-a-book, panocapture, postcapture, sage-of-empires, the-imposter, umbracofolio, xpedite-for-umbraco, xstatic-for-umbraco.
- Docs series:
  - xStatic: 8 pages, plus the `extending-xstatic-2` series of 8 subpages
  - XPEDITE: 2 pages
- Set `series`/`order` so nextPrev is generated automatically.
- `status: legacy` + `archived: true` for the Umbraco packages. Sam decides in review for the CaptureOne plugins and the games.
- The software index groups items into **current** (empty until the content series) and **earlier work**.

## Acceptance criteria

- [ ] All 27 `/software/...` legacy URLs are built at identical paths.
- [ ] Docs series navigation works end to end.
