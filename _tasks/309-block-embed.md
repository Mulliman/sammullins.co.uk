---
id: "309"
title: Block: embed (click-to-load facade)
epic: Blocks
status: done
priority: p1
size: S
owner: agent
depends_on: ["303"]
---

## Why

Embed videos (e.g. the @sam_mullins YouTube channel) without third-party requests until the user opts in.

## Scope

- `provider: youtube` (extensible), `id`, `title` (required), `poster?` (local image).
- Renders a local poster plus a play button. On click it injects a `youtube-nocookie.com` iframe. Without JS it's a plain link to the video.
- CSP: `frame-src https://www.youtube-nocookie.com` only (coordinate with 702).

Each block: an `.astro` component in `src/blocks/`, its schema in 101, an example in `_docs/content-model.md`, and an entry on a `/_blocks/` kitchen-sink page (built, `noindex`, excluded from the sitemap) used by the a11y and visual checks.

## Acceptance criteria

- [x] Zero requests to Google domains before the click (Playwright test).
- [x] The iframe has a `title`.

## Verification (6 November 2026)

`tests/a11y/interactions.test.mjs` blocks and records every external request: none go to Google or YouTube before the click, and the iframe added afterwards has a title and a youtube-nocookie URL.
