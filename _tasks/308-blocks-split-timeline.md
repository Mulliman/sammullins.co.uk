---
id: "308"
title: Blocks: split, timeline
epic: Blocks
status: done
priority: p0
size: M
owner: agent
depends_on: ["102"]
---

## Why

Replaces Grid. Timeline is new, for the CV (roles, CCAF, milestones).

## Scope

- `split`: `columns: [Block[], Block[]]` (nested blocks, one level deep only), `ratio: 1:1|1:2|2:1`, `reverseOnMobile?`.
- `timeline`: items of `date`/`range`, `title`, `org?`, `body` (markdown), `kind: role|cert|milestone`. Semantic `<ol>`.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] The schema rejects a split nested inside a split.
- [x] The timeline reads in a logical order with styles off.

## Verification (6 November 2026)

The schema allows only non-split blocks inside `split`; the timeline is an ordered list in DOM order.
