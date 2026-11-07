---
id: "802"
title: "CI: axe WCAG 2.2 AA on every page"
epic: Quality gates
status: done
priority: p0
size: M
owner: agent
depends_on: ["801"]
---

## Why

WCAG 2.2 AA is enforced, not aspirational (decisions: *Accessibility target*).

## Scope

- Playwright + `@axe-core/playwright` (dev deps, justified) runs over **every** HTML file in `dist/`, plus the `/_blocks/` kitchen sink.
- Tags: `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`.
- Runs in **both** light and dark themes (`colorScheme` emulation).
- Extra checks:
  - keyboard smoke test on nav, the gallery lightbox and the theme toggle
  - `prefers-reduced-motion` produces no animations
  - 320px viewport has no horizontal scroll
- The contrast token check from 201.

## Acceptance criteria

- [x] Zero axe violations, with no blanket disables (any rule exception is per-element, with a comment and a linked issue).
- [x] A required status check.

## Verification (6 November 2026)

`tests/a11y/axe.test.mjs` has no disabled rules; "Accessibility (axe, WCAG 2.2 AA)" is a required check in the Main ruleset.
