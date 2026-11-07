---
id: "501"
title: One-shot migration script (xStatic HTML to content)
epic: Migration
status: done
priority: p0
size: L
owner: agent
depends_on: ["101", "401"]
---

## Why

The 50 legacy pages should be migrated mechanically, not retyped. SamMullins2026 got only ~22 thin pages done (audit §2).

## Scope

- `scripts/migrate/` (dev-only dependency on an HTML parser, justified in the PR). Reads the xStatic output (path as an argument) and writes `.md` content files at paths mirroring the legacy URLs.
- Maps known UIkit structures to blocks:
  - hero section → `hero`
  - `.uk-article` → `prose` (HTML → Markdown)
  - card grids → `cards`
  - galleries → `gallery`
  - `pre code` → `code`
  - blockquote → `quote`
- Rewrites `/media/...` references to new assets via `media-map.json`.
- Extracts title, description, date and cover from the page's meta and Open Graph tags.
- Every migrated item: `authorship: sam`.
- Produces a report of unmapped elements for manual follow-up.
- Reference only: the SamMullins2026 `src/content` (some hand-cleaned copy may be better there).

## Acceptance criteria

- [x] Running the script against the legacy output produces an entry for every legacy page (minus the merged duplicate), and `pnpm build` passes.
- [x] The unmapped-elements report is committed, and tickets 502–506 resolve every item in it.
- [x] The script is idempotent and documented, and is marked as deletable after launch.

## Verification (6 November 2026)

`pnpm build` passes with every legacy page migrated; `_docs/legacy/migration-report.md` is committed; the scripts in `scripts/migrate/` are documented, safe to re-run and one-shot.
