---
id: "403"
title: Legacy /media/ paths resolve
epic: Media
status: todo
priority: p0
size: S
owner: agent
depends_on: ["401", "601"]
---

## Why

GitHub READMEs, our.umbraco.com, NuGet and npm listings hotlink `/media/...` images (audit §4).

## Scope

- From `media-map.json`, emit one stable public file per original at a predictable URL.
- Every legacy original **and** crop path (`--300x0`, `--600x0`, `--1200x0`, `--2400x0`) gets a 301 in `_redirects` to the closest stable file.
- Decide and document whether third-party hotlinks need a JPEG. GitHub and modern browsers render AVIF/WebP, so default to no JPEG.

## Acceptance criteria

- [ ] All 306 referenced paths return 200, or a 301 that ends in a 200 (enforced by 602).
