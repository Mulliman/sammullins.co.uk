---
id: "307"
title: Blocks: quote, code
epic: Blocks
status: done
priority: p0
size: S
owner: agent
depends_on: ["102"]
---

## Why

Replaces ContentQuote and ContentCodeSnippet.

## Scope

- `quote`: `text`, `attribution?`, `source?` (URL). Uses `<figure><blockquote cite>` and `<figcaption>`.
- `code`: `lang`, `code`, `filename?`, `highlight?` (line ranges).
  - Highlighted at build time with Shiki, using dual light/dark themes through CSS variables.
  - Copy button: a progressive enhancement with an `aria-live` "Copied" announcement.
- Fenced code blocks inside `prose` get the same treatment.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] No highlighting JS shipped.
- [x] The copy button exists only when JS runs.
- [x] Code blocks scroll horizontally inside themselves; the page never scrolls sideways at 320px.

## Verification (6 November 2026)

Prism runs at build time with no client JS; the copy button is `.js-only`; code wraps instead of scrolling (a recorded decision), and the a11y test checks for no sideways scroll at 320px.
