---
id: "507"
title: Archive index page
epic: Migration
status: todo
priority: p0
size: S
owner: agent
depends_on: ["305", "503", "504"]
---

## Why

Dated content lives in an Archive section at unchanged URLs (decisions: *Legacy content*).

## Scope

- `/archive/` page built from blocks: an intro, then a `listing` of archived articles, archived software (grouped), and a photography link.
- Linked from the footer and from the legacy banner.

## Acceptance criteria

- [ ] Every `archived: true` item appears on `/archive/` automatically.
- [ ] No archived item appears in the main Articles or Software listings by default.
