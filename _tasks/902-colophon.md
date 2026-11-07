---
id: "902"
title: "Colophon: last changed + authorship icon"
epic: Delight
status: done
priority: p0
size: S
owner: agent
depends_on: ["101"]
---

## Why

Honest, minimal provenance: when it last changed, and whether the *writing* is by Sam or by Sam + AI (decisions: *Delight v1*). The label describes the content, not how the page was built.

## Scope

- Last-changed date from git, taken from the latest commit touching the content file (computed at build time). Falls back to front matter `updated` and then `date`. Netlify needs full git history: no shallow clone, or set the clone depth.
- Authorship icon from front matter `authorship`:
  - `sam`: a small "Sam" mark
  - `sam-ai`: a "Sam + AI" mark
  - visible text label plus tooltip; not icon-only
- Placement: article and page footers, small and quiet. Optional "view source" link to the file on GitHub.
- Design the two icons as inline SVG, matching the signature style.

## Acceptance criteria

- [x] Changing a content file and committing updates its displayed date.
- [x] Both icons have accessible text.
- [x] The Markdown twin (901) includes `authorship` and `updated`.

## Verification (6 November 2026)

The date comes from the git log per file; the author icon has visually hidden text; twins carry `authorship` and `updated`.
