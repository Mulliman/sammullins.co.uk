---
id: "602"
title: "CI test: every legacy URL & media path resolves"
epic: URLs & redirects
status: review
priority: p0
size: M
owner: agent
depends_on: ["601", "801"]
---

## Why

"All current links either work or get redirected gracefully" is the core migration promise. It's proven, not assumed.

## Scope

- Test reads `_docs/legacy/urls.txt` (50 pages) and `_docs/legacy/media-referenced.txt` (306 media paths).
- Runs against `pnpm preview`, or a local static server that honours `_redirects` (e.g. `netlify dev`, or a tiny server that parses `_redirects`).
- Each path must be a 200, or a 301 that ends in a 200 within one hop.
- Also tests that the non-trailing-slash variant of each page URL resolves (or confirms Netlify handles it, documented).
- A required status check on `main`.

## Acceptance criteria

- [x] Deleting any migrated page makes CI fail with that URL named.
- [ ] Report: counts of 200 vs 301, with zero failures.

## Verification (6 November 2026)

Left: print the counts of 200s and 301s in the test output (agent).
