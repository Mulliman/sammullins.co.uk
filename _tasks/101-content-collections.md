---
id: "101"
title: Content collections & Zod schemas
epic: Content model
status: review
priority: p0
size: L
owner: agent
depends_on: ["003"]
---

## Why

Pages are typed block lists, so a malformed AI edit fails the build instead of shipping (decisions: *Framework (final)*, *Block catalogue v1*, *Micro-feed*).

## Scope

- `src/content.config.ts` with glob loaders for these collections:
  - `pages`: home, cv, archive, photography landing, misc
  - `articles`
  - `software`, including nested docs series
  - `albums`: photography
- Shared base schema:
  - `title`, `description` (required, ≤ 160 chars)
  - `date`, `updated?`
  - `tags[]`
  - `cover?`: image reference plus required `alt`
  - `authorship: 'sam' | 'sam-ai'` (required)
  - `archived: boolean` (default false)
  - `hidden: boolean` (default false; excluded from nav and listings)
  - `seo?` overrides
- Collection-specific fields:
  - articles: `kind: 'article' | 'note'`
  - software: `series?`, `order?`, `parent?`, `status: 'active' | 'legacy'`
- `blocks: Block[]` as a `z.discriminatedUnion('type', [...])` of the 15 v1 blocks. Define the schemas here, even before the components exist.
- Use the image schema helper so cover and block images are validated at build time.
- The markdown body is allowed and renders as an implicit trailing `prose` block when `blocks` is absent.
- Content files are `.md` with YAML front matter. **No MDX.**

## Acceptance criteria

- [ ] Schema unit tests cover:
  - [ ] a valid page passes
  - [ ] an unknown block `type` fails
  - [ ] a missing image `alt` fails
  - [ ] a missing `authorship` fails
- [x] Error messages name the file and field.
- [x] Exported TS types (`Block`, `BlockOf<'hero'>`) are used by components.
- [x] `_docs/content-model.md` documents every field with one YAML example per block.

## Verification (6 November 2026)

Left: there are no schema unit tests yet (agent).
