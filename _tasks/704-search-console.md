---
id: "704"
title: Google Search Console via DNS
epic: Hosting & security
status: todo
priority: p1
size: S
owner: sam
depends_on: []
---

## Why

Search queries and crawl errors with nothing added to the page (decisions: *Analytics*).

## Scope

- **Sam:** add a Domain property for `sammullins.co.uk` and verify it with a DNS TXT record in Netlify DNS.
- Can be done **now**, before launch, to collect a baseline of the old site's 404s and queries.
- After cutover: submit `sitemap-index.xml` (1204).

## Acceptance criteria

- [ ] The property is verified.
- [ ] A baseline export of top pages and queries is saved to `_docs/legacy/search-baseline.md` (no personal data).
