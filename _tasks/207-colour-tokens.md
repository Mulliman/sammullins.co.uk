---
id: "207"
title: Centralise colours in a theme, ban literals, add page themes
epic: Design system
status: done
priority: p0
size: M
owner: agent
depends_on: ["204"]
---

## Why

Sam kept the original colours (205 is no longer a palette change) but wants every colour set in a theme, never hard-coded, with a rule that stops literals creeping back into components. He also wants per-page themes for campaigns, starting with an advent calendar in Christmas colours.

## Scope

- Move every colour value into `src/styles/themes/default.css` as semantic tokens: page, text, inverse surfaces, callout tones, media overlays, logo stops, shadows and code highlighting. Light and dark values stay as they were.
- Replace the 29 literals in components and the ones in `global.css` with tokens. The logo's gradient stops get classes, so the theme colours them.
- Move the console secret's terminal theme to `themes/terminal.css`; the console greeting reads its colours from tokens.
- Per-page themes: a `theme` front matter field (`default` | `christmas`) sets `data-page-theme` on `<html>`. A starter `themes/christmas.css` (evergreen, cranberry, gold; AA in light and dark) and a hidden demo page, `/blocks-demo/theme-christmas/`.
- A hygiene rule fails the build on any colour literal (hex, colour functions, named colours) in `src/` outside `src/styles/themes/`, with self-tests.

## Acceptance criteria

- [x] No colour literal in `src/` outside `src/styles/themes/` (`tests/hygiene.test.mjs`).
- [x] The rule has tests proving it catches hex, `rgb()`/`hsl()`/`oklch()`, named colours and console styling, and ignores fragments such as `href="#add"` and `url(#gradient)`.
- [x] Pixel comparison of 8 pages in light and dark before and after: identical, except the current-page nav link in dark mode. A higher-specificity dark override used to leave it grey; it now shows in the strong colour, as in light mode.
- [x] A page with `theme: christmas` renders in the Christmas colours in light and dark, and passes axe.
- [x] `_docs/design-tokens.md`, AGENTS.md, decisions.md and the content model document the theme folder and the rule.

## Notes

- `src/styles/themes/README.md` explains how to add a theme. Every token a theme sets in light must also be set in both dark blocks.
- `<meta name="theme-color">` can't read CSS, so its value lives in `themes/meta.ts`.
