---
id: "102"
title: Block renderer & page routing
epic: Content model
status: review
priority: p0
size: M
owner: agent
depends_on: ["101"]
---

## Why

Components can be added to pages in any order, like Umbraco Block List (decisions: *Block catalogue v1*).

## Scope

- `<Blocks blocks={...} />` maps `type` to a component, with exhaustive TS checking: adding a block type without a component is a type error.
- Routes:
  - `/` (home)
  - `/[...slug]/` for `pages`
  - `/articles/[...slug]/`
  - `/software/[...slug]/` (nested docs)
  - `/photography/photoshare21/[slug]/`
  - collection index pages
- **The URL is derived from the file path.** Content folder structure mirrors legacy URLs exactly.
- Page layout handles `<title>`, meta description, canonical, Open Graph/Twitter cards (cover image), JSON-LD (`Person` on home, `Article`/`BlogPosting` on articles).
- Archived pages render the legacy callout banner automatically (from the `archived` flag).

## Acceptance criteria

- [ ] A page with blocks in arbitrary order renders them in that order.
- [ ] Every route emits a canonical URL with a trailing slash.
- [ ] A missing component mapping fails `pnpm check`.
