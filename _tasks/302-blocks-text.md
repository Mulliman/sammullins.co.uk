---
id: "302"
title: Blocks: intro, prose, callout
epic: Blocks
status: done
priority: p0
size: S
owner: agent
depends_on: ["102"]
---

## Why

Replaces ArticleIntro, ContentHeading, RichText and PageContent. Callout is new, and is also used for the legacy/archived banner.

## Scope

- `intro`: `kicker?`, `heading`, `lead` (markdown inline), `align`.
- `prose`: markdown string rendered with a readable measure (~70ch); headings get anchor links.
- `callout`: `tone: note|tip|warning|legacy`, `title?`, `body` (markdown). Uses `role="note"` and an icon plus a text label, never colour alone.

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] Markdown is rendered at build time; raw HTML in markdown is **disabled or sanitised** (no `set:html` of untrusted strings).
- [x] Heading anchors are keyboard-reachable and announced sensibly.

## Verification (6 November 2026)

`src/lib/markdown.ts` escapes raw HTML, and the hygiene test restricts `set:html`; heading anchors are links with `aria-label="Link to this heading"`.
