---
id: "904"
title: Signature draw + hover animation
epic: Delight
status: todo
priority: p1
size: M
owner: agent
depends_on: ["203"]
---

## Why

The Pacifico logo drawing itself is the craft moment (decisions: *Delight v1*).

## Scope

- Convert the logo or wordmark to an SVG path (from `combo-logo.svg` / Pacifico outlines), optimised and inline.
- First visit per session: a stroke-draw animation (`stroke-dasharray`/`dashoffset`) of ~1.2s, then a fill fade-in. Session flag stored in `sessionStorage`, wrapped in try/catch.
- Hover/focus: a subtle flourish, e.g. a re-trace of the underline swash or a gentle ink wobble. Must work for keyboard focus too.
- CSS-only where possible. Under `prefers-reduced-motion` the logo is static.
- If the logo becomes SVG, Pacifico may no longer need loading at all (update 202).

## Acceptance criteria

- [ ] No layout shift during the animation.
- [ ] Reduced motion means no animation.
- [ ] The logo link keeps an accessible name ("Sam Mullins, home").
- [ ] Sam approves the feel on the preview.
