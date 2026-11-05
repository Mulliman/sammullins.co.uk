---
id: "503"
title: Migrate articles (+ merge duplicate)
epic: Migration
status: review
priority: p0
size: M
owner: agent
depends_on: ["501"]
---

## Why

Keep all articles, with dated ones in the Archive (decisions: *Legacy content*).

## Scope

- Migrate all 9 articles to `src/content/articles/<slug>.md`, at the same URLs.
- Set `archived: true` on all of them (all are Umbraco/xStatic/2021-era), unless Sam marks any as current in review.
- Merge `xstatic-adds-git-and-ftp-support` and `xstatic-introduces-git-and-ftp-support`. Keep the better one; 301 the other (via 601).
- Fix code blocks, images and internal links.

## Acceptance criteria

- [ ] 8 article pages plus 1 redirect.
- [ ] Each archived article shows the legacy banner.
- [ ] Zero broken internal links.
