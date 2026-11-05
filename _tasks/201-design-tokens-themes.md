---
id: "201"
title: Design tokens, light/dark themes & toggle
epic: Design system
status: review
priority: p0
size: M
owner: agent
depends_on: ["003"]
---

## Why

Evolve the current look; add light/dark (decisions: *Visual direction*, *Accessibility target*).

## Scope

- **CSS only.** No UIkit and no CSS framework. Use native CSS nesting, cascade layers, `color-mix()`, container queries.
- Tokens on `:root`: colour, space, radius, shadow, type scale, motion durations. The dark/muted section rhythm from the current site becomes `surface` variants (`default`, `muted`, `inverse`).
- Themes:
  - Follow `prefers-color-scheme` by default.
  - The manual toggle sets `data-theme` on `<html>` and is remembered in `localStorage` (wrapped in try/catch).
  - **No flash of the wrong theme**: a tiny inline script, hashed for the CSP.
- Contrast: text ≥ 4.5:1 everywhere; aim for 7:1 on body text and on thin display headings.
- `prefers-reduced-motion` disables all non-essential motion globally.
- Visible `:focus-visible` ring on every interactive element.

## Acceptance criteria

- [ ] With JS disabled, the system theme still applies.
- [ ] Without JS the toggle is hidden; it only appears once JS has loaded.
- [ ] Every token pair used for text passes contrast checks in both themes. A script verifies this in CI.
- [ ] `_docs/design-tokens.md` lists the tokens.
