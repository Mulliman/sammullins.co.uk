---
id: "1304"
title: "Style guide: every block and every variant, with its YAML"
epic: Style guide
status: todo
priority: p1
size: L
owner: agent
depends_on: ["1301"]
---

## Why

The block schema (`src/content.config.ts`) is the component API: 17 block types, each with variants such as hero `blurred`/`image`/`plain`, callout tones, card styles, columns and surfaces. Today the only showcase is three hand-written `blocks-demo` pages that cover some variants. Authors (Sam and agents) need to see every option and copy the YAML that produces it.

## Scope

- A components page per block group, as in the SbS guide (atoms, structure, feedback, data and content). Each block shows:
  - every variant and every enum option, rendered by the real block component
  - the YAML that produced it, next to the example, with a copy button
  - its fields, from the same source as `.agents/skills/_shared/block-catalogue.md`
- Variants come from the schema: iterate the Zod enums where possible, so a new variant appears without editing the guide. Example content comes from one fixtures file.
- Each block renders on default, muted and inverse surfaces where the block has a `surface` field.
- Move the `blocks-demo` pages into the guide and 301 their URLs to the matching guide pages (rule 2). Update `tests/a11y/interactions.test.mjs`, which uses `/blocks-demo/media/`.

## Acceptance criteria

- [ ] Every block type in the schema has a section (test: the schema's block types match the guide's sections).
- [ ] Every enum option of every block appears at least once (test).
- [ ] Each example's YAML passes schema validation (test), so the snippets can be pasted into a page.
- [ ] `/blocks-demo/*` redirect to the guide; the legacy URL test passes.
