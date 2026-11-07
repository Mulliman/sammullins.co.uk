---
id: "1304"
title: "Style guide: every block and every variant, with its YAML"
epic: Style guide
status: done
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

- [x] Every block type in the schema has a section (test: the schema's block types match the guide's sections).
- [x] Every enum option of every block appears at least once (test).
- [x] Each example's YAML passes schema validation (test), so the snippets can be pasted into a page.
- [x] `/blocks-demo/*` redirect to the guide; the legacy URL test passes.

## Progress

- Schema parsing moved to `scripts/skills/schema-blocks.mjs` (with `.d.mts` types), shared by the block catalogue and the guide. Stripping comments first fixes a bug where a doc comment above a field hid it: `image.frame` and `image.backdrop` were missing from the catalogue. Surface and align options are now listed in the catalogue too.
- Examples: `src/content/style-guide/components.yaml`, a collection (`styleGuideExamples`) validated by the real `blockSchema` at build time. Each example's YAML is the text under its `block:` key, shown beside the rendered block with the Code block's copy button.
- `src/pages/style-guide/components/index.astro`: a section per block type with its summary, fields table (from the schema), and every example. The build fails if a block type has no example or an enum option has none.
- Removed `src/content/pages/blocks-demo/`; 301s added in `src/data/redirects.json` from `/blocks-demo/text/`, `/media/`, `/lists/` and `/theme-christmas/` to `/style-guide/components/`. The sitemap filter for `/blocks-demo/` is gone, as nothing uses it.
- `tests/a11y/interactions.test.mjs` now uses the components page. Added `tests/style-guide-components.test.mjs`.
- Ready flag set for Components in `src/lib/style-guide.ts`.
- Known gaps: `kind: note` has no published notes, so two examples (cards and listing) render nothing and say so in their titles. The `body` example uses a stand-in, not a page's Markdown. Visual review in a browser was not done.
