---
id: "905"
title: "Prototypes: View Transitions & blur-to-sharp hero"
epic: Delight
status: in-progress
priority: p1
size: M
owner: pair
depends_on: ["301"]
---

## Why

Sam is open to both but wants to see them before committing (decisions: *Delight v1*). This is a decision ticket.

## Scope

- **Prototype A, cross-document View Transitions:** `@view-transition { navigation: auto; }`, with the card image morphing into the destination hero via matching `view-transition-name`s. CSS-only. Falls back to normal navigation.
- **Prototype B, blur-to-sharp hero:** a scroll-driven animation where the blurred background sharpens (or the framed image comes into focus) as you scroll. Compare it side by side with today's parallax-blur hero.
- Both behind a feature flag in site settings, so they can be turned on or off without code changes.
- Show both on the deploy preview. Record a short screen capture of each for the PR.

## Acceptance criteria

- [ ] Sam picks for each: ship / tweak / drop. The decision is recorded in `_docs/decisions.md`.
- [ ] Whatever ships respects reduced motion and adds no JS.
- [ ] Dropped prototypes are removed, not left as dead code.

## Notes

- Until ticket 906, prototype B (and the existing hero drift) never ran in a production build: the CSS minifier folded the `animation` shorthand and `animation-timeline` into a declaration Chrome drops. Compare the two heroes on a build that includes 906. When writing scroll-driven animations, use longhands only; see ticket 906.
